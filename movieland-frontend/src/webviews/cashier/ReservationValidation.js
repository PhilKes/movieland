import React from 'react'
import {Col, FormGroup, Row} from "reactstrap";
import axios from "axios";
import moment from "moment";
import {ControlLabel, Grid, ListGroup, ListGroupItem} from "react-bootstrap";
import LoadingComponent from "../misc/LoadingComponent";
import QrReader from 'react-qr-reader'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../components/CustomButton/CustomButton";
import {isMobile} from 'react-device-detect';
import FormInputs from "../../components/FormInputs/FormInputs";
import {payment_methods} from "../../variables/Variables";
import Input from "reactstrap/lib/Input";
import history from "../../history";

/** /reservation/validation page Component
 *  For Cashier to scan/find and validate Reservation payment*/
class ReservationValidation extends LoadingComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            resId: this.props.match.params.resId,
            movie: null,
            show: null,
            user: null,
            result: 'No result',
            scanned: false,
            reservation: null,
            seats: [],
            isMobile: false
        }
    }

    /** Fetch User data and Reservations for Shows*/
    componentDidMount() {
        super.componentDidMount();
        document.title = "ReservationValidation";
        this.setState({isMobile: isMobile});
        this.params = new URLSearchParams(this.props.location.search);
        this.paramResId = this.params.get('resId');
        if (this.paramResId) {
            this.fetchReservationInfo(this.paramResId);
        } else {
            this.setLoading(false);
        }
    }

    /** Load Reservation from param if exists*/
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.params && nextProps.params.resId) {
            this.paramResId = this.params.get('resId');
            this.fetchReservationInfo(nextProps.params.resId);
        } else {
            this.setState({movie: null, show: null, user: null, scanned: false, seats: []});
        }
    }


    handleScan = data => {
        if (data) {
            let result = JSON.parse(data);
            if (result) {
                this.loadReservationById(result.resId);
                this.setState({result: result});
            } else {
                this.props.showNotification("Could not read QRCode", "error", "bc");
            }
        }
    };

    handleError = err => {
        console.error(err)
    };

    loadReservationById(resId) {
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?resId=' + resId;
        history.push('/reservation/validate?resId=' + resId);
        console.log("ResId: " + resId);
        window.location.reload();
    }

    onFindClicked(ev) {
        ev.preventDefault();
        const data = new FormData(ev.target);
        this.loadReservationById(data.get('code'));
    }

    fetchReservationInfo(resId) {
        //TODO Remove Tickets before validate
        this.setLoading(true);
        axios.get('/api/reservation/' + resId)
            .catch(err => this.props.showNotification("Could not find Reservation", "error", "bc"))
            .then(res => res.data)
            .then(reservation => {
                axios.get('/api/show/' + reservation.showId)
                    .then(res => res.data)
                    .then(show => {
                        axios.get('/api/movie/' + show.movId)
                            .then(res => res.data)
                            .then(movie => {
                                let resSeats = [];
                                axios.get('/api/seats/reservation/' + reservation.resId)
                                    .then(res => res.data)
                                    .then(seats => {
                                        console.log(seats);
                                        seats.forEach(seat => {
                                            resSeats.push(seat);
                                            this.setState({
                                                movie: movie,
                                                show: show,
                                                reservation: reservation,
                                                seats: resSeats,
                                                scanned: true
                                            });
                                            this.setLoading(false);
                                        });
                                    })
                            });
                    });
            })
            .catch(err => {
                this.setLoading(false)
            });
    }

    //TODO
    onValidate(ev) {
        ev.preventDefault();
        const data = new FormData(ev.target);
        let {reservation} = this.state;
        let method = data.get('method');
        console.log("Validating Ticket");
        axios.post('/api/reservation/validate',
            {
                resId: reservation.resId,
                validate: true,
                method: method
            })
            .then(res => window.location.reload())
            .catch(err => {
                console.log(err.response.data.message);
                this.props.showNotification("Validation failed: "
                    + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
            })
    }

    render() {
        let loading = super.render();
        if (loading)
            return loading;

        let {result, movie, show, reservation, seats} = this.state;

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col>
                            <div className="whole-height">
                                {this.state.scanned ?
                                    (<div>
                                        <h3>Reservation for</h3>
                                        <h4><b>Movie</b>:{movie.name}</h4>
                                        <h4><b>Time</b>:{moment(show.date).format('DD.MM.YYYY HH:mm')}</h4>
                                        <ListGroup>
                                            {
                                                seats.map(seat =>
                                                    (<ListGroupItem key={seat.number}>
                                                        {"Nr: " + seat.number + "\t" + seat.type}
                                                    </ListGroupItem>))
                                            }
                                        </ListGroup>
                                        <h4><b>Total</b>:{reservation.totalSum.toFixed(2)} $</h4>
                                        <h4>{
                                            reservation.validated ?
                                                (<div>
                                                    <FontAwesomeIcon icon={faCheck}/> Validated

                                                </div>)
                                                :
                                                (<div>
                                                    <FontAwesomeIcon icon={faTimes}/> Not Validated<br/><br/>
                                                    <form onSubmit={this.onValidate.bind(this)}>
                                                        <FormGroup>
                                                            <ControlLabel>Payment Method</ControlLabel>
                                                            <Input type="select" name="method">
                                                                {payment_methods.map(method =>
                                                                    <option key={method}>{method}</option>
                                                                )}
                                                            </Input>
                                                        </FormGroup>
                                                        <CustomButton size="lg" bsStyle="primary" fill type="submit">
                                                            Validate
                                                        </CustomButton>
                                                    </form>
                                                </div>)
                                        }</h4>

                                    </div>)
                                    :
                                    (<div>
                                        {this.state.isMobile &&
                                        <div>
                                            <h3>Scan Reservation QRCode</h3>
                                            <QrReader
                                                delay={300}
                                                onError={this.handleError.bind(this)}
                                                onScan={this.handleScan.bind(this)}
                                                style={{width: '100%'}}
                                            />
                                        </div>
                                        }
                                        <h3>Enter Reservation Code</h3>
                                        <form onSubmit={this.onFindClicked.bind(this)}>
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    label: "Reservation Code",
                                                    name: "code",
                                                    type: "number",
                                                    bsClass: "form-control",
                                                    placeholder: "Reservation Code"
                                                }]}
                                            />
                                            <CustomButton bsStyle="primary" fill type="submit">
                                                Find
                                            </CustomButton>
                                        </form>
                                    </div>)
                                }
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ReservationValidation