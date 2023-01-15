# MovieLand - Full Stack Cinema Web App <img src="https://i.imgur.com/MHO0XoY.png" width="76"> 

<p align="center"><img src="/doc/admin.gif" width="400px" >   <img src="/doc/reservation.gif" width="400px"></p>

This is a showcase project for a **Full Stack Web Application** for a cinema operator use-case scenario.

## Backend - Python Flask <img src="./doc/flask.png" width="28">
* SQLAlchemy to interact with the database
* **REST API** for external access
* Async REST-Tasks with progress indication
* Role-based **JWT Token** Authentication
* Access to <a href="https://developers.themoviedb.org/3" target="_blank">TMDB Movie Database API</a>
* Swagger UI (http://localhost:8080/)

Note: You need to get your own TMDB API Key to run the backend on your local machine.
Add it to the `application.ini` in the `tmdbApi.apikey` value.

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

## Release
The Python Flask backend version it not yet released on Heroku.


## Attribution
All Movie Posters, Descriptions, Meta-data are provided by the free <a href="https://developers.themoviedb.org/3" target="_blank">TMDB Movie Database API</a>.

This product uses the TMDB API but is not endorsed or certified by

<img src="/doc/tmdb.svg" width="400px">