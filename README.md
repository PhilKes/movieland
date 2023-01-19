# MovieLand - Full Stack Cinema Web App <img src="https://i.imgur.com/MHO0XoY.png" width="76"> 

<p align="center"><img src="/doc/admin.gif" width="400px" >   <img src="/doc/reservation.gif" width="400px"></p>

This is a showcase project for a **Full Stack Web Application** for a cinema operator use-case scenario.

## Backend - Spring Boot 3 <img src="./doc/spring.png" width="26">
* JPA/Hibernate to interact with the database
* **REST API** for external access
* Async REST-Tasks with progress indication
* Role-based **JWT Token** Authentication
* Access to <a href="https://developers.themoviedb.org/3" target="_blank">TMDB Movie Database API</a>

Note: You need to get your own TMDB API Key to run the backend on your local machine.
Add it to the `application.properties` in the `tmdbApi.apikey` value.

## Frontend - NuxtJS <img src="./doc/nuxt.png" width="30">
* Vue **User Interface** with Nuxt.js
* Axios as REST-Client
* Webpages for **User Login/Registration, Reservations**
* **Admin Dashboard** Page for Statistics, Managing, Generating
* QRCode Scanning of Reservation to validate tickets


## Database - PostgreSQL <img src="./doc/postgresql.png" width="26">
* PostgreSQL image from <a href="https://hub.docker.com/_/postgres" target="_blank">Dockerhub</a>
* Persistent **Data layer** for Movies, Shows, User etc.

## Monitoring
### Prometheus <img src="./doc/prometheus.png" width="30">
<a href="http://localhost:9090" target="_blank">http://localhost:9090</a>

### Grafana <img src="./doc/grafana.png" width="30">
<a href="http://localhost:3000" target="_blank">http://localhost:3000</a>
#### Dashboards:
* https://grafana.com/grafana/dashboards/6756-spring-boot-statistics/

## Docker <img src="./doc/docker.png" width="32">
Full Docker Support with **Docker-compose**

* To build and run the Fullstack Application from local Dockerfiles:
```shell
mvn clean install
docker-compose -f docker-compose-local.yml up --build
```

* To run the Fullstack Application from latest <a href="https://hub.docker.com/u/philkes" target="_blank">Dockerhub images</a>:

  `docker-compose up --build`


* Starts and initializes **MySQL** database

* Starts **Spring** REST API exposed to

  <a href="http://localhost:8080/api" target="_blank">http://localhost:8080/api</a>

  For Swagger-UI: <a href="http://localhost:8080/swagger-ui.html" target="_blank">http://localhost:8080/swagger-ui.html</a>

* Starts **Spring Admin** exposed to

  <a href="http://localhost:8081" target="_blank">http://localhost:8081</a>

* Starts **Vue** Frontend exposed to

  <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>

## Development
To start all services to develop the Backend:
```shell
docker-compose -f docker-compose-dev.yml up --build
```

To test and build all services from local build (including backend):
```shell
docker-compose -f docker-compose-local.yml up --build
```

## Deployment - Github Actions <img src="./doc/githubactions.png" width="26">
* Verify built in **Test** job
* **Build** all docker images from **Dockerfiles**
* **Push** all built images **to <a href="https://hub.docker.com/u/philkes" target="_blank">Dockerhub</a>**

## TODO
* Add Spring Boot Admin, Prometheus, Grafana to the Stack
* (Add Spring Cloud Config, Zipking Tracing, Eureka Discovery Server)


## Attribution
All Movie Posters, Descriptions, Meta-data are provided by the free <a href="https://developers.themoviedb.org/3" target="_blank">TMDB Movie Database API</a>.

This product uses the TMDB API but is not endorsed or certified by

<img src="/doc/tmdb.svg" width="400px">
