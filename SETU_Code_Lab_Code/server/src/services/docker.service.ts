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

    const params = paramsList.split(",").map(p => p.trim()).filter(p => p.length > 0);
    const parsedParams = params.map(p => {
        const lastSpace = p.lastIndexOf(" ");
        if (lastSpace === -1) {
            throw new Error("Invalid parameter format: " + p);
        }
        return {
            type: p.substring(0, lastSpace).trim(),
            name: p.substring(lastSpace + 1).trim()
        }
    });

    const inputFields = parsedParams.map(p => {
        return `public ${p.type} ${p.name};`;
    }).join("\n    ");

    const paramNames = parsedParams.map(p => p.name);

    const functionCallLine = `${returnType} result = ${functionName}(${paramNames.map(n => "input." + n).join(", ")});`;

    const processedCode = `
    import com.fasterxml.jackson.databind.ObjectMapper;

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
                System.out.println(result);
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
        Tty: true,
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

    const logs = await container.logs({
        stdout: true,
        stderr: true
    });
    await container.remove();
    const endTime = Date.now();
    const combinedOutput = logs.toString().trim();
    let actualOutput: any
    try {
        actualOutput = JSON.parse(combinedOutput);
    } catch {
        actualOutput = combinedOutput;
    }
    const passed = JSON.stringify(actualOutput) == JSON.stringify(testCase.expected_value);
    let result: TestCaseResult = {
        test_case_id: testCase.test_case_id as number,
        passed: passed,
        actual_output: combinedOutput,
        runtime_ms: endTime - startTime
    };

    return result;
}