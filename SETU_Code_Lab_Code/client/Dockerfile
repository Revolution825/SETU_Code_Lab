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

# Get custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]