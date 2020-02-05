import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ListGroup,
    ListGroupItem,
    ButtonGroup,
    InputGroup, InputGroupText, InputGroupAddon, Input
} from 'reactstrap';
import Moment from "moment";
import {Link} from "react-router-dom";
import {faSearch, faClock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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

        fetch('api/movies')
            .then(response => response.json())
            .then(data => this.setState({movies: data, isLoading: false}));
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
            <div>
                <Button color="success" onClick={this.toggle}>Add MovieShow</Button>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>Add a Show for a new Movie</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-12">
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
                            </div>
                            <ListGroup className={'modal-movieList'}>
                                {movieList}
                            </ListGroup>
                        </ModalBody>
                        <ModalFooter>
                            <input type="submit" value="Add" color="success" className="btn btn-primary"/>
                            <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>

        );
    }


}
