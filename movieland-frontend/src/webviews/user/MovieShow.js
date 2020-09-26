import React from 'react';
import {Button, ListGroup, ListGroupItem, Table} from 'reactstrap';
import Moment from 'moment';
import axios from "axios";
import {Col, Grid, InputGroup, Row, Tooltip} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/lib/OverlayTrigger";
import InputGroupAddon from "react-bootstrap/lib/InputGroupAddon";
import Input from "reactstrap/lib/Input";
import LoadingComponent from "../misc/LoadingComponent";
import {seat_prices, seat_types} from "../../variables/Variables";

/** /show/:showId page Component
 * Shows MovieShow details + make Reservation (if logged in)*/
class MovieShow extends LoadingComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showId: this.props.match.params.showId,
            movie: [],
            show: [],
            reservedSeats: [],
            selectedSeats: {},
            seatTypes: {ADULT: 0, STUDENT: 0, CHILD: 0, DISABLED: 0},
        };
        this.typeRefs = {};
        seat_types.forEach(type => {
            this.typeRefs[type] = React.createRef();
        })

    }

    /** Initial load all shows*/
    componentDidMount() {
        super.componentDidMount();
        this.setLoading(true);
        axios.get('/api/show/' + this.state.showId)
            .then(res => res.data)
            .then(show => {
                //this.setState({show: data});
                axios.get('/api/movie/' + show.movId)
                    .then(res => res.data)
                    .then(mov => {
                            document.title = mov.name + " " + Moment(show.date).format("DD.MM HH:mm");
                            this.setState({movie: mov, show: show})
                            this.setLoading(true);
                        }
                    );
                /** Get all reserved seats from all reservations*/
                axios.get('/api/reservations/show/' + show.showId)
                    .then(res => res.data)
                    .then(reservations => {
                        console.log("Reservations:");
                        console.log(reservations);
                        let promises = [];
                        let reservedSeats = {};
                        Object.assign(reservedSeats, this.state.reservedSeats);
                        reservations.forEach(reservation => {
                            promises.push(
                                axios.get('/api/seats/reservation/' + reservation.resId)
                                    .then(res => res.data)
                                    .then(seats => {
                                        console.log(seats);
                                        seats.forEach(seat => {
                                            reservedSeats[seat.number] = seat;
                                            //this.setState({reservedSeats: reserved});
                                        });
                                    })
                            );
                        });
                        axios.all(promises).then(res => {
                            this.setState({reservedSeats: reservedSeats})
                            this.setLoading(false);
                        })
                    });
            })
            .catch(err => {
                this.setTimedOut(true);
                this.setLoading(false);
            })
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

        console.log("Submit Reservation:");
        console.log("Adults:" + this.state.seatTypes.ADULT);
        console.log("Students:" + this.state.seatTypes.STUDENT);
        console.log("Children:" + this.state.seatTypes.CHILD);
        console.log("Disabled:" + this.state.seatTypes.DISABLED);
        let selSeatIdx = Object.keys(this.state.selectedSeats);
        let seatCount = 0;
        Object.keys(this.state.seatTypes).forEach(type => {
            if (seatCount === selSeatIdx.length)
                return;
            let i = 0;
            for (i = 0; i < this.state.seatTypes[type]; i++) {
                this.state.selectedSeats[selSeatIdx[seatCount++]].type = type;
                if (seatCount === selSeatIdx.length)
                    break;
            }
        });
        console.log("Selected Seats:");
        console.log(this.state.selectedSeats);

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
            this.addSeatType(seat_types[0], diff)
        } else if (diff < 0) {
            let sub = 0;
            let i = 1;
            for (i = 1; i < seat_types.length; i++) {
                let type = this.typeRefs[seat_types[i]].current;
                if (type.value > 0) {
                    let amt = Math.min(type.value, (diff * -1));
                    this.addSeatType(seat_types[i], amt * -1);
                    //type.value -= amt;
                    diff += amt;
                    console.log("Reduced " + seat_types[i] + " by " + amt);
                    console.log("Remaining: " + diff)

                }
                if (diff === 0) {
                    break;
                }
            }
            if (diff < 0) {
                this.addSeatType(seat_types[0], diff);
                let type = this.typeRefs[seat_types[0]].current;
                type.min = type.value;
                diff = 0;
            }
        }

        this.setState({selectedSeats: seats});
    }

    setSeatType(type, value) {
        this.typeRefs[type].current.value = value;
        //this.typeRefs[type].current.min = value;
        let types = this.state.seatTypes;
        types[type] = value;
        this.setState({seatTypes: types});
    }

    addSeatType(type, value) {
        console.log("Add " + value + " to: " + type);
        let typeInput = this.typeRefs[type].current;
        let val = parseInt(typeInput.value);
        console.log("Val: " + typeInput.value);
        val += value;
        typeInput.value = val;

        if (type === seat_types[0]) {
            typeInput.max = val;
            typeInput.min = val;
        }
        let types = this.state.seatTypes;
        types[type] = val;
        this.setState({seatTypes: types});
    }


    onChangeSeatType(type, ev) {
        console.log("Type: " + type);
        //console.log(this.typeRefs[type].current);
        let typeInput = this.typeRefs[type].current;
        let oldVal = this.state.seatTypes[type];
        console.log("Value:" + typeInput.value);
        if (type !== seat_types[0]) {
            let diff = typeInput.value - oldVal;
            let typeAdult = this.typeRefs[seat_types[0]].current;
            if (typeInput.value >= 0 && diff <= typeAdult.value) {
                this.setSeatType(type, typeInput.value);
                this.addSeatType(seat_types[0], diff * -1);
            } else {
                this.setSeatType(type, oldVal);
                this.addSeatType(seat_types[0], 0);
            }

        } else {
            this.setSeatType(type, oldVal);
        }

    }

    getTotalSum() {
        return Object.keys(this.state.seatTypes).map((type, idx) =>
            this.state.seatTypes[type] * seat_prices[idx]
        ).reduce((a, b) => a + b, 0).toFixed(2);
    }


    /** Render All Seats,highlight reserved Seats*/
    render() {
        let loading = super.render();
        if (loading)
            return loading;

        const {movie, show, selectedSeats} = this.state;
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
                                    {seat_types.map((type, idx) =>
                                        <ListGroupItem className="background-transparent">
                                            <Grid fluid>
                                                <Row>
                                                    <Col>
                                                        <InputGroup>
                                                            <InputGroupAddon
                                                                addonType="prepend">
                                                                <div className="width-40">{type}</div>
                                                            </InputGroupAddon>
                                                            <Input
                                                                defaultValue={0}
                                                                innerRef={this.typeRefs[type]}
                                                                onChange={e => this.onChangeSeatType(type, e)}
                                                                type="number" step="1"/>
                                                            <InputGroupAddon
                                                                addonType="append">{seat_prices[idx].toFixed(2)}$</InputGroupAddon>
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </ListGroupItem>
                                    )}
                                    <ListGroupItem className="background-transparent">
                                        <InputGroup className="width-40">
                                            <InputGroupAddon addonType="prepend">
                                                Total: {this.getTotalSum()} $
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </ListGroupItem>
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