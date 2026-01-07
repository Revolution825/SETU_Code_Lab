import docker from "../infrastructure/docker";

export async function startContainer(image:string, code:string): Promise<string> {
//    await new Promise<void>((resolve, reject) => {
//        docker.pull(image, (err: any, stream: NodeJS.ReadableStream) => {
//            if(err) return reject(err);
//            docker.modem.followProgress(stream, (err) => (err ? reject(err) : resolve()))
//        });
//    });

    const container = await docker.createContainer({
        Image: image,
        WorkingDir: "/app",
Cmd: ["sh", "-c", `
cat << 'EOF' > Main.java
${code}
EOF
javac Main.java
java -cp ".:/app/*" Main
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