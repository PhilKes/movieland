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
import {faChartLine, faDollarSign, faEye, faFilm, faHome, faTicketAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import history from "../../history";
// Be sure to include styles at some point, probably during your bootstraping
import '../../assets/css/react-sidenav.css';
import ScrollButton from "../../components/Misc/ScrollButton";
import Summary from "./dashboard/Summary";
import {Redirect, Route, Switch} from "react-router-dom";

/** Dashboard for Admin with Statistics, Managing Users/Movies/Shows*/
class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dailyStats: null
        }
    }

    //TODO GENERATING TAB
    /** Fetch summary for last 7 Days*/
    componentDidMount() {
        this.contentRef = React.createRef();
        document.title = "Admin UserDashboard";
        this.setState({isLoading: false});
    }

    /** Returns legend for Charts */
    createLegend(json) {
        var legend = [];
        for (var i = 0; i < json["names"].length; i++) {
            var type = "fa fa-circle text-" + json["types"][i];
            legend.push(<i className={type} key={i}/>);
            legend.push(" ");
            legend.push(json["names"][i]);
        }
        return legend;
    }

    //TODO
    scrollToTop() {
        let intervalId = setInterval(this.scrollStep.bind(this), 16.66);
        this.setState({intervalId: intervalId});
    }

    scrollStep() {
        console.log("Doc: " + document.scrollingElement.scrollTop)
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }

        window.scroll(0, window.pageYOffset - 50);
    }

    /** Render Routes to Components*/
    getRoutes = routes => {
        return routes.map((prop, key) => {
            return (
                <Route
                    path={"/dashboard" + prop.path}
                    exact={prop.subroutes == null}
                    subroutes={prop.subroutes}
                    render={props => (
                        <prop.component
                            {...props}
                            showNotification={this.handleNotificationClick}
                            onAction={prop.onAction ? () => this.onAction(prop.name) : null}
                        />
                    )}
                    key={key}
                />
            );
        });
    };

    /** Render Cards with Statistics, Charts,...*/
    render() {
        if (this.state.isLoading) {
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
            <div className="content" ref={this.contentRef}>
                <SideNav
                    onSelect={(to) => {
                        if (window.location.pathname !== "/dashboard" + to) {
                            history.push("/dashboard" + to);
                        }
                    }}
                >
                    <SideNav.Toggle/>
                    <SideNav.Nav defaultSelected={window.location.pathname === "/dashboard" ?
                        this.props.subroutes[0].path : window.location.pathname.substring(10)}>
                        {
                            this.props.subroutes.map((prop, key) => {
                                return (
                                    <NavItem eventKey={prop.path}>
                                        <NavIcon>
                                            <i style={{fontSize: '1.75em'}}/>
                                            <FontAwesomeIcon icon={prop.icon} size="2x"/>
                                        </NavIcon>
                                        <NavText>
                                            {prop.name}
                                        </NavText>
                                    </NavItem>)
                            })
                        }
                    </SideNav.Nav>
                </SideNav>
                {/*  <ScrollButton scrollStepInPx="50" delayInMs="16.66" onScroll={this.scrollToTop.bind(this)}
                            scrollContent={this.contentRef}/>*/}

                <div className="sidebar-spacer">
                    <Switch>
                        {this.getRoutes(this.props.subroutes)}
                        <Route path='/dashboard' exact={true}>
                            <Redirect to={'/dashboard' + this.props.subroutes[0].path}/>
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default AdminDashboard;
