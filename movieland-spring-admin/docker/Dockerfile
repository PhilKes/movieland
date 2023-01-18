FROM openjdk:17-jdk-slim-buster
MAINTAINER PhilKes
ENV finalName=movieland-spring-admin.jar
COPY target/$finalName $finalName
ENTRYPOINT  java -jar /$finalName