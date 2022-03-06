# MovieLand - Full Stack Cinema Web App <img src="https://i.imgur.com/MHO0XoY.png" width="76"> 

<p align="center"><img src="/doc/admin.gif" width="400px" >   <img src="/doc/reservation.gif" width="400px"></p>

## Techstack
* **Vue-Nuxt** Frontend 
* **Spring Boot** Backend
* **MySQL** Database
* **Docker-Compose** Containerization

## Features
* Spring **REST** API
* Role-based **JWT Token** Authentication
* Vue **User Interface** Webpage
* Persistent **Database** for Movies, Shows, User
* Webpages for User Login/Registration, Reservations
* Admin Dashboard Page for Statistics, Managing, Generating
* Async REST-Tasks interface with Progress
* QRCode Scanning of Reservation to validate payment
* Access to <a href="https://developers.themoviedb.org/3" target="_blank">TMDB Movie Database API</a>

## Docker
Full Docker Support with **Docker-compose**:

    docker-compose up --build
    
   * Starts and initializes **MySQL** Schema exposed only to Spring backend
* Starts **Spring** REST API exposed to Port 8080
* Starts **Vue** Frontend exposed to Port 3000

## Attribution
All Movie Posters, Descriptions, Meta Data is provided by the free TMDB API

<img src="/doc/tmdb.svg" width="400px">
