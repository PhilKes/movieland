import React from 'react'
import {Col, Row} from "reactstrap";
import axios from "axios";
import moment from "moment";
import {Grid} from "react-bootstrap";
import LoadingComponent from "../misc/LoadingComponent";
import QRCode from "qrcode.react";

/** /user/me/reservation/:resId page Component
 *  Shows Reservation QRCode to validate to Info*/
//TODO PAGE FOR CAHSIERS TO VALIDATE via QRCODE + payment method
class UserReservation extends LoadingComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            resId: this.props.match.params.resId,
            reservation: null,
            movie: null,
            show: null,
            user: null,
        }
    }

    /** Fetch User data and Reservations for Shows*/
    componentDidMount() {
        super.componentDidMount();
        document.title = "UserReservation";
        axios.get('/api/reservation/me/' + this.state.resId)
            .then(res => res.data)
            .then(data => {
                // Get all Reservations of user
                this.setState({
                    movie: data.movie, show: data.movieShow,
                    reservation: data.reservation, qrcode: data.qrcodeURL
                });
                this.setLoading(false);
                document.title = "Reservation for \"" + data.movie.name + "\"";
            })
            .catch(err => {
                this.setLoading(false);
                console.log(err);
                this.props.showNotification("Fetch Reservation failed: "
                    + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
            });
    }


    /** Render User Data and Reservations*/
    render() {
        let loading = super.render();
        if (loading)
            return loading;

        let {reservation, show, movie, qrcode} = this.state;

        let codeData = {
            resId: reservation.resId, userId: reservation.userId, showId: reservation.showId,
            movId: movie.movId
        };
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col>
                            <div className="whole-height">
                                <h3><b>{movie.name}</b></h3>
                                <h3><a href={'/show/' + show.showId}>{moment(show.date).format('DD.MM.YYYY HH:mm')}</a>
                                </h3>
                                <h3><b>Code</b>: {reservation.resId}</h3>
                                <h3><b>Total</b>: {reservation.totalSum.toFixed(2)} $</h3>
                                <h4><b>Validated</b>: {reservation.validated === true ? 'Yes' : 'No'}</h4><br/>
                                <QRCode value={JSON.stringify(codeData)} size={256} level={'H'}/>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default UserReservation