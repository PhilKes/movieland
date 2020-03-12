import React from 'react'
import {Col, Row} from "reactstrap";
import axios from "axios";
import moment from "moment";
import {Grid} from "react-bootstrap";
import {StatsCard} from "../../components/StatsCard/StatsCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTicketAlt} from "@fortawesome/free-solid-svg-icons";
import LoadingComponent from "../misc/LoadingComponent";

/** /user/me page Component
 *  ReservationValidation page showing user details, reservations*/
class UserDashboard extends LoadingComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            user: null,
            reservations: [],
            shows: [],
            movies: {}
        }
    }

    /** Fetch User data and Reservations for Shows*/
    componentDidMount() {
        super.componentDidMount();
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
                                        this.setState({shows: reservationShows, movies: movies})
                                        this.setLoading(false);
                                    })

                            });
                    })
            })
            .catch(err => this.setTimedOut(true));
    }


    /** Render User Data and Reservations*/
    render() {
        let loading = super.render();
        if (loading)
            return loading;

        let {user, reservations, shows, movies} = this.state;
        let reservationList = reservations.map(res => {
            let show = shows[res.resId];
            let movie = movies[show.movId];
            console.log(movie);
            return (
                <Col lg={3} sm={6} key={res.resId}>
                    <StatsCard
                        bigIcon={<a href={"me/reservation/" + res.resId}><img src={movie.posterUrl}
                                                                              className="img-fluid small-fluid"/></a>}
                        statsText={<a href={"me/reservation/" + res.resId}>"{movie.name}"
                            on {moment(show.date).format("dd DD.MM.YYYY HH:mm")}h</a>}
                        statsValue={res.totalSum.toFixed(2) + '$'}
                        statsIcon={<FontAwesomeIcon icon={faTicketAlt}/>}
                        statsIconText={res.validated === true ? "Validated" : "Not Validated yet"}
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