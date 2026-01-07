# Official JDK Image
FROM eclipse-temurin:17-jdk

# Working directory
WORKDIR /app

# Copy dependencies into /app
COPY libs/*.jar /app/

# Set classpath to include all jars
ENV CLASSPATH="/app/*"
