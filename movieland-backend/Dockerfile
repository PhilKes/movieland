FROM maven:3.6.3-openjdk-17-slim
MAINTAINER PhilKes
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
ENTRYPOINT mvn spring-boot:run