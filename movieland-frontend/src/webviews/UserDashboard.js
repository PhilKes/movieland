import React, {Component} from 'react'
import {Col, Container, Row} from "reactstrap";
import axios from "axios";
import LoadingPage from "./misc/LoadingPage";
import moment from "moment";
import {Grid} from "react-bootstrap";
import Card from "../components/Card/Card";
import {StatsCard} from "../components/StatsCard/StatsCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavIcon} from "@trendmicro/react-sidenav";
import {faTicketAlt} from "@fortawesome/free-solid-svg-icons";

/** /user/me page Component
 *  UserReservation page showing user details, reservations*/
class UserDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            err: 0, // 0=no error, 1= password too short, 2= repeat doesnt match, 3= username taken, 4= missing fields
            user: null,
            isLoading: true,
            reservations: [],
            shows: [],
            movies: {}
        }
    }

    /** Fetch User data and Reservations for Shows*/
    componentDidMount() {
        document.title = "My Dashboard";
        axios.get('/api/user/me')
            .then(res => res.data)
            .then(user => this.setState({user: user}))
            .then(x => {
                // Get all Reservations of user
                axios.get('/api/reservations/me/new')
                    .then(res => res.data)
                    .then(reservations => {
                        this.setState({reservations: reservations});
                        let promises = [];
                        let reservationShows = this.state.shows;
                        reservations.forEach(reservation => {
                            promises.push(
                                // Get all shows of reservation
                                axios.get('/api/show/' + reservation.showId)
                                    .then(res => res.data)
                                    .then(show => {
                                        reservationShows[reservation.resId] = show;
                                    })
                            );
                        });
                        let movies = this.state.movies;
                        axios.all(promises)
                            .then(res => {
                                let moviePromises = [];
                                reservationShows.forEach(sh => {
                                    // Get movie of show
                                    if (movies[sh.movId] == null) {
                                        moviePromises.push(
                                            axios.get('/api/movie/' + sh.movId)
                                                .then(res => res.data)
                                                .then(movie => movies[sh.movId] = movie)
                                        );
                                    }
                                })
                                axios.all(moviePromises)
                                    .then(() => {
                                        this.setState({shows: reservationShows, movies: movies, isLoading: false})
                                    })

                            });
                    })
            })
    }


    /** Render User Data and Reservations*/
    render() {
        let {err, user, reservations, shows, movies} = this.state;
        if (this.state.isLoading) {
            return <LoadingPage/>;
        }
        let reservationList = reservations.map(res => {
            let show = shows[res.resId];
            let movie = movies[show.movId];
            console.log(movie)
            return (
                <Col lg={3} sm={6} key={res.resId}>
                    <StatsCard
                        bigIcon={<a href={"me/reservation/" + res.resId}><img src={movie.posterUrl}
                                                                              className="img-fluid small-fluid"/></a>}
                        statsText={<a href={"me/reservation/" + res.resId}>"{movie.name}"
                            on {moment(show.date).format("dd DD.MM.YYYY HH:mm")}h</a>}
                        statsIcon={<FontAwesomeIcon icon={faTicketAlt}/>}
                        statsIconText={res.validate === true ? "Validated" : "Not Validated yet"}
                    />
                </Col>

            );
        });

        //TODO past reservations/ACTIVE
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col>
                            <div>
                                <h2>My Dashboard</h2>
                                <b>Id: {user.id}</b><br/>
                                <b>User: {user.username}</b><br/>
                                <b>Name: {user.name}</b><br/><br/>
                                <b>Reservations</b><br/>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <div className="whole-height">
                            {reservationList}
                        </div>
                    </Row>

                </Grid>
            </div>
        )
    }
}

export default UserDashboard