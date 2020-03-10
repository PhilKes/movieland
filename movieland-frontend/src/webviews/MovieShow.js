import React, {Component} from 'react';
import {Button, Container, ListGroup, ListGroupItem, Table} from 'reactstrap';
import Moment from 'moment';
import axios from "axios";
import {Tooltip} from "react-bootstrap";
import {Col, Grid, Row, Modal} from "react-bootstrap";
import {InputGroup} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/lib/OverlayTrigger";
import LoadingPage from "./misc/LoadingPage";
import ErrorPage from "./misc/ErrorPage";
import InputGroupAddon from "react-bootstrap/lib/InputGroupAddon";
import InputGroupText from "reactstrap/lib/InputGroupText";
import InputGroupButton from "react-bootstrap/lib/InputGroupButton";
import Input from "reactstrap/lib/Input";

/** /show/:showId page Component
 * Shows MovieShow details + make Reservation (if logged in)*/
class MovieShow extends Component {

    seat_types = ["ADULT", "STUDENT", "CHILD", "DISABLED"];
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
        this.typeRefs = {};
        this.seat_types.forEach(type => {
            this.typeRefs[type] = React.createRef();
        })

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
                        let reservedSeats = this.state.reservedSeats;
                            reservations.forEach(reservation => {
                                promises.push(
                                    axios.get('/api/seats/reservation/' + reservation.resId)
                                        .then(res => res.data)
                                        .then(seats => {
                                            console.log(seats)
                                            seats.forEach(seat => {
                                                reservedSeats[seat.number] = seat;
                                                //this.setState({reservedSeats: reserved});
                                            });
                                        })
                                );
                            });
                            axios.all(promises).then(res => {
                                this.setState({isLoading: false, reservedSeats: reservedSeats})
                            })
                        }
                    );
            })
            .catch(err => this.setState({isLoading: false, timedout: true}))
        ;
    }

    /** onClick for seats*/
    selectSeat(idx) {
        let seats = {};
        Object.assign(seats, this.state.selectedSeats);
        if (seats[idx] != null) {
            //seats.splice(idx,1);
            delete seats[idx];
        } else {
            seats[idx] = {number: idx, type: "ADULT"};
        }
        this.updateSeatTypes(seats)
    }

    getAmountOfSeatTypes(type) {
        let amt = 0;
        Object.keys(this.state.selectedSeats).forEach(number => {
            if (this.state.selectedSeats[number].type === type)
                amt++;
        });
        return amt;
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
                seats: Object.keys(this.state.selectedSeats).map(number => this.state.selectedSeats[number])
            })
            .then(res => window.location.reload());
    }

    updateSeatTypes(seats) {
        let oldSeats = this.state.selectedSeats;
        let diff = Object.keys(seats).length - Object.keys(oldSeats).length;
        console.log("Old Diff: " + diff);
        if (diff > 0) {
            this.addSeatType(this.seat_types[0], diff)
        } else if (diff < 0) {
            let sub = 0;
            let i = 1;
            for (i = 1; i < this.seat_types.length; i++) {
                let type = this.typeRefs[this.seat_types[i]].current;
                if (type.value > 0) {
                    let amt = Math.min(type.value, (diff * -1));
                    type.value -= amt;
                    diff += amt;
                    console.log("Reduced " + this.seat_types[i] + " by " + amt);
                    console.log("Remaining: " + diff)

                }
                if (diff === 0) {
                    break;
                }
            }
            if (diff < 0) {
                this.addSeatType(this.seat_types[0], diff);
                let type = this.typeRefs[this.seat_types[0]].current;
                type.min = type.value;
                diff = 0;
            }
        }

        this.setState({selectedSeats: seats});
    }


    setSeatType(type, value) {
        this.typeRefs[type].current.value = value;
    }

    addSeatType(type, value) {
        console.log("Add " + value + " to: " + type);
        let typeInput = this.typeRefs[type].current;
        let val = parseInt(typeInput.value);
        console.log("Val: " + typeInput.value);
        val += value;
        typeInput.value = val;
        typeInput.min = val;
    }


    onChangeSeatType(type, ev) {
        console.log("Type: " + type);
        //console.log(this.typeRefs[type].current);
        let typeInput = this.typeRefs[type].current;
        console.log("Value:" + typeInput.value);
        console.log("Ev value: " + ev.target.value)
    }



    /** Render All Seats,highlight reserved Seats*/
    render() {
        const {movie, isLoading, error, timedout, show, selectedSeats} = this.state;
        if (isLoading)
            return <LoadingPage/>;
        if (timedout)
            return <ErrorPage/>;

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
                                {/* <div id="screen">Screen</div>*/}
                                <Table borderless size="sm" className="seatTable">
                                    <tbody>
                                    {this.createRows(10, 16)}
                                    </tbody>
                                </Table>
                            </div>
                            <div>
                                <h4>Selection: {Object.keys(selectedSeats).length} Seats selected</h4>
                                <ListGroup>
                                    {this.seat_types.map(type =>
                                        <ListGroupItem>
                                            <Grid fluid>
                                                <Row>
                                                    <Col>
                                                        <InputGroup>
                                                            <InputGroupAddon
                                                                addonType="prepend">{type}</InputGroupAddon>
                                                            <Input
                                                                defaultValue={0}
                                                                innerRef={this.typeRefs[type]}
                                                                onChange={e => this.onChangeSeatType(type, e)}
                                                                type="number" step="1"/>
                                                            <InputGroupAddon addonType="append">.00</InputGroupAddon>
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </ListGroupItem>
                                    )}
                                </ListGroup>
                            </div>
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