import docker from "../infrastructure/docker";
import { TestCase, TestCaseResult } from "../types/testCase";

function preprocessJavaInput(placeholder_code: string, code: string): string {
    const signatureRegex = /public\s+static\s+([\w<>\[\], ?]+)\s+(\w+)\s*\(([^)]*)\)/;
    const match = placeholder_code.match(signatureRegex);
    if (!match) {
        throw new Error("Could not find method signature in placeholder code.");
    }
    const returnType = match[1];
    const functionName = match[2];
    const paramsList = match[3];

    function splitParams(paramsList: string): string[] {
        const params: string[] = [];
        let current = "";
        let depth = 0;

        for (let i = 0; i < paramsList.length; i++) {
            const c = paramsList[i];
            if (c === '<') depth++;
            if (c === '>') depth--;
            if (c === ',' && depth === 0) {
                params.push(current.trim());
                current = "";
            } else {
                current += c;
            }
        }
        if (current.trim() !== "") {
            params.push(current.trim());
        }
        return params;
    }

    const params = splitParams(paramsList);
    const parsedParams = params.map(p => {
        const match = p.match(/(.+)\s+(\w+)$/);
        if (!match) {
            throw new Error("Invalid parameter format: " + p);
        }
        return {
            type: match[1].trim(),
            name: match[2].trim()
        };
    });

    const inputFields = parsedParams.map(p => {
        return `public ${p.type} ${p.name};`;
    }).join("\n    ");

    const paramNames = parsedParams.map(p => p.name);

    const functionCallLine = `${returnType} result = ${functionName}(${paramNames.map(n => "input." + n).join(", ")});`;

    const processedCode = `
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
                Input input = mapper.readValue(args[0], Input.class);
                ${functionCallLine}
                System.out.println(mapper.writeValueAsString(result));
            } catch (Exception e) {
                System.out.println("ERROR:" + e.getMessage());
            }
        }
    }
    `;

    return processedCode;
}

export async function startContainer(image: string, placeholder_code: string, code: string, testCase: TestCase): Promise<TestCaseResult> {

    const processedInput = JSON.stringify(testCase.input_value);
    const preprocessedCode = preprocessJavaInput(placeholder_code, code);
    const startTime = Date.now();
    const container = await docker.createContainer({
        Image: image,
        WorkingDir: "/app",
        Cmd: ["sh", "-c", `
cat << 'EOF' > Main.java
${preprocessedCode}
EOF
javac Main.java
java -cp ".:/app/*" Main '${processedInput}'
`],
        Tty: false,
        AttachStdout: true,
        AttachStderr: true,
        HostConfig: {
            NetworkMode: "none",
            Memory: 256 * 1024 * 1024,
            CpuShares: 256
        }
    });

    await container.start();
    await container.wait();

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

    const logs = await container.logs({
        stdout: true,
        stderr: true
    });
    await container.remove();
    const endTime = Date.now();
    const combinedOutput = stripDockerHeader(logs);
    let actualOutput: any
    try {
        actualOutput = JSON.parse(combinedOutput);
    } catch {
        actualOutput = combinedOutput;
    }
    function deepEqual(a: any, b: any): boolean {
        return JSON.stringify(a, Object.keys(a).sort()) === JSON.stringify(b, Object.keys(b).sort());
    }
    const passed = deepEqual(actualOutput, testCase.expected_value);
    let result: TestCaseResult = {
        test_case_id: testCase.test_case_id as number,
        passed: passed,
        actual_output: combinedOutput,
        runtime_ms: endTime - startTime
    };

    return result;
}