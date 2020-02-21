import React, {Component} from 'react'
import {
    Alert,
    Button,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label, NavItem, NavLink
} from "reactstrap";
import {faUserAlt, faUser, faLock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import LoadingPage from "./misc/LoadingPage";
import moment from "moment";

/** /user/me page Component
 *  User Dashboard page showing user details, reservations*/
class Dashboard extends Component {
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

    componentDidMount() {
        document.title = "My Dashboard";
        axios.get('/api/user/me')
            .then(res => res.data)
            .then(user => this.setState({user: user}))
            .then(x => {
                // Get all Reservations of user
                axios.get('/api/reservations/me')
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


    render() {
        let {err, user, reservations, shows, movies} = this.state;
        if (this.state.isLoading) {
            return <LoadingPage/>;
        }
        let reservationList = reservations.map(res => {
            let show = shows[res.resId];
            let movie = movies[show.movId];
            return (
                <div key={res.resId}>
                    <a href={"/show/" + show.showId}>"{movie.name}"
                        on {moment(show.date).format("dd DD.MM.YYYY HH:mm")}h</a>
                </div>
            );
        });

        //TODO past reservations/ACTIVE
        return (
            <div className="content">
            <Container fluid>
                <h2>My Dashboard</h2>
                <b>Id: {user.id}</b><br/>
                <b>User: {user.username}</b><br/>
                <b>Name: {user.name}</b><br/><br/>
                <b>Reservations</b><br/>
                {reservationList}
            </Container>
            </div>
        )
    }
}

export default Dashboard