import React, {Component} from 'react';
import {Button, Container, Table} from 'reactstrap';
import Moment from 'moment';
import axios from "axios";
import {Col, Grid, Row, Tooltip} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/lib/OverlayTrigger";
import LoadingPage from "./misc/LoadingPage";


/** /show/:showId page Component
 * Shows MovieShow details + make Reservation (if logged in)*/
class MovieShow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showId: this.props.match.params.showId,
            movie: [],
            show: [],
            reservedSeats: [],
            selectedSeats: {},
            isLoading: true,
            error: "",
            timedout: false
        };

    }

    /** Initial load all shows*/
    componentDidMount() {
        this.setState({isLoading: true});
        axios.get('/api/show/' + this.state.showId)
            .then(res => res.data)
            .then(show => {
                //this.setState({show: data});
                axios.get('/api/movie/' + show.movId)
                    .then(res => res.data)
                    .then(mov => {
                            document.title = mov.name + " " + Moment(show.date).format("DD.MM HH:mm");
                            this.setState({movie: mov, show: show, isLoading: true})
                        }
                    );
                /** Get all reserved seats from all reservations*/
                axios.get('/api/reservations/show/' + show.showId)
                    .then(res => res.data)
                    .then(reservations => {
                            console.log("Reservations:")
                            console.log(reservations)
                            let promises = [];
                            reservations.forEach(reservation => {
                                promises.push(
                                    axios.get('/api/seats/reservation/' + reservation.resId)
                                        .then(res => res.data)
                                        .then(seats => {
                                            console.log(seats)
                                            seats.forEach(seat => {
                                                let reserved = this.state.reservedSeats;
                                                reserved[seat.number] = seat;
                                                this.setState({reservedSeats: reserved});
                                            });
                                        })
                                );
                            });
                            axios.all(promises).then(res => {
                                this.setState({isLoading: false})
                            })
                        }
                    );
            })
            .catch(err => this.setState({timedout: true}))
        ;
    }

    /** onClick for seats*/
    selectSeat(idx) {
        let seats = this.state.selectedSeats;
        if (seats[idx] != null) {
            //seats.splice(idx,1);
            delete seats[idx];
        } else {
            seats[idx] = true;
        }
        this.setState({selectedSeats: seats});
    }

    /** returns table rows*/
    createRows(rows, cols) {
        let {reservedSeats, selectedSeats} = this.state;
        var tableRows = [];
        for (let y = 0; y < rows; y++) {
            let cells = [];
            for (let i = 0; i < cols; i++) {
                let cell = [];
                if (reservedSeats[y * cols + i] == null) {
                    const tooltip = (<Tooltip id="seat_tooltip">Nr.{y * cols + i}</Tooltip>);
                    cell = (<td key={i}>
                        <OverlayTrigger placement="top" overlay={tooltip}>
                            <div
                                className={selectedSeats[y * cols + i] == null ? "seatimg" : "seatimg selected"}
                                onClick={() => this.selectSeat(y * cols + i)}>
                                {/* {y * cols + i}*/}
                            </div>
                        </OverlayTrigger>
                    </td>);
                } else {
                    const tooltip = (<Tooltip id="seat_tooltip">Taken</Tooltip>);

                    cell = (<td key={i}>
                        <OverlayTrigger placement="top" overlay={tooltip}>
                            <div className="seatimg reserved">
                                {/* {y * cols + i}*/}
                            </div>
                        </OverlayTrigger>
                    </td>);
                }
                cells.push(cell)
            }
            tableRows.push(<tr key={y}>{cells}</tr>);
        }
        return tableRows;
    }

    /** Send Request for Reservation with Seats*/
    submitReservation() {
        axios.post('/api/reservation',
            {
                show_id: this.state.showId,
                seats: Object.keys(this.state.selectedSeats).map(number=>{ return {number:number,type: "CHILD"};})
            })
            .then(res => window.location.reload());
    }


    /** Render All Seats,highlight reserved Seats*/
    render() {
        const {movie, isLoading, error, timedout, show, selectedSeats} = this.state;
        if (isLoading)
            return <LoadingPage/>;

        //TODO add submit reservation -> Post
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <h2>{movie.name}</h2>
                            <h4>{Moment(show.date).format('DD.MM.YYYY HH:mm')}</h4>
                            <h5>{movie.description}</h5>
                            <div id="room">
                                <div id="screen">Screen</div>
                                <Table borderless size="sm" className="seatTable">
                                    <tbody>
                                    {this.createRows(10, 16)}
                                    </tbody>
                                </Table>
                            </div>
                            <h4>Selection: {Object.keys(selectedSeats).length} Seats selected</h4>

                            <Button color="success" onClick={this.submitReservation.bind(this)}
                                    disabled={Object.keys(selectedSeats).length === 0}
                            >Submit</Button>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default MovieShow;