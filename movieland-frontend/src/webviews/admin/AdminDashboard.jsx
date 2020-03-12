/*!

=========================================================
* Light Bootstrap ReservationValidation React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SideNav, {NavIcon, NavItem, NavText} from '@trendmicro/react-sidenav';
import {TinyButton as ScrollUpButton} from "react-scroll-up-button";
import history from "../../history";
// Be sure to include styles at some point, probably during your bootstraping
import '../../assets/css/react-sidenav.css';
import {Redirect, Route, Switch} from "react-router-dom";
import LoadingComponent from "../misc/LoadingComponent";

/** Dashboard for Admin with Statistics, Managing Users/Movies/Shows*/
class AdminDashboard extends LoadingComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            dailyStats: null
        }
    }

    //TODO GENERATING TAB
    /** Fetch summary for last 7 Days*/
    componentDidMount() {
        super.componentDidMount();
        this.contentRef = React.createRef();
        document.title = "Admin ReservationValidation";
        this.setLoading(false);
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
        //let intervalId = setInterval(this.scrollStep.bind(this), 16.66);
        //this.setState({intervalId: intervalId});
        window.scrollTo(0, 0);
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
                            showNotification={this.props.showNotification}
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
        let loading = super.render();
        if (loading)
            return loading;

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
            <div className="content whole-height" ref={this.contentRef}>
                <ScrollUpButton ContainerClassName="scroll-button" TransitionClassName="scroll-button-toggled"
                />
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
                                    <NavItem key={key} eventKey={prop.path}>
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
