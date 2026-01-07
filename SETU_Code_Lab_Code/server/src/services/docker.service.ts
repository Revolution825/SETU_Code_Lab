import docker from "../infrastructure/docker";

function preprocessJavaInput(code:string):string {
    const processedCode = `
    import com.fasterxml.jackson.databind.ObjectMapper;

    public class Main {
        static final ObjectMapper mapper = new ObjectMapper();
        ${code}
        static class Input {
            // TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP
            public int x;
        }
        public static void main(String[] args) {
            try {
                Input input = mapper.readValue(args[0], Input.class);
                // TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP
                boolean result = isPalindrome(input.x);
                System.out.println("RESULT:" + result);
            } catch (Exception e) {
                System.out.println("ERROR:" + e.getMessage());
            }
        }
    }
    `;

    return processedCode;
}

export async function startContainer(image:string, code:string, input:string): Promise<string> {

    const processedInput = JSON.stringify(input);
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

    return logs.toString();

}