import React from 'react';
import {Progress} from 'reactstrap';
import axios from "axios";
import {Col, Grid, Row} from "react-bootstrap";
import {DateRange, DateRangePicker} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import FormInputs from "../../../components/FormInputs/FormInputs";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Card from "../../../components/Card/Card";
import {dateToString} from "../../../variables/Util";
import MediaQuery from "react-responsive";
import LoadingComponent from "../../misc/LoadingComponent";

/** /dashboard/generate page Component
 * Generate Shows/Reseravtions for Date Range*/
class GenerateStats extends LoadingComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            range: {startDate: new Date(), endDate: new Date(), key: 'selection'},
            isGenerating: false,
            progress: 0,
            progressMax: 0,
            showRes: false,
            showShow: true,
            generateRes: false
        };
        console.log(this.state);
    }

    componentDidMount() {
        super.componentDidMount();
        document.title = "Generate Statistics";
        this.setState({isLoading: false});
    }

    /** Handler if DateRangePicker valuess change*/
    handleSelect(ranges) {
        console.log(ranges);
        this.setState({
            range: {
                startDate: ranges.selection.startDate,
                endDate: ranges.selection.endDate, key: 'selection'
            }
        });
    }

    deleteStats() {
        let startDate = this.state.range.startDate;
        let endDate = this.state.range.endDate;
        this.setState({isGenerating: true});
        axios.delete('/api/statistics/statistics?from=' + dateToString(startDate) + "&until=" + dateToString(endDate))
            .then(resp => {
                this.setState({isGenerating: false});
                console.log(resp);
                this.props.showNotification("Deleted Statistics", "success", "bc");
            })
            .catch(err => {
                this.setState({isGenerating: false});
                console.log(err);
                this.props.showNotification("Delete Statistics failed: "
                    + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
            });
    }

    /** Send Generate Requests*/
    generateShowsClicked(ev) {
        ev.preventDefault();
        const data = new FormData(ev.target);
        let moviesPerDay = data.get('movies');
        let showsPerMovie = data.get('shows');
        let resPerShow = data.get('resPerShow');
        let startDate = this.state.range.startDate;
        let endDate = this.state.range.endDate;
        /** Only shows*/
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
                    this.waitAndGetProgress(response.headers.location, 2500);
                })
                .catch(err => {
                    this.setState({isGenerating: false});
                    console.log(err);
                    this.props.showNotification("Generation failed: "
                        + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
                });
        }
    }

    generateReseravtionsClicked(ev) {
        ev.preventDefault();
        const data = new FormData(ev.target);
        let resPerShow = data.get('resPerShow');
        let startDate = this.state.range.startDate;
        let endDate = this.state.range.endDate;
        console.log("POSTING RESERVATION TASK");
        this.setState({generateRes: false});
        axios.post(`/api/statistics/reservations`, {
                from: startDate, until: endDate, resPerShow: resPerShow
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
                this.waitAndGetProgress(response.headers.location, 2500);
            })
            .catch(err => {
                this.setState({isGenerating: false});
                console.log(err);
                this.props.showNotification("Generation failed: "
                    + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
            });
    }

    /**Get Progress of task until done */
    waitAndGetProgress(taskUri, timeout) {
        axios.get(taskUri, {timeout: timeout})
            .then(res => res.data)
            .then(taskProgress => {
                this.setState({progress: taskProgress.progress, progressMax: taskProgress.progressMax});
                if (this.state.progress === this.state.progressMax) {
                    console.log("Task " + taskUri + " finished");
                    this.setState({isGenerating: false});
                    this.props.showNotification("Finished task " + taskProgress.taskId, "success", "bc");

                } else {
                    this.setState({isGenerating: true});
                    setTimeout(() => this.waitAndGetProgress(taskUri, timeout), timeout);
                }
            })
            .catch(err => {
                console.log("Progress update timeout")
            });
    }

    /** Render Movie List with Actions*/
    render() {
        let loading = super.render();
        if (loading)
            return loading;

        const {range} = this.state;

        return (
            <Grid fluid>
                <Row>
                    <Col>
                        <h2>Generate Statistics</h2> <br/>
                        <Card
                            plain
                            ctTableResponsive
                            title={"Choose Date Range"}
                            content={
                                <Grid>
                                    <Row>
                                        <Col>
                                            <MediaQuery maxWidth={675}>
                                                <DateRange
                                                    className="daterange-picker"
                                                    ranges={[range]}
                                                    onChange={this.handleSelect.bind(this)}
                                                    editableDateInputs={true}
                                                    moveRangeOnFirstSelection={false}
                                                />
                                            </MediaQuery>
                                            <MediaQuery minWidth={676}>
                                                <DateRangePicker
                                                    className="daterange-picker"
                                                    ranges={[range]}
                                                    onChange={this.handleSelect.bind(this)}
                                                    editableDateInputs={true}
                                                    moveRangeOnFirstSelection={false}
                                                />
                                            </MediaQuery>
                                            <div className="spacer-bottom"/>
                                        </Col>
                                        <Col>
                                            <CustomButton bsStyle="danger" fill type="submit"
                                                          onClick={this.deleteStats.bind(this)}
                                                          disabled={this.state.isGenerating}>
                                                Delete Statistics
                                            </CustomButton>
                                        </Col>
                                    </Row>
                                </Grid>
                            }/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card
                            title="Generate Shows"
                            content={
                                <form onSubmit={this.generateShowsClicked.bind(this)}>
                                        <div>
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    disabled: this.state.isGenerating,
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
                                                    disabled: this.state.isGenerating,
                                                    label: "Shows per Movie per Day",
                                                    name: "shows",
                                                    type: "number",
                                                    bsClass: "form-control",
                                                    defaultValue: 4,
                                                    placeholder: "Amount of Shows per Movie"
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
                                    (<CustomButton bsStyle="warning" fill type="submit">
                                        Generate
                                    </CustomButton>)}
                                </form>}
                        />
                        <Card
                            title="Generate Reservations"
                            content={
                                <form onSubmit={this.generateReseravtionsClicked.bind(this)}>
                                        <div>
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    disabled: this.state.isGenerating,
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
                                        (<CustomButton bsStyle="warning" fill type="submit">
                                            Generate
                                        </CustomButton>)}
                                    </form>
                            }
                        />
                    </Col>
                </Row>

            </Grid>
        );
    }


}

export default GenerateStats;