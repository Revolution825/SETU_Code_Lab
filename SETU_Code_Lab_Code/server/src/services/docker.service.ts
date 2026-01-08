import docker from "../infrastructure/docker";
import { TestCase } from "../models/testCase.model";

function preprocessJavaInput(code:string):string {
    const signatureRegex = /public\s+static\s+(\w+)\s+(\w+)\(([^)]*)\)/;
    const match = code.match(signatureRegex);
    if(!match) {
        throw new Error("Could not find method signature in code.");
    }
    const returnType = match[1];
    const functionName = match[2];
    const paramsList = match[3];

    const params = paramsList.split(",").map(p => p.trim()).filter(p => p.length > 0);

    const inputFields = params.map(p => {
        const [type, name] = p.split(/\s+/);
        return `public ${type} ${name};`;
    }).join("\n    ");

    const paramNames = params.map(p => p.split(/\s+/)[1]);

    const functionCallLine = `${returnType} result = ${functionName}(${paramNames.map(n=> "input." + n).join(", ")});`;

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

export async function startContainer(image:string, code:string, testCase:TestCase): Promise<string> {

    const processedInput = JSON.stringify(testCase.input_value);
    const preprocessedCode = preprocessJavaInput(code);

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

    if (logs.toString().trim() == testCase.expected_value.toString()) {
        return "Pass";
    }

    return "Fail";
}