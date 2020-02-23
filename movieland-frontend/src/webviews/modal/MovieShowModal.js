import React from 'react';
import {
    Button,
    ListGroup,
    ListGroupItem,
    ButtonGroup,
} from 'reactstrap';
import Moment from "moment";
import {Link} from "react-router-dom";
import {faSearch, faClock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {Col, Grid,Row, Modal} from "react-bootstrap";
import {InputGroup} from "react-bootstrap";
import InputGroupAddon from "react-bootstrap/lib/InputGroupAddon";
import InputGroupText from "reactstrap/lib/InputGroupText";
import InputGroupButton from "react-bootstrap/lib/InputGroupButton";
import Input from "reactstrap/lib/Input";

/** Modal for adding a new MovieShow with movieId + time*/
export default class MovieShowModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {modal: false, name: '', movies: [], selMovId: ''};

        this.toggle = this.toggle.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        axios.get('/api/movies')
            .then(data => this.setState({movies: data.data, isLoading: false}));
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    /** Send movId + time back to page*/
    handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.selMovId.length < 1)
            return;
        const data = new FormData(ev.target);
        let show = {time: data.get('time'), movId: this.state.selMovId};
        this.props.onSubmit(show);
        this.toggle();
    }

    selectMov(movId) {
        this.setState({selMovId: movId});
    }

    /** Render TimePicker + MovieList*/
    render() {
        const {movies, name, selMovId} = this.state;
        const movieList = movies.map(movie => {
            if (name.length < 1 || movie.name.includes(name)) {
                const descript = `${movie.description}`;
                return (
                    <ListGroupItem key={movie.movId}
                                   onClick={() => this.selectMov(movie.movId)}
                                   active={selMovId == movie.movId}
                    >
                        {movie.name}</ListGroupItem>
                )
            }
        });

        return (
            <div className="content" >
                <Button color="success" onClick={this.toggle}>Add MovieShow</Button>
                <Modal show={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header>Add a Show for a new Movie</Modal.Header>
                        <Modal.Body>
                            <Grid fluid>
                                <Row>
                                    <Col md={8}>
                                        <div className="form-group">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <FontAwesomeIcon icon={faClock}/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="time"
                                                       defaultValue={Moment().format("HH:mm")}
                                                       style={{width: 'auto'}}
                                                       name="time"/>
                                            </InputGroup><br/>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <FontAwesomeIcon icon={faSearch}/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder="Search" type="text"
                                                       placeholder="Search Movies"
                                                       value={this.state.name}
                                                       onChange={this.handleChangeName}
                                                       className="form-control"/>

                                            </InputGroup>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <ListGroup className={'modal-movieList'}>
                                        {movieList}
                                    </ListGroup>
                                </Row>
                            </Grid>
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" value="Add" color="success" className="btn btn-primary"/>
                            <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>

        );
    }


}
