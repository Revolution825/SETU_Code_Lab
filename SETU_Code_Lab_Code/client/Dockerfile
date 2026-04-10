# Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Serve
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template, envsubst will replace ${BACKEND_HOST} at container startup
COPY default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]