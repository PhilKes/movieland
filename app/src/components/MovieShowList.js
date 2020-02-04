import React, {Component, useState} from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    ModalHeader,
    ModalBody,
    Modal,
    ModalFooter,
    Table,
    Input,
    FormGroup, Label
} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import MovieModal from "./modal/MovieModal";
import Moment from 'moment';
import qs from 'querystring';


/** /shows page
 * Shows MovieShows by Date + ADD/REMOVE Shows*/
class MovieShowList extends Component {

    constructor(props) {
        super(props);
        this.state = {shows: [], isLoading: true};
        this.remove = this.remove.bind(this);
        this.searchQuery="";
        this.params =new URLSearchParams(this.props.location.search);
        this.dateParam= this.params.get('date');

    }

    /** Initial load all shows*/
    componentDidMount() {
        if(this.dateParam==null || this.dateParam.length<9) {
            this.dateParam= Moment().format("YYYY-MM-DD");
            this.updateDateParam();
        }
        this.setState({isLoading: true});
        this.updateShowList()
    }

    /** Update date or set to today*/
    changeDate(date){
        this.dateParam=date.target.value;
        if(this.dateParam.length <9){
            this.dateParam= Moment().format("YYYY-MM-DD");
        }
        this.updateDateParam();
        this.updateShowList();
    }

    /** Update url query Parameter for new Date*/
    updateDateParam(){
        console.log("Changed Date to"+this.dateParam);
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?date='+this.dateParam;
        window.history.pushState({ path: newurl }, '', newurl);
        console.log("Date: "+this.dateParam);
    }

    /** Fetch Shows for date and fetch referenced Movies*/
    updateShowList() {
        fetch('api/shows?date='+this.dateParam)
            .then(response => response.json())
            .then(shows=>{
                let movies={};
                shows.reduce(
                    (chain, show) =>
                        // append the promise creating function to the chain
                        chain.then(() =>{
                            if(movies[show.movId]==null) {
                                return fetch('api/movie/' + show.movId)
                                    .then(response => {
                                        console.log("Fetching MovId: "+show.movId);
                                        return response.json();
                                    })
                                    .then(movie=>movies[movie.movId]= movie);
                            }
                        }),
                    // start the promise chain from a resolved promise
                    Promise.resolve()
                ).then(() => this.setState({shows: shows,movies: movies, isLoading: false}));
            });
    }

    async fetchMovie(movId) {
        return await fetch('api/movie/' + movId)
            .then(response => {
                console.log("Fetching MovId: "+movId);
                return response.json();
            })
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
            this.setState({shows: updatedMovies});
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
        const {shows,movies, isLoading} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }
        const showList = shows.map(show => {
            return <tr key={show.showId}>
                {/*<td>{show.showId}</td>*/}
                <td><img src={movies[show.movId].posterUrl} className={'img-fluid'} alt="Responsive image"/></td>
                <td >{movies[show.movId].name}</td>
                <td>
                    <div key={show.movId}>{Moment(show.date).format('DD.MM.YYYY hh:mm')}</div>
                </td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="danger" onClick={() => this.remove(show.movId)}>Delete</Button>
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
                    <h3>Movie Shows</h3>
                    <FormGroup>
                        <Label for="exampleDate">Date</Label>
                        <Input
                            type="date"
                            defaultValue={this.dateParam}
                            placeholder="date placeholder"
                            onChange={this.changeDate.bind(this)}
                            style={{width: 'auto'}}
                        />
                    </FormGroup>
                    <Table className="mt-5">
                        <thead>
                        <tr>
                            <th width="15%">Poster</th>
                            <th width="6%">Movie Name</th>
                            <th width="25%">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {showList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }


}

export default MovieShowList;