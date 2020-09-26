# MovieLand - Full Stack Cinema Web App <img src="https://i.imgur.com/MHO0XoY.png" width="76"> 

<p align="center"><img src="https://i.imgur.com/a6w6dJ9.gif" width="400px" >   <img src="https://i.imgur.com/qS05BgQ.gif" width="400px"></p>

## Frameworks
* **React** Frontend 
* **Spring Boot** Backend
* **MySQL** Database
* **Docker** Container

## Features
* Spring **REST** API
* Role-based **JWT Token** Authentication
* React **User Interface** Webpage (<a href="https://www.creative-tim.com/product/light-bootstrap-dashboard-react" target="_blank">Bootstrap Template</a>)
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

## SSL (React)
Enable/Disable HTTPS to frontend in package.json "scripts":

    "start": "SET HTTPS=true&&node scripts/start.js"
    
* Install React's certificate in WebBrowser to trust localhost

## Attribution
All Movie Posters, Descriptions, Meta Data is provided by the free TMDB API

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg" width="400px" > 
