/*!

=========================================================
* Light Bootstrap UserDashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import {Card} from "../../components/Card/Card.jsx";
import {StatsCard} from "../../components/StatsCard/StatsCard.jsx";
import {Tasks} from "../../components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "../../variables/Variables.jsx";
import axios from "axios";
import * as queryString from "query-string";
import LoadingPage from "../misc/LoadingPage";
import moment from "moment";
import {faDollarSign, faEye, faFilm, faInfoCircle, faTicketAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class AdminDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isLoading:true,
        dailyStats: null
    }
  }

  //TODO HOURS WATCHED, MOVIES IN DB, BEST GROSSING MOVIES, GENERATING TAB
  componentDidMount() {
      document.title = "Admin UserDashboard";
    let today= moment();
    axios.get('/api/statistics/summary', {
      params: {
        until: today.format("YYYY-MM-DD"),
        from: today.subtract(7,"days").format("YYYY-MM-DD")
      },
      paramsSerializer: params => {
        return queryString.stringify(params)
      }
    })
        .then(res => res.data)
        .then(summary => {
          console.log("daily stats: "+summary.dailyStats);
          let labels=[];
          let seatsSeries=[];
          let series=[];
          Object.keys(summary.dailyStats)
              .sort((k1,k2)=>moment(k1).isAfter(moment(k2))? 1: -1)
              .forEach(date=>{
            console.log("day: ")
            console.log(date)
            console.log("Stats:")
            console.log(summary.dailyStats[date]);
            labels.push(moment(date).format("dd,DD.MM"));
            seatsSeries.push(summary.dailyStats[date]);
          });
          series.push(seatsSeries);

          this.setState({isLoading:false, income:summary.income,amtShows: summary.amtShows,
          amtMovies: summary.amtMovies, amtSeats: summary.amtSeats, amtWatchedMins:summary.amtWatchedMins,
          dailyStats: {labels: labels, series:series},highestMovie: summary.highestGrossingMovie,
            lowestMovie: summary.lowestGrossingMovie
          })
        })
  }


  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    if(this.state.isLoading){
      return <LoadingPage/>
    }

    var optionsVisitorChart = {
      showArea: false,
      height: "245px",
      axisX: {
        showGrid: false
      },
      axisY: {
        showGrid: true
      },
      lineSmooth: true,
      showLine: true,
      showPoint: true,
      fullWidth: true,
      chartPadding: {
        right: 50
      }
    };
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<FontAwesomeIcon icon={faFilm} size="lg" className="text-dark"/>}
                statsText="Movies shown"
                statsValue={this.state.amtMovies}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Last 7 Days"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<FontAwesomeIcon icon={faDollarSign} size="lg" className="text-success"/>}
                statsText="Revenue"
                statsValue={this.state.income+" $" }
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last 7 Days"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<FontAwesomeIcon icon={faTicketAlt} size="lg" className="text-danger"/>}
                statsText="Tickets sold"
                statsValue={this.state.amtSeats}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="Last 7 Days"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<FontAwesomeIcon icon={faEye} size="lg" className="text-warning"/>}
                statsText="Watched Minutes"
                statsValue={this.state.amtWatchedMins}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Last 7 Days"
              />
            </Col>
            <Col lg={6} sm={6}>
              <StatsCard
                  bigIcon={<img src={this.state.highestMovie.posterPath} className="img-fluid small-fluid"/>}
                  statsText="Highest Grossing Movie"
                  statsValue={this.state.highestMovie.grossing+" $\n ("+this.state.highestMovie.visitors+" Tickets)"}
                  statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Last 7 Days"
              />
            </Col>
            <Col lg={6} sm={6}>
              <StatsCard
                  bigIcon={<img src={this.state.lowestMovie.posterPath} className="img-fluid small-fluid"/>}
                  statsText="Lowest Grossing Movie"
                  statsValue={this.state.lowestMovie.grossing+"  $\n ("+this.state.lowestMovie.visitors+" Tickets)"}
                  statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Last 7 Days"
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Visitors"
                category="Last 7 Days"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={this.state.dailyStats}
                      type="Line"
                      options={optionsVisitorChart}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Email Statistics"
                category="Last Campaign Performance"
                stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default AdminDashboard;
