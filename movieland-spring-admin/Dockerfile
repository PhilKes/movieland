FROM maven:3.6.3-openjdk-17-slim
MAINTAINER PhilKes
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package
ENTRYPOINT ["java", "-jar", "/app/target/movieland-spring-admin.jar"]