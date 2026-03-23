import docker from "../infrastructure/docker";
import { TestCase, TestCaseResult } from "../types/testCase";
import { splitParams } from "./sharedUtils";

function preprocessJavaInput(placeholder_code: string, code: string): string {
  const signatureRegex =
    /public\s+static\s+([\w<>\[\], ?]+)\s+(\w+)\s*\(([^)]*)\)/;
  const match = placeholder_code.match(signatureRegex);
  if (!match) {
    throw new Error("Could not find method signature in placeholder code.");
  }
  const returnType = match[1];
  const functionName = match[2];
  const paramsList = match[3];

  const params = splitParams(paramsList);
  const parsedParams = params.map((p) => {
    const match = p.match(/(.+)\s+(\w+)$/);
    if (!match) {
      throw new Error("Invalid parameter format: " + p);
    }
    return {
      type: match[1].trim(),
      name: match[2].trim(),
    };
  });

  const inputFields = parsedParams
    .map((p) => {
      return `public ${p.type} ${p.name};`;
    })
    .join("\n    ");

  const paramNames = parsedParams.map((p) => p.name);

  const functionCallLine = `${returnType} result = ${functionName}(${paramNames.map((n) => "input." + n).join(", ")});`;

  return `
    import com.fasterxml.jackson.databind.ObjectMapper;
    import java.util.*;

    public class Main {
        static final ObjectMapper mapper = new ObjectMapper();
        ${code}
        static class Input {
            ${inputFields}
        }
        public static void main(String[] args) {
            try {
                Input input = mapper.readValue(System.in, Input.class);
                ${functionCallLine}
                System.out.println(mapper.writeValueAsString(result));
            } catch (Exception e) {
                System.out.println("ERROR:" + e.getMessage());
            }
        }
    }
    `;
}

function preprocessPythonInput(placeholder_code: string, code: string): string {
  const signatureRegex = /def\s+(\w+)\s*\(([^)]*)\)/;
  const match = placeholder_code.match(signatureRegex);
  if (!match) {
    throw new Error(
      "Could not find method signature in Python placeholder code.",
    );
  }
  const functionName = match[1];

  return `
import json
import sys

${code}

input_data = json.load(sys.stdin)
result = ${functionName}(**input_data)
print(json.dumps(result))
`;
}

export async function startContainer(
  image: string,
  placeholder_code: string,
  code: string,
  testCase: TestCase,
  language: string,
): Promise<TestCaseResult> {
  const processedInput = JSON.stringify(testCase.input_value);
  const preprocessedCode =
    language === "python"
      ? preprocessPythonInput(placeholder_code, code)
      : preprocessJavaInput(placeholder_code, code);
  const startTime = Date.now();

  const cmd =
    language === "python"
      ? `
cat << 'EOF' > main.py
${preprocessedCode}
EOF
cat << 'ENDINPUT' > input.json
${processedInput}
ENDINPUT
python3 main.py < input.json
`
      : `
cat << 'EOF' > Main.java
${preprocessedCode}
EOF
cat << 'ENDINPUT' > input.json
${processedInput}
ENDINPUT
javac Main.java
java -cp ".:/app/*" Main < input.json
`;

  const container = await docker.createContainer({
    Image: image,
    WorkingDir: "/app",
    Cmd: ["sh", "-c", cmd],
    Tty: false,
    AttachStdout: true,
    AttachStderr: true,
    HostConfig: {
      NetworkMode: "none",
      Memory: 256 * 1024 * 1024,
      CpuPeriod: 100000,
      CpuQuota: 50000,
      PidsLimit: 50,
    },
  });

  await container.start();

  const timeout = setTimeout(async () => {
    try {
      await container.kill();
    } catch {}
  }, 100000);

  try {
    await container.wait();
  } finally {
    clearTimeout(timeout);
  }

  const endTime = Date.now();
  const logs = await container.logs({ stdout: true, stderr: true });
  await container.remove({ force: true }).catch(() => {});

  const combinedOutput = stripDockerHeader(logs as Buffer);

  let actualOutput: any;
  try {
    actualOutput = JSON.parse(combinedOutput);
  } catch {
    actualOutput = combinedOutput;
  }

  const passed = deepEqual(actualOutput, testCase.expected_value);

  return {
    test_case_id: testCase.test_case_id as number,
    passed,
    actual_output: combinedOutput,
    runtime_ms: endTime - startTime,
  };
}

function stripDockerHeader(buffer: Buffer): string {
  let result = "";
  let i = 0;
  while (i < buffer.length) {
    const headerSize = 8;
    const payloadLength = buffer.readUInt32BE(i + 4);
    const payloadStart = i + headerSize;
    const payloadEnd = payloadStart + payloadLength;
    result += buffer.slice(payloadStart, payloadEnd).toString("utf8");
    i = payloadEnd;
  }
  return result.trim();
}

function deepEqual(a: any, b: any): boolean {
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null) return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.join() !== keysB.join()) return false;
  return keysA.every((key) => deepEqual(a[key], b[key]));
}
