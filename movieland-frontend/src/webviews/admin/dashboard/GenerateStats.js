import React, {Component} from 'react';
import {Button, ButtonGroup, Table, Input, Alert, Label, FormGroup, Progress, CustomInput} from 'reactstrap';
import MovieModal from "../../modal/MovieModal";
import Moment from 'moment';
import axios from "axios";
import ErrorPage from "../../misc/ErrorPage";
import LoadingPage from "../../misc/LoadingPage";
import {Col, Grid, Row} from "react-bootstrap";
import ReactCard from "../../../components/Card/Card";
import InfiniteScroll from 'react-infinite-scroller';
import InfiniteLoader from "react-infinite-loader";
import DayPicker from "react-day-picker";
import {Helmet} from "react-helmet";
import {DateRangePicker} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import FormInputs from "../../../components/FormInputs/FormInputs";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Loader from "react-loader-spinner"; // theme css file
import Card from "../../../components/Card/Card";
import Checkbox from "../../../components/CustomCheckbox/CustomCheckbox";

/** /movies/edit page Component
 * Shows Movies + ADD/REMOVE Movies (only for Admins)*/
class GenerateStats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: "",
            timedout: false,
            range: {startDate: new Date(), endDate: new Date(), key: 'selection'},
            isGenerating: false,
            progress: 0,
            progressMax: 0,
            showRes: false,
            showShow: true,
            generateRes: false
        };
    }

    /** Initial load all movies*/
    componentDidMount() {
        document.title = "Generate Statistics";
        this.setState({isLoading: false});
    }

    handleSelect(ranges) {
        console.log(ranges);
        this.setState({
            range: {
                startDate: ranges.selection.startDate,
                endDate: ranges.selection.endDate, key: 'selection'
            }
        });
    }

    /** Get Data from Form and validate to send register request*/
    generateClicked(ev) {
        ev.preventDefault();
        const data = new FormData(ev.target);
        let moviesPerDay = data.get('movies');
        let showsPerMovie = data.get('shows');
        let resPerShow = data.get('resPerShow');
        let startDate = this.state.range.startDate;
        let endDate = this.state.range.endDate;
        //Only shows
        if (this.state.showShow) {
            axios.post(`/api/statistics/shows`, {
                    from: startDate, until: endDate, moviesPerDay: moviesPerDay, showsPerMovie: showsPerMovie
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    this.setState({isGenerating: false});
                    this.props.showNotification("Started ShowGeneration task: " + response.headers.location, "warning", "bc");
                    console.log(response);
                    this.waitAndGetProgress(response.headers.location, 1000);
                })
                .catch(err => {
                    this.setState({isGenerating: false});
                    console.log(err);
                    this.props.showNotification("Generation failed: "
                        + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
                });
            if (this.state.showRes) {
                this.setState({
                    generateRes: true,
                    resData: {startDate: startDate, endDate: endDate, resPerShow: resPerShow}
                });
            }
        } else if (this.state.showRes) {
            this.postGenerateRes({startDate: startDate, endDate: endDate, resPerShow: resPerShow});
        }
    }

    postGenerateRes(data) {
        console.log("POSTING RESERVATION TASK");
        this.setState({generateRes: false});
        axios.post(`/api/statistics/reservations`, {
                from: data.startDate, until: data.endDate, resPerShow: data.resPerShow
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this.setState({isGenerating: false});
                this.props.showNotification("Started ResGeneration task: " + response.headers.location, "warning", "bc");
                console.log(response);
                this.waitAndGetProgress(response.headers.location, 1000);
            })
            .catch(err => {
                this.setState({isGenerating: false});
                console.log(err);
                this.props.showNotification("Generation failed: "
                    + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
            });

    }

    waitAndGetProgress(taskUri, timeout) {
        setTimeout(() => {
            axios.get(taskUri)
                .then(res => res.data)
                .then(taskProgress => {
                    this.setState({progress: taskProgress.progress, progressMax: taskProgress.progressMax});
                    if (this.state.progress === this.state.progressMax) {
                        this.setState({isGenerating: false});
                        this.props.showNotification("Finished task " + taskProgress.taskId, "success", "bc");
                        //POST generate Reservations if enabled
                        if (this.state.generateRes) {
                            this.postGenerateRes(this.state.resData);
                        }
                    } else {
                        this.setState({isGenerating: true});
                        this.waitAndGetProgress(taskUri, 1000);
                    }
                });
        }, timeout);
    }


    reservationCheckChanged(state) {
        this.setState({showRes: state});
    }

    showCheckedChanged(state) {
        this.setState({showShow: state});
    }

    /** Render Movie List with Actions*/
    render() {
        const {isLoading, error, timedout, range} = this.state;
        if (timedout) {
            return <ErrorPage/>
        }
        if (isLoading) {
            return <LoadingPage/>;
        }

        return (
            <Grid fluid>
                <Row>
                    <Col>
                        <h2>Generate Statistics</h2><br/>
                        <h4>Choose Date Range</h4>
                        <DateRangePicker
                            ranges={[range]}
                            onChange={this.handleSelect.bind(this)}
                        />
                        <div className="spacer-bottom"/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card
                            title="Generating Settings"
                            content={
                                <div>
                                    <form onSubmit={this.generateClicked.bind(this)}>
                                        <Checkbox
                                            number="checkboxShow"
                                            isChecked={this.state.showShow}
                                            label="Generate Shows"
                                            onChangeValue={this.showCheckedChanged.bind(this)}
                                        />
                                        <div>
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    disabled: !this.state.showShow,
                                                    label: "Movies per Day",
                                                    name: "movies",
                                                    type: "number",
                                                    bsClass: "form-control",
                                                    defaultValue: 10,
                                                    placeholder: "Amount of Movies per Day"
                                                }]}
                                            />
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    disabled: !this.state.showShow,
                                                    label: "Shows per Movie per Day",
                                                    name: "shows",
                                                    type: "number",
                                                    bsClass: "form-control",
                                                    defaultValue: 4,
                                                    placeholder: "Amount of Shows per Movie"
                                                }]}
                                            />
                                        </div>
                                        <Checkbox
                                            number="checkboxRes"
                                            isChecked={this.state.showRes}
                                            label="Generate Reservations"
                                            onChangeValue={this.reservationCheckChanged.bind(this)}
                                        />
                                        <div>
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    disabled: !this.state.showRes,
                                                    label: "Reservations per Show",
                                                    name: "resPerShow",
                                                    type: "number",
                                                    bsClass: "form-control",
                                                    defaultValue: 10,
                                                    placeholder: "Amount of Reservations per Show"
                                                }]}
                                            />
                                        </div>
                                        {this.state.isGenerating &&
                                        (<div>
                                            <div className="text-center">
                                                {Math.round(this.state.progress / this.state.progressMax * 100)}%
                                            </div>
                                            <Progress value={this.state.progress} max={this.state.progressMax}
                                                      animated={true}/>
                                        </div>)
                                        ||
                                        (<CustomButton bsStyle="warning" pullLeft fill type="submit">
                                            Generate
                                        </CustomButton>)}
                                    </form>
                                </div>
                            }
                        />
                    </Col>
                </Row>

            </Grid>
        );
    }


}

export default GenerateStats;