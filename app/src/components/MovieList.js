import React, {Component} from 'react';
import {Button, ButtonGroup, Container,Table,Input} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import MovieModal from "./modal/MovieModal";
import Moment from 'moment';


/** /shows page
 * Shows Movies + ADD/REMOVE Movies*/
class MovieList extends Component {

    constructor(props) {
        super(props);
        this.state = {movies: [], isLoading: true};
        this.remove = this.remove.bind(this);
        this.searchQuery="";
    }

    /** Initial load all shows*/
    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/movies')
            .then(response => response.json())
            .then(data => this.setState({movies: data, isLoading: false}));
    }

    /** Remove movie with movieid=id*/
    async remove(id) {
        await fetch(`/api/movie/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedMovies = [...this.state.movies].filter(i => i.movId !== id);
            this.setState({movies: updatedMovies});
        });
    }

    /** Add movie from Modal entered name and reload shows*/
    addMovie(name) {
        console.log("Add " +name);
        var result=
            fetch(`/api/movie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({name: name})
        }).then(function(){
              return fetch('api/shows?name='+this.searchQuery.value)
                .then(response =>  response.json());
        }.bind(this));
        result.then(function(movies){this.setState({movies: movies, isLoading: false});}.bind(this));
    }

    /** Submit search if pressed enter in searchquery field*/
    handleKeyPress(ev){
        if(ev.charCode==13){ //Enter pressed?
            console.log("Search: "+this.searchQuery.value);
            fetch('api/shows?name='+this.searchQuery.value)
                .then(response => response.json())
                .then(data => this.setState({movies: data}));
        }
    }

    render() {
        const {movies, isLoading} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }
        const movieList = movies.map(movie => {
            const descript = `${movie.description}`;
            return <tr key={movie.movId}>
                <td><img src={movie.posterUrl} className={'img-fluid'} alt="Responsive image"/></td>
                <td >{movie.name}</td>
                <td>{descript}</td>
                <td>
                   <div key={movie.movId}>{Moment(movie.date).format('DD.MM.YYYY')}</div>
                </td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/shows/" + movie.movId}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(movie.movId)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });


        return (

            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <MovieModal onSubmit={this.addMovie.bind(this)}/>
                    </div>
                    <h3>Movies</h3>
                    <Input type="text" innerRef={ref=>this.searchQuery=ref} onKeyPress={this.handleKeyPress.bind(this)} />
                    <Table className="mt-5">
                        <thead>
                        <tr>
                            <th width="15%">Poster</th>
                            <th width="6%">Name</th>
                            <th width="25%">Description</th>
                            <th width="15%">Release Date</th>
                            <th width="15%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {movieList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default MovieList;