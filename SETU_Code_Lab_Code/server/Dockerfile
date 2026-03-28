FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Run
FROM node:20-alpine

WORKDIR /app

# Only install production dependencies in the final image
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist

# Docker socket access
# The server spawns Docker containers for student code execution.
# Docker socket is mounted at runtime in docker-compose.yml.
# Docker CLI installed here so the server can issue docker run commands.
RUN apk add --no-cache docker-cli

EXPOSE 5000

CMD ["node", "dist/index.js"]