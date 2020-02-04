import React, {Component, useState} from 'react';
import {Button, ButtonGroup, Container, ModalHeader, ModalBody,Modal,ModalFooter,Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import MovieModal from "./modal/MovieModal";
import Moment from 'moment';



class MovieList extends Component {
    constructor(props) {
        super(props);
        this.state = {movies: [], isLoading: true};
        this.remove = this.remove.bind(this);
    }

    /** Initial load all movies*/
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

    /** Add movie from Modal entered name and reload movies*/
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
              return fetch('api/movies')
                .then(response =>  response.json());
        });
        result.then(function(movies){this.setState({movies: movies, isLoading: false});}.bind(this));
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
                        <Button size="sm" color="primary" tag={Link} to={"/movies/" + movie.movId}>Edit</Button>
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
                    <h3>My JUG Tour</h3>
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