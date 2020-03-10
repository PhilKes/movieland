import React, {Component} from 'react'
import {Col, Container, Row} from "reactstrap";
import axios from "axios";
import LoadingPage from "./misc/LoadingPage";
import moment from "moment";
import {Grid} from "react-bootstrap";
import ErrorPage from "./misc/ErrorPage";

/** /user/me/reservation/:resId page Component
 *  Shows Reservation QRCode to validate to Info*/
//TODO PAGE FOR CAHSIERS TO VALIDATE via QRCODE + payment method
class UserReservation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resId: this.props.match.params.resId,
            reservation: null,
            movie: null,
            show: null,
            err: false, // 0=no error, 1= password too short, 2= repeat doesnt match, 3= username taken, 4= missing fields
            user: null,
            isLoading: true,
        }
    }

    /** Fetch User data and Reservations for Shows*/
    componentDidMount() {
        document.title = "UserReservation";
        this.setState({isLoading: true});
        axios.get('/api/reservation/me/' + this.state.resId)
            .then(res => res.data)
            .then(data => {
                // Get all Reservations of user
                this.setState({
                    movie: data.movie, show: data.movieShow,
                    reservation: data.reservation, qrcode: data.qrcodeURL,
                    isLoading: false
                });
                document.title = "Reservation for \"" + data.movie.name + "\"";
            })
            .catch(err => {
                this.setState({isLoading: false, err: true});
                console.log(err)
                this.props.showNotification("Fetch Reservation failed: "
                    + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
            });
    }


    /** Render User Data and Reservations*/
    render() {
        let {err, reservation, show, movie, qrcode} = this.state;
        if (this.state.isLoading) {
            return <LoadingPage/>;
        }
        if (this.state.err) {
            return <ErrorPage/>;
        }
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col>
                            <div className="whole-height">
                                <h3>{movie.name}</h3>
                                <h3><a href={'/show/' + show.showId}>{moment(show.date).format('DD.MM.YYYY HH:mm')}</a>
                                </h3>
                                <h4>Validated: {reservation.validated === true ? 'Yes' : 'No'}</h4><br/>
                                <img src={qrcode}/>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default UserReservation