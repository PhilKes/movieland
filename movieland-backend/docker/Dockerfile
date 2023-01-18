FROM openjdk:17-jdk-slim-buster
MAINTAINER PhilKes
ENV finalName=movieland-backend.jar
COPY target/$finalName $finalName
ENTRYPOINT java -jar /$finalName