import React, {Component} from 'react';
import {Button, ButtonGroup, Table, Input, Alert} from 'reactstrap';
import MovieModal from "../../modal/MovieModal";
import Moment from 'moment';
import axios from "axios";
import ErrorPage from "../../misc/ErrorPage";
import LoadingPage from "../../misc/LoadingPage";
import {Col, Grid, Row} from "react-bootstrap";
import ReactCard from "../../../components/Card/Card";


/** /movies/edit page Component
 * Shows Movies + ADD/REMOVE Movies (only for Admins)*/
class MovieListEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {movies: [], isLoading: true, error: "", timedout: false};
        this.remove = this.remove.bind(this);
        this.searchQuery = "";
    }

    /** Initial load all movies*/
    componentDidMount() {
        document.title = "Manage Movies";
        this.setState({isLoading: true});

        axios.get('/api/movies')
            .then(res => res.data)
            .then(data => this.setState({movies: data, isLoading: false}))
            .catch(err => this.setState({timedout: true}))
        ;
    }

    /** Remove movie with movieid*/
    async remove(id) {
        await axios.delete(`/api/movie/${id}`)
            .then(() => {
                let updatedMovies = [...this.state.movies].filter(i => i.movId !== id);
                this.setState({movies: updatedMovies});
            });
    }

    /** Add movie from Modal entered name and reload shows*/
    addMovie(movie) {
        console.log("Add " + movie.name);
        var result =
            axios.post(`/api/movie`, JSON.stringify(movie),
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    console.log(response)
                    //TODO Catch exception if movie already there
                    return axios.get('/api/movies?name=' + this.searchQuery.value)
                        .then(resp => {
                            this.setState({movies: resp.data, isLoading: false})
                        });
                })
                .catch(err => {
                    console.log(err.response.data.msg);
                    this.setState({error: err.response.data.msg});

                });
    }

    /** Submit search if pressed enter in searchquery field*/
    handleKeyPress(ev) {
        if (ev.charCode == 13) { //Enter pressed?
            console.log("Search: " + this.searchQuery.value);
            axios.get('/api/movies?name=' + this.searchQuery.value)
                .then(resp => this.setState({movies: resp.data}));
        }
    }

    /** Render Movie List with Actions*/
    render() {
        const {movies, isLoading, error, timedout} = this.state;
        if (timedout) {
            return <ErrorPage/>
        }
        if (isLoading) {
            return <LoadingPage/>;
        }
        const movieList = movies.map(movie => {
            const descript = `${movie.description}`;
            return <tr key={movie.movId}>
                <td><img src={movie.posterUrl} className={'img-fluid'} alt="Responsive image"/></td>
                <td>{movie.name}</td>
                {/* <td>{descript}</td>*/}
                <td>
                    <div key={movie.movId}>{Moment(movie.date).format('DD.MM.YYYY')}</div>
                </td>
                <td>
                    <ButtonGroup>
                        {/* <Button size="sm" color="primary" tag={Link} to={"/shows/" + movie.movId}>Edit</Button>*/}
                        <Button size="sm" color="danger" onClick={() => this.remove(movie.movId)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });


        return (
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <h2>Movies</h2><br/>
                        <div className="float-right">
                            <MovieModal onSubmit={this.addMovie.bind(this)}/>
                        </div>
                        <br/>
                        <Input type="text" placeholder="Search Movies" innerRef={ref => this.searchQuery = ref}
                               onKeyPress={this.handleKeyPress.bind(this)}/><br/>
                        <Alert color="danger" isOpen={error.length > 0} toggle={() => this.setState({error: ""})}>
                            {error}
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <ReactCard
                            plain
                            ctTableFullWidth
                            ctTableResponsive
                            content={

                                <Table className="wrap-words">
                                    <thead>
                                    <tr>
                                        {/* <th width="15%">Poster</th>
                                            <th width="6%">Name</th>
                                            <th width="25%">Description</th>
                                            <th width="15%">Release Date</th>
                                            <th width="15%">Actions</th> */}
                                        <th>Poster</th>
                                        <th width="20vw">Name</th>
                                        {/* <th >Description</th>*/}
                                        <th>Release Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {movieList}
                                    </tbody>
                                </Table>}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default MovieListEdit;