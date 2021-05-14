# MovieLand - Full Stack Cinema Web App <img src="https://i.imgur.com/MHO0XoY.png" width="76"> 

<p align="center"><img src="/doc/admin.gif" width="400px" >   <img src="/doc/reservation.gif" width="400px"></p>

## Frameworks
* **Vue-Nuxt** Frontend 
* **Spring Boot** Backend
* **MySQL** Database
* **Docker** Container

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
    
   **Note**: Change "proxy" address in "package.json" of React-frontend to "**app-server**:8080" if used with docker-compose 
* Starts and initializes **MySQL** Schema exposed only to Spring backend
* Starts **Spring** REST API exposed to Port 8080
* Starts **React** Frontend exposed to Port 80

## Attribution
All Movie Posters, Descriptions, Meta Data is provided by the free TMDB API

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" width="400px" > 
