import React, {Component} from 'react';
import {
    Button,
    Container,
    Table,
    Input,
    FormGroup, Label, InputGroup, InputGroupAddon, Form
} from 'reactstrap';
import MovieShowModal from "../modal/MovieShowModal";
import Moment from 'moment';
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import ErrorPage from "../misc/ErrorPage";
import LoadingPage from "../misc/LoadingPage";
import {Col, Grid, Row} from "react-bootstrap";
import ReactCard from "../../components/Card/Card";
import CustomButton from "../../components/CustomButton/CustomButton";

/** /shows page
 * Shows MovieShows by Date + ADD/REMOVE Shows*/
class MovieShowList extends Component {

    constructor(props) {
        super(props);
        this.state = {shows: [], isLoading: true, timedout: false};
        this.remove = this.remove.bind(this);
        this.searchQuery = "";
        this.params = new URLSearchParams(this.props.location.search);
        this.dateParam = this.params.get('date');

    }

    /** Initial load all shows*/
    componentDidMount() {
        document.title = "Manage Shows";
        if (this.dateParam == null || this.dateParam.length < 9) {
            this.dateParam = Moment().format("YYYY-MM-DD");
            this.updateDateParam();
        }
        this.setState({isLoading: true});
        this.updateShowList()
    }

    /** Update date or set to today*/
    changeDate(date) {
        this.dateParam = date.target.value;
        if (this.dateParam.length < 9) {
            this.dateParam = Moment().format("YYYY-MM-DD");
        }
        this.updateDateParam();
        this.updateShowList();
    }

    /** Update url query Parameter for new Date*/
    updateDateParam() {
        console.log("Changed Date to" + this.dateParam);
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?date=' + this.dateParam;
        window.history.pushState({path: newurl}, '', newurl);
        console.log("Date: " + this.dateParam);
    }

    /** Fetch Shows for date and fetch referenced Movies*/
    updateShowList() {
        axios.get('api/shows?date=' + this.dateParam)
            .then(res => {
                let promises = [];
                let movies = {};
                let shows = res.data;
                shows.forEach(
                    (show) => {
                        if (movies[show.movId] == null) {
                            promises.push(
                                axios.get('api/movie/' + show.movId)
                                    .then(movie => movies[movie.data.movId] = movie.data));
                        }
                    });
                axios.all(promises).then(res => {
                    shows = shows.sort((a, b) => Moment(a.date).diff(b.date));
                    this.setState({shows: shows, movies: movies, isLoading: false});
                })
            })
            .catch(err => this.setState({timedout: true}));
    }

    /** Remove movie with movieid=id */
    async remove(ev) {
        //TODO Just edit time, do not completely remove
        ev.preventDefault();
        const data = new FormData(ev.target);
        let id = data.get('showId');
        console.log("Remove Show: " + id);
        await axios.delete(`/api/show/${id}`)
            .then(() => {
                let updatedShows = [...this.state.shows].filter(i => i.showId + "" !== id + "");
                updatedShows = updatedShows.sort((a, b) => Moment(a.date).diff(b.date));
                this.setState({shows: updatedShows});
            });
    }

    /** Add show from Add Action*/
    addShow(ev) {
        ev.preventDefault();
        const data = new FormData(ev.target);
        let date = Moment(this.dateParam + ' ' + data.get('time'));
        let show = {movId: data.get('movId'), date: date};
        this.postShow(show);
    }

    /** Add Show from Modal entered name*/
    addShowModal(showModal) {
        let date = Moment(this.dateParam + ' ' + showModal.time);
        let show = {movId: showModal.movId, date: date};
        this.postShow(show);
    }

    /** Post show to API and reload shows*/
    postShow(show) {
        console.log("Add Show: MovId:" + show.movId + " DateTime: " + show.date.format('YYYY-MM-DD HH:mm'));
        axios.post(`/api/show`,
            JSON.stringify({movId: show.movId, date: show.date}),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(show => {
                /*let shows=this.state.shows;
                shows.push(show);
                this.setState({shows:shows});*/
                this.updateShowList();
            });
    }

    render() {
        const {shows, movies, isLoading, timedout} = this.state;
        if (timedout) {
            return <ErrorPage/>
        }
        if (isLoading) {
            return <LoadingPage/>;
        }

        /** Generate table rows for each movie containing its shows on dateParam*/
        let movieKeys=Object.keys(movies);
        const movieList = movieKeys.map(id => {
            console.log("Render movie: " + movies[id].name)
            return <tr key={movies[id].movId}>
                <td>
                    <h5 className="text-center">{movies[id].name}</h5>
                    <div className="text-center">
                    <img src={movies[id].posterUrl} className="img-fluid" alt="Responsive image"/>
                    </div>
                </td>
                <td>
                    <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Table bordered >
                                <thead><tr><th colSpan={2} className="text-center">Shows</th></tr></thead>
                                <tbody>
                                {shows.map(show => {
                                    if (show.movId == movies[id].movId) {
                                        return (
                                            <tr key={show.showId} className="text-center">
                                                <td style={{
                                                    fontSize: 14 + 'pt'
                                                }}>
                                                    {Moment(show.date).format('HH:mm')}
                                                </td>
                                                <td>
                                                    <Form onSubmit={this.remove.bind(this)}>
                                                        <Button type="submit" size="sm" color="danger">
                                                            <FontAwesomeIcon icon={faMinusCircle}/>
                                                        </Button>
                                                        <Input type="hidden" name="showId" value={show.showId}/>
                                                    </Form>
                                                </td>
                                            </tr>);
                                    }
                                })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    </Grid>
                </td>

                <td>
                    <Form onSubmit={this.addShow.bind(this)}>
                        <InputGroup>
                            <Input type="time" defaultValue={Moment().format("HH:mm")}
                                   style={{width: 'auto'}}
                                   placeholder="time placeholder"
                                   name="time"
                            />
                            <Input type="hidden" name="movId" value={movies[id].movId}/>
                            <InputGroupAddon addonType="append">
                                <CustomButton block size="sm" bsStyle="success" type="submit">Add</CustomButton>
                            </InputGroupAddon>
                        </InputGroup>
                    </Form>
                    {/* <Button size="sm" color="danger">Delete</Button>*/}
                </td>
            </tr>
        });

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <h3>Movie Shows</h3>
                            <div >
                                <MovieShowModal onSubmit={this.addShowModal.bind(this)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="exampleDate">Date</Label>
                                <Input type="date" defaultValue={this.dateParam} placeholder="date placeholder"
                                       onChange={this.changeDate.bind(this)}
                                       style={{width: 'auto'}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            {
                                movieKeys.length>0?
                                    (<ReactCard
                                    plain
                                    ctTableFullWidth
                                    ctTableResponsive
                                    content={
                                    <Table className="wrap-words">
                                        <thead>
                                        <tr className="text-center">
                                            <th className="text-center">Movie</th>
                                            <th className="text-center">Times</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {movieList}
                                        </tbody>
                                    </Table>}
                                />)
                                : <h4>No Shows found for this date...</h4>
                            }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }


}

export default MovieShowList;