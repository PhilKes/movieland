import React from 'react';
import {Alert, Button, ButtonGroup, Input, Table} from 'reactstrap';
import MovieModal from "../../modal/MovieModal";
import Moment from 'moment';
import axios from "axios";
import {Col, Grid, Row} from "react-bootstrap";
import ReactCard from "../../../components/Card/Card";
import InfiniteLoader from "react-infinite-loader";
import LoadingComponent from "../../misc/LoadingComponent";

/** /movies/edit page Component
 * Shows Movies + ADD/REMOVE Movies (only for Admins)*/
class MovieListEdit extends LoadingComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            page: 0,
            moviePage: {movies: [], hasMore: true},
        };
        this.remove = this.remove.bind(this);
        this.searchQuery = "";
        this.scrollParentRef = null;
    }

    /** Initial load all movies*/
    componentDidMount() {
        super.componentDidMount();
        document.title = "Manage Movies";
        this.setLoading(true);

        axios.get('/api/movies/page/' + this.state.page)
            .then(res => {
                console.log(res);
                let hasMore = res.headers.hasmore === 'true';
                console.log("hasMore: " + hasMore);
                this.setState({moviePage: {movies: res.data, hasMore: hasMore}});
                this.setLoading(false);

            })
            .catch(err => this.setTimedOut(true));
        //window.addEventListener('scroll',this.loadMovies,false);
    }

    /** Remove movie with movieid*/
    async remove(id) {
        await axios.delete(`/api/movie/${id}`)
            .then(() => {
                let updatedMovies = [...this.state.moviePage.movies].filter(i => i.movId !== id);
                this.setState({moviePage: {hasMore: this.state.moviePage.hasMore, movies: updatedMovies}});
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
                    return axios.get('/api/movies/page/' + this.state.page + '?name=' + this.searchQuery.value)
                        .then(resp => {
                            let hasMore = resp.headers.hasmore === 'true';
                            this.setState({moviePage: {movies: resp.data, hasMore: hasMore}});
                            this.setLoading(false);
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
            axios.get('/api/movies/page/' + this.state.page + '?name=' + this.searchQuery.value)
                .then(resp => {
                    let hasMore = resp.headers.hasmore === 'true';
                    this.setState({moviePage: {movies: resp.data, hasMore: hasMore}})
                });
        }
    }

    loadMovies() {
        /* let scrollPercent=(window.scrollY) / (document.body.scrollHeight- window.innerHeight);
         scrollPercent= Math.round(scrollPercent*100);
         if(scrollPercent>=100) {*/
        this.setState({page: this.state.page + 1});
        console.log("LOAD PAGE:");
        console.log(this.state.page);
        axios.get('/api/movies/page/' + (this.state.page))
            .then(res => {
                console.log(res);
                let hasMore = res.headers.hasmore === 'true';
                console.log("hasMore: " + hasMore);
                let movies = this.state.moviePage.movies;
                res.data.forEach(movie => movies.push(movie));
                this.setState({moviePage: {movies: movies, hasMore: hasMore}});
                this.setLoading(false);

            })
            .catch(err => this.setTimedOut(true));
        // }

    }



    /** Render Movie List with Actions*/
    render() {
        let loading = super.render();
        if (loading)
            return loading;

        const {moviePage, error} = this.state;

        const movieList = moviePage.movies.map(movie => {
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
            <Grid fluid id="grid" ref={(ref) => this.scrollParentRef = ref}>
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
                    <Col>
                        <ReactCard
                            plain
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                        <Table className="wrap-words">
                            <thead>
                            <tr>
                                <th>Poster</th>
                                <th width="20%">Name</th>
                                <th width="20%">Release Date</th>
                                <th width="40%">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                                    {movieList}
                            </tbody>
                        </Table>}
                        />
                    </Col>
                </Row>
                {this.state.moviePage.hasMore &&
                <Row>
                    <Col>
                        <InfiniteLoader onVisited={() => this.loadMovies()}
                                        containerElement={document.querySelector('.wrapper')}
                                        loaderStyle={{backgroundColor: "red"}}/>
                    </Col>
                </Row>}
            </Grid>
        );
    }
}

export default MovieListEdit;