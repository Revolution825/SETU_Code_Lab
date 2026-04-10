import Docker from "dockerode";

const docker = new Docker(
  process.env.DOCKER_HOST
    ? { host: "localhost", port: 2375, protocol: "http" }
    : { socketPath: "/var/run/docker.sock" },
);

export default docker;
