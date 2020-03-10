import React, {Component} from 'react';
import {
    ButtonGroup,
    Table,
    ListGroupItem,
    ListGroup, Button
} from 'reactstrap';
import Moment from 'moment';
import axios from "axios";
import ErrorPage from "./misc/ErrorPage";
import LoadingPage from "./misc/LoadingPage";
import * as queryString from "query-string";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import TrailerModal from "./modal/TrailerModal";
import {Grid, Row, Col} from "react-bootstrap";
import ReactCard from "../components/Card/Card";
import CustomButton from "../components/CustomButton/CustomButton";
import {Carousel} from "react-bootstrap";
import Scrollchor from 'react-scrollchor';
import {Link} from "react-router-dom";
import InfiniteLoader from "react-infinite-loader";
import Loader from "react-loader-spinner";

/** /movies page Component
 * Shows current Movies/Shows of the week*/
class MovieList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            moviePage: {movies: [], hasMore: true},
            shows: [],
            isLoading: true,
            error: "",
            timedout: false,
        };
    }

    /** Initial load all Shows with Movies*/
    componentDidMount() {
        this.setState({isLoading: true});
        document.title = "MovieLand Movies";
        axios.get('/api/movies/page/' + this.state.page)
            .then(res => {
                let hasMore = res.headers.hasmore === 'true';
                this.setState({moviePage: {movies: res.data, hasMore: hasMore}, isLoading: true});
                //this.getShows();
                let ids = res.data.slice(0, 5).map(movie => movie.tmdbId);

                axios.get('/api/movies/tmdb/images', {
                      params: {
                          ids: ids
                      },
                      paramsSerializer: params => {
                          return queryString.stringify(params)
                      }
                  }).then(resp => {
                    let data = res.data.map(m => {
                          //console.log("Img:"+resp.data[m.tmdbId]);
                          m.backdrop = resp.data[m.tmdbId];
                          return m;
                      });
                      this.getShows();
                      this.setState({movies: data, isLoading: true});
                })
                //
            })
            .catch(err => this.setState({timedout: true}))
        ;
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
                //this.getShows();
                this.setState({moviePage: {movies: movies, hasMore: hasMore}, isLoading: false});

            })
            .catch(err => this.setState({timedout: true}))
        ;
        // }

    }

    /** Fetch all shows of this week (starting from today)*/
    getShows() {
        axios.get('/api/shows/week')
            .then(res => res.data)
            .then(shows => {
                var movieShows = [];
                shows.forEach(show => {
                    let movId = show.movId;
                    let day = Moment(show.date).locale("en").format("dd");
                    let time = Moment(show.date).format("HH:mm");
                    if (movieShows[movId] == null) {
                        movieShows[movId] = [];
                        movieShows[movId]["Mo"] = [];
                        movieShows[movId]["Tu"] = [];
                        movieShows[movId]["We"] = [];
                        movieShows[movId]["Th"] = [];
                        movieShows[movId]["Fr"] = [];
                        movieShows[movId]["Sa"] = [];
                        movieShows[movId]["Su"] = [];
                        movieShows[movId][day] = [];
                        movieShows[movId][day][time] = show.showId;
                    } else if (movieShows[movId][day] == null) {
                        movieShows[movId][day] = [];
                        movieShows[movId][day][time] = show.showId;
                    } else {
                        movieShows[movId][day][time] = show.showId;
                    }
                    //console.log("Mov:" + movId + " on:" + day + " at:" + time + " Show: " + movieShows[movId][day][time]);
                });
                this.setState({shows: movieShows, isLoading: false});
            })
        /* .catch(err => {
             console.log("Get shows failed")
             this.setState({timedout: true})
         })*/
        ;
    }


    /** Render List of Movies with Shows this week*/
    render() {
        const {moviePage, isLoading, error, timedout, shows} = this.state;
        if (timedout) {
            return <ErrorPage/>
        }
        if (isLoading) {
            return <LoadingPage/>;
        }
        moviePage.movies.forEach(m => m.src = m.movId);
        const moviesDisplayed = moviePage.movies.slice(0, 5);
        const showcaseList = moviesDisplayed.map(movie => {
            return (<Carousel.Item key={movie.movId}>
                <a onClick={() => {
                    let item = document.getElementById('mov' + movie.movId);
                    if (item != null)
                        item.scrollIntoView({block: 'center', behavior: 'smooth'})
                }}
                   className="click-icon">
                    <img src={movie.backdrop} alt={movie.name} className="carousel-image"/>
                </a>
                <Carousel.Caption>
                    <h3>{movie.name}</h3>
                    <p>{movie.name}</p>
                </Carousel.Caption>
            </Carousel.Item>)
        });


        const movieList = moviePage.movies.map(movie => {
            if (shows[movie.movId] == null) {
                return <Row key={movie.movId}/>;
            }

            let days = Object.keys(shows[movie.movId]);
            /** Sort days relative to today */
            let today = Moment().locale("en");
            days = days.sort((a, b) => {
                let da = Moment(a, 'dd');
                if (da.isBefore(today, 'day')) {
                    da = da.add(7, 'days');
                }
                let db = Moment(b, 'dd');
                if (db.isBefore(today, 'day')) {
                    db = db.add(7, 'days');
                }
                return da.isAfter(db) ? 1 : -1;
            });

            const showList = days.map(day => {
                    const movieShowList = Object.keys(shows[movie.movId][day]).map(time => {
                            return (
                                <ListGroupItem key={time} className="showtime-item"><a href={"/show/" + shows[movie.movId][day][time]}>
                                    {time}</a></ListGroupItem>);
                        }
                    );
                    return (

                        <td key={movie.movId + "" + day} width="14.286%">
                            <ListGroup>
                                {movieShowList}
                            </ListGroup>
                        </td>
                    );
                }
            );

            return (
                <Row key={movie.movId} id={'mov' + movie.movId}>
                    <Col>
                        {/*        <ReactCard
                            plain
                            ctTableFullWidth
                            ctTableResponsive
                            content={*/}
                                <Grid>
                                    <Row>
                                        <Col xs={7} sm={5} lg={3} md={3} large={10} xl={10}>

                                            <div>
                                                <img src={movie.posterUrl} className="img-fluid text-center"/>
                                                <div>
                                                    <ButtonGroup style={{display: "flex"}} className="img-fluid">
                                                        <Button color="light" style={{flex: 1}}>
                                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                                        </Button>
                                                        <TrailerModal movId={movie.movId}/>
                                                    </ButtonGroup>
                                                </div>
                                            </div>
                                            {/* <StatsCard
                                                bigIcon={<img src={movie.posterUrl} className="img-fluid text-center"/>}
                                                statsText={movie.name}
                                                statsValue={this.state.amtWatchedMins}
                                            />*/}
                                        </Col>
                                        <Col xs={4} sm={7} lg={3} md={8} >
                                            <h3 className="text-center">{movie.name}</h3><br/>
                                            <p>{movie.description}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={8}>
                                            <ReactCard
                                                ctTableFullWidth
                                                ctTableResponsive
                                                plain
                                                content={
                                                    <Table bordered className="shows-table">
                                                        <thead>
                                                        <tr>
                                                            {days.map(day => {
                                                                return (
                                                                    <th key={day} width="14.286%"
                                                                        className="shows-table"><h5><b>{day}</b></h5>
                                                                    </th>
                                                                );
                                                            })
                                                            }
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            {showList}
                                                        </tr>
                                                        </tbody>
                                                    </Table>}/>
                                        </Col>
                                    </Row>
                                </Grid>
                        {/*   }
                        />*/}
                    </Col>

                </Row>);
        });

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col>
                            <div className="text-center">
                                <h2>This week's Movies</h2><br/>
                                <div className="col-md-10 col-md-offset-1">
                                    <Carousel className="show-carousel">
                                        {showcaseList}
                                    </Carousel><br/><br/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {movieList}

                    {this.state.moviePage.hasMore &&
                    <Row>
                        <Col>
                            <InfiniteLoader onVisited={() => this.loadMovies()}
                                            containerElement={document.querySelector('.wrapper')}
                                            loaderStyle={{backgroundColor: "red"}}/>
                        </Col>
                    </Row>}
                </Grid>
            </div>
        );
    }
}

export default MovieList;