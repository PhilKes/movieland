import React, {Component} from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Table,
    Input,
    Alert,
    Carousel,
    CarouselIndicators,
    CarouselControl, CarouselCaption, CarouselItem, DropdownToggle, ListGroupItem, ListGroup, Row, Col
} from 'reactstrap';
import {Card} from "react-bootstrap";
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import MovieModal from "./modal/MovieModal";
import Moment from 'moment';
import axios from "axios";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import * as queryString from "query-string";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faVideo} from "@fortawesome/free-solid-svg-icons";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import TrailerModal from "./modal/TrailerModal";


/** /movies page Component
 * Shows current Movies/Shows of the week*/
class MovieList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            shows: [],
            isLoading: true,
            error: "",
            timedout: false,
            animating: false,
            activeIndex: 0
        };

    }

    /** Initial load all shows*/
    componentDidMount() {
        this.setState({isLoading: true});
        document.title = "MovieLand Movies";
        //TODO get wide screen Posters for carousel
        axios.get('api/movies')
            .then(res => res.data)
            .then(data => {
                let ids = data.map(movie => movie.tmdbId);
                axios.get('api/movies/tmdb/images', {
                    params: {
                        ids: ids
                    },
                    paramsSerializer: params => {
                        return queryString.stringify(params)
                    }
                }).then(resp => {
                    data = data.map(m => {
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

    getShows() {
        axios.get('api/shows/week')
            .then(res => res.data)
            .then(shows => {
                var movieShows = [];
                shows.forEach(show => {
                    let movId = show.movId;
                    let day = Moment(show.date).format("dd");
                    let time = Moment(show.date).format("HH:mm");
                    if (movieShows[movId] == null) {
                        movieShows[movId] = [];
                        movieShows[movId]["Mo"] = [];
                        movieShows[movId]["Di"] = [];
                        movieShows[movId]["Mi"] = [];
                        movieShows[movId]["Do"] = [];
                        movieShows[movId]["Fr"] = [];
                        movieShows[movId]["Sa"] = [];
                        movieShows[movId]["So"] = [];
                        movieShows[movId][day] = [];
                        movieShows[movId][day][time] = show.showId;
                    } else if (movieShows[movId][day] == null) {
                        movieShows[movId][day] = [];
                        movieShows[movId][day][time] = show.showId;
                    } else {
                        movieShows[movId][day][time] = show.showId;
                    }
                    console.log("Mov:" + movId + " on:" + day + " at:" + time + " Show: " + movieShows[movId][day][time]);
                });
                this.setState({shows: movieShows, isLoading: false});
            })
        /* .catch(err => {
             console.log("Get shows failed")
             this.setState({timedout: true})
         })*/
        ;
    }



    render() {
        const {movies, isLoading, error, timedout, shows} = this.state;
        if (timedout) {
            return <ErrorPage/>
        }
        if (isLoading) {
            return <LoadingPage/>;
        }
        movies.forEach(m => m.src = m.movId);
        const moviesDisplayed = movies.slice(0, 5);
        const showcaseList = moviesDisplayed.map(movie => {
            return (<CarouselItem
                onExiting={() => this.setState({animating: true})}
                onExited={() => this.setState({animating: false})}
                key={movie.movId}>
                <img src={movie.backdrop} alt={movie.name}/>
                <CarouselCaption captionText={movie.description} captionHeader={movie.name}/>
            </CarouselItem>)
        });


        /** Controls for Carousel */
        const {activeIndex} = this.state;
        const {animating} = this.state;

        const next = () => {
            if (animating) return;
            const nextIndex = activeIndex === moviesDisplayed.length - 1 ? 0 : activeIndex + 1;
            this.setState({activeIndex: nextIndex})
        }

        const previous = () => {
            if (animating) return;
            const nextIndex = activeIndex === 0 ? moviesDisplayed.length - 1 : activeIndex - 1;
            this.setState({activeIndex: nextIndex})
        }

        const goToIndex = (newIndex) => {
            if (animating) return;
            this.setState({activeIndex: newIndex})
        }

        const movieList = movies.map(movie => {
            if (shows[movie.movId] == null) {
                return <Col key={movie.movId}/>;
            }
            const showList = Object.keys(shows[movie.movId]).map(day => {
                    const movieShowList = Object.keys(shows[movie.movId][day]).map(time => {
                            return (
                                <ListGroupItem key={time}><a href={"/show/" + shows[movie.movId][day][time]}>
                                    {time}</a></ListGroupItem>
                            );
                        }
                    );
                    return (
                        <td key={movie.movId + "" + day}>
                            <ListGroup>
                                <ListGroupItem><h4>{day}</h4></ListGroupItem>
                                {movieShowList}
                            </ListGroup>
                        </td>
                    );
                }
            );
            const descript = `${movie.description}`;
            return (<tr key={movie.movId}>
                <td>
                    <Card border="light">
                        <Card.Header as="h5">{movie.name}</Card.Header>
                        <Card.Body>
                            <Card.Img variant="top" src={movie.posterUrl} className="card-image text-center"/>
                            <div style={{width: 185 + "px"}}>
                                <ButtonGroup style={{display: "flex"}}>
                                    <Button color="light" style={{flex: 1}}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                    </Button>
                                    {/* <Button color="light" style={{flex: 1}}>
                                        <FontAwesomeIcon icon={faVideo}/>
                                    </Button>*/}
                                    <TrailerModal movId={movie.movId}/>
                                </ButtonGroup>
                            </div>
                        </Card.Body>
                    </Card>
                    <br/>
                    {/*<img src={movie.posterUrl} className={'img-fluid'} alt="Responsive image"/>*/}
                </td>
                <td>
                    <Table borderless>
                        <tr>
                            {showList}
                        </tr>
                    </Table>
                </td>
            </tr>)
        });

        return (
                <Container fluid>
                    <h2>Newest Movies</h2><br/>
                    <Carousel
                        activeIndex={activeIndex}
                        next={next}
                        previous={previous}
                    >
                        <CarouselIndicators items={moviesDisplayed} activeIndex={activeIndex}
                                            onClickHandler={goToIndex}/>
                        {showcaseList}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
                        <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
                    </Carousel><br/><br/>
                    <h2>This week</h2>
                    <Table className="mt-5">
                        <tr>
                            <th width="15%"><h4>Movie</h4></th>
                            <th width="50%"><h4>Shows</h4></th>
                        </tr>
                        <tbody>
                        {movieList}
                        </tbody>
                    </Table>
                </Container>
        );
    }
}

export default MovieList;