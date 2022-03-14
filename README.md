# MovieLand - Full Stack Cinema Web App <img src="https://i.imgur.com/MHO0XoY.png" width="76"> 

<p align="center"><img src="/doc/admin.gif" width="400px" >   <img src="/doc/reservation.gif" width="400px"></p>

This is a showcase project for a **Full Stack Web Application** for a cinema operator use-case scenario.

## Backend - Spring Boot <img src="./doc/spring.png" width="26">
* JPA/Hibernate to interact with the database
* **REST API** for external access
* Async REST-Tasks with progress indication
* Role-based **JWT Token** Authentication
* Access to <a href="https://developers.themoviedb.org/3" target="_blank">TMDB Movie Database API</a>


## Frontend - NuxtJS <img src="./doc/nuxt.png" width="30">
* Vue **User Interface** with Nuxt.js
* Axios as REST-Client
* Webpages for **User Login/Registration, Reservations**
* **Admin Dashboard** Page for Statistics, Managing, Generating
* QRCode Scanning of Reservation to validate tickets


## Database - PostgreSQL <img src="./doc/postgresql.png" width="26">
* PostgreSQL image from <a href="https://hub.docker.com/_/postgres" target="_blank">Dockerhub</a>
* Persistent **Data layer** for Movies, Shows, User etc.

## Docker <img src="./doc/docker.png" width="32">
Full Docker Support with **Docker-compose**

* To build and run the Fullstack Application from local Dockerfiles:

    `docker-compose up -f docker-compose-local.yml --build`


* To run the Fullstack Application from latest <a href="https://hub.docker.com/u/philkes" target="_blank">Dockerhub images</a>:

  `docker-compose up --build`


* Starts and initializes **MySQL** database

* Starts **Spring** REST API exposed to

  <a href="http://localhost:8080/api" target="_blank">http://localhost:8080/api</a>

* Starts **Vue** Frontend exposed to

  <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>

## Deployment - Github Actions <img src="./doc/githubactions.png" width="26">
* Verify built in **Test** job
* **Build** all docker images from **Dockerfiles**
* **Push** all built images **to <a href="https://hub.docker.com/u/philkes" target="_blank">Dockerhub</a>**

## Release - Heroku <img src="./doc/heroku.png" width="26">
* **Backend** Container running **Spring Boot** with [Postgres Addon](https://elements.heroku.com/addons/heroku-postgresql)
* **Frontend** Container running **NuxtJS UI** client
* Automatically **released from GithubActions**

You can test out this project on the **Live Preview on Heroku**:

**[movieland-frontend.herokuapp.com](https://movieland-frontend.herokuapp.com/)**

_Note_: Heroku puts the frontend and backend into sleep mode if there haven't been any requests for some time, therefore the initial request to the Live Preview might take about 1 minute to wake up the frontend and backend.


## Attribution
All Movie Posters, Descriptions, Meta-data are provided by the free <a href="https://developers.themoviedb.org/3" target="_blank">TMDB Movie Database API</a>

<img src="/doc/tmdb.svg" width="400px">