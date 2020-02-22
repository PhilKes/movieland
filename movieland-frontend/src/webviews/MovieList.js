import React, {Component} from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Table,
    Input,
    Alert,
    Carousel,
    Card,
    CarouselIndicators,
    CarouselControl,
    CarouselCaption,
    CarouselItem,
    ListGroupItem,
    ListGroup,
    CardBody,
    CardImg
} from 'reactstrap';
import {Link} from 'react-router-dom';
import MovieModal from "./modal/MovieModal";
import Moment from 'moment';
import axios from "axios";
import ErrorPage from "./misc/ErrorPage";
import LoadingPage from "./misc/LoadingPage";
import * as queryString from "query-string";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import TrailerModal from "./modal/TrailerModal";
import CardHeader from "reactstrap/lib/CardHeader";
import {Grid,Row,Col} from "react-bootstrap";
import ReactCard from "../components/Card/Card";
import {StatsCard} from "../components/StatsCard/StatsCard";
import CustomButton from "../components/CustomButton/CustomButton";


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
        axios.get('/api/movies')
            .then(res => res.data)
            .then(data => {
                let ids = data.map(movie => movie.tmdbId);
                axios.get('/api/movies/tmdb/images', {
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
                return <Row key={movie.movId}/>;
            }

            let days = Object.keys(shows[movie.movId]);
            let today = Moment().locale("en").format("dd");
            //TODO days in order starting from today
            days = days.sort((a, b) => {
                if (a === today) {
                    return -1;
                } else {
                    return 1;
                }
            });

            const showList = days.map(day => {
                    const movieShowList = Object.keys(shows[movie.movId][day]).map(time => {
                            return (
                                <ListGroupItem key={time} className="showtime-item"><a href={"/show/" + shows[movie.movId][day][time]}>
                                    {time}</a></ListGroupItem>
                            );
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
                <Row key={movie.movId}>
                    <Col>
                        {/*TODO TABLE FULL WIDTH*/}
                        <ReactCard
                            plain
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                                <Grid>
                                    <Row>
                                        <Col xs={7} sm={5} lg={3} md={3} large={10} xl={10}>

                                            <div>
                                                <img src={movie.posterUrl} className="img-fluid text-center"/>
                                                <div>
                                                    <ButtonGroup style={{display: "flex"}} className="img-fluid">
                                                        <CustomButton bsStyle="light" style={{flex: 1}} >
                                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                                        </CustomButton>
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
                                            <h3 className="text-center">{movie.name}</h3>
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
                                                    {days.map(day=>{
                                                        return(
                                                            <th key={day} width="14.286%" className="shows-table"><h5><b>{day}</b></h5></th>
                                                        );
                                                    })
                                                    }
                                                </tr>
                                                {showList}
                                                </thead>
                                            </Table>}/>
                                        </Col>
                                    </Row>
                                </Grid>
                                }
                        />
                    </Col>

                </Row>);
        });

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                        <h2>Newest Movies</h2><br/>
                       {/* <Carousel
                            activeIndex={activeIndex}
                            next={next}
                            previous={previous}
                        >
                            <CarouselIndicators items={moviesDisplayed} activeIndex={activeIndex}
                                                onClickHandler={goToIndex}/>
                            {showcaseList}
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
                            <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
                        </Carousel><br/><br/>*/}
                        </Col>
                    </Row>
                    {movieList}
                </Grid>
            </div>
        );
    }
}

export default MovieList;