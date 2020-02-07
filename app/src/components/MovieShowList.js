import React, {Component} from 'react';
import {
    Button,
    Container,
    Table,
    Input,
    FormGroup, Label, InputGroup, InputGroupAddon, Form
} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import MovieShowModal from "./modal/MovieShowModal";
import Moment from 'moment';
import {faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

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
        axios.get('api/shows?date=' + this.dateParam)
            .then(res => {
                let promises = [];
                let movies = {};
                let shows = res.data;
                shows.forEach(
                    (show) => {
                            if(movies[show.movId]==null) {
                                promises.push(
                                    axios.get('api/movie/' + show.movId)
                                        .then(movie => movies[movie.data.movId] = movie.data));
                            }
                    });
                axios.all(promises).then(res => {
                    shows=shows.sort((a,b)=> Moment(a.date).diff(b.date));
                    this.setState({shows: shows,movies: movies, isLoading: false});
                })
            });
    }

    /** Remove movie with movieid=id */
    async remove(ev) {
        //TODO Just edit time, do not completely remove
        ev.preventDefault();
        const data= new FormData(ev.target);
        let id=data.get('showId');
        console.log("Remove Show: "+id);
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
        const data= new FormData(ev.target);
        let date= Moment(this.dateParam+' '+data.get('time'));
        let show={movId: data.get('movId'), date: date};
        this.postShow(show);
    }

    /** Add Show from Modal entered name*/
    addShowModal(showModal) {
        let date= Moment(this.dateParam+' '+showModal.time);
        let show= {movId: showModal.movId, date: date};
        this.postShow(show);
    }

    /** Post show to API and reload shows*/
    postShow(show){
        console.log("Add Show: MovId:"+show.movId+" DateTime: "+show.date.format('YYYY-MM-DD HH:mm'));
        axios.post(`/api/show`,
            JSON.stringify({movId: show.movId, date: show.date}),
            {
                headers: {
                'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(show=>{
                /*let shows=this.state.shows;
                shows.push(show);
                this.setState({shows:shows});*/
                this.updateShowList();
            });
    }

    render() {
        const {shows,movies, isLoading} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        /** Generate table rows for each movie containing its shows on dateParam*/
        const movieList = Object.keys(movies).map(id => {
            console.log("Render movie: " + movies[id].name)
            return <tr key={movies[id].movId}>
                <td><img src={movies[id].posterUrl} className={'img-fluid'} alt="Responsive image"/></td>
                <td>
                    <div className="row">
                        <h5>{movies[id].name}</h5>
                    </div>
                    <div className="row">{movies[id].description}</div>
                </td>
                <td>
                    <Table borderless size="sm">
                        <tbody>
                        {shows.map(show=>{
                            if(show.movId==movies[id].movId){
                                return (
                                <tr key={show.showId} >
                                    <td width="10%">
                                        <div style={{fontSize: 14+'pt', marginRight: 30+'pt'}}>{Moment(show.date).format('HH:mm')}
                                        </div>
                                    </td>
                                    <td>
                                        <Form onSubmit={this.remove.bind(this)}>
                                            <Button  type="submit" size="sm" color="danger" >
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
                </td>

                <td>
                    <Form onSubmit={this.addShow.bind(this)}>
                        <InputGroup>
                            <Input type="time"  defaultValue={Moment().format("HH:mm")}
                                   style={{width: 'auto'}}
                                    placeholder="time placeholder"
                                    name="time"
                            />
                            <Input type="hidden" name="movId" value={movies[id].movId}/>
                            <InputGroupAddon addonType="append">
                                <Button size="sm" color="success" type="submit">Add</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Form>
                       {/* <Button size="sm" color="danger">Delete</Button>*/}
                </td>
            </tr>
        });

        return (

            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <MovieShowModal onSubmit={this.addShowModal.bind(this)}/>
                    </div>
                    <h3>Movie Shows</h3>
                    <FormGroup>
                        <Label for="exampleDate">Date</Label>
                        <Input type="date" defaultValue={this.dateParam} placeholder="date placeholder"
                            onChange={this.changeDate.bind(this)}
                            style={{width: 'auto'}}
                        />
                    </FormGroup>
                    <Table >
                        <thead>
                        <tr>
                            <th width="200px">Poster</th>
                            <th width="25%">Movie Name</th>
                            <th width="10%">Times</th>
                            <th width="25%">Actions</th>
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

export default MovieShowList;