import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ListGroupItem,
    ListGroup,
    Input,
    Container, Form
} from 'reactstrap';
import axios from "axios";

/** Modal for adding a new Movie by name*/
export default class MovieModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = { modal: false,name: '', movies:[], selMovie: {tmdbId: '-1'}};
        this.toggle = this.toggle.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

    }

    toggle() {
        if(this.state.name==''){
            axios.get('/api/movies/tmdb/top')
                .then(res => res.data)
                .then(data => this.setState({movies: data}));
        }
        this.setState({
            modal: !this.state.modal,
            name: '',
            movies:[],
            selMovie: null
        });
    }

    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    /** Send name of new Movie back to page
     * */
    handleSubmit(event) {
        //TODO Load tmdb movie and show + option to commit/change
        event.preventDefault();
        //this.props.onSubmit(this.state.name);
        this.props.onSubmit(this.state.selMovie);
        this.toggle();
    }

    /** Submit search if pressed enter in searchquery field*/
    handleKeyPress(ev){
        if(ev.charCode==13){ //Enter pressed?
            console.log("Search: "+this.searchQuery.value);
            axios.get('api/movies/tmdb?name=' + this.searchQuery.value)
                .then(res => res.data)
                .then(data => this.setState({movies: data}));
        }
    }

    selectMov(movie) {
        this.setState({selMovie: movie});
    }

    render() {
        const {movies,selMovie} = this.state;

        const movieList = movies.map(movie => {
           // if (selMovie!==null && selMovie.name.length < 1 || movie.name.includes(selMovie.name)) {
                const descript = `${movie.description}`;
                return (
                    <ListGroupItem key={movie.tmdbId}
                                   onClick={() => this.selectMov(movie)}
                                   active={selMovie!==null && selMovie.tmdbId == movie.tmdbId}
                    >
                        {movie.name}</ListGroupItem>
                )
          //  }
        });

        return (
            <div>
                <Button color="success" onClick={this.toggle}>Add Movie</Button>
                <Modal isOpen={this.state.modal}>
                        <ModalHeader>Add new Movie title</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-12">
                                    <label>Name:</label>
                                    <Input placeholder="Search TMDB for Movie" type="text" innerRef={ref=>this.searchQuery=ref} onKeyPress={this.handleKeyPress.bind(this)} /><br/>
                                   {/* <input type="text" value={this.state.name} onChange={this.handleChangeName} className="form-control" />*/}
                                </div>
                            </div>
                            <ListGroup className={'modal-movieList'}>
                                {movieList}
                            </ListGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={this.handleSubmit} color="primary">Add</Button>
                            <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                </Modal>
            </div>

        );
    }
}
