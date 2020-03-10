/*!

=========================================================
* Light Bootstrap UserReservation React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import NotificationSystem from "react-notification-system";
import TopNavbar from "../components/Navbars/TopNavbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";

import { style } from "../variables/Variables.jsx";


import image from "../assets/img/sidebar-3.jpg";
import AuthenticationService from "../service/AuthenticationService";
import {adminRoutes, userRoutes} from "../routes";
import {loggedInActions, loggedOutActions, otherActions} from "../userActions";
import history from "../history";
import AuthenticatedRoute from "../webviews/misc/AuthenticatedRoute";

/** Basic Layout for all Pages*/
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _notificationSystem: null,
            color: "red",
            fixedClasses: "dropdown show-dropdown",
            currUser: AuthenticationService.getUserName(),
            loggedIn: AuthenticationService.isUserLoggedIn(),
        };
        this.routes = userRoutes;
        this.actions = loggedOutActions;
    }

    /** Show notification at position
     * -> is passed to Subroute components*/
    handleNotificationClick = (msg, level, position) => {
        this.state._notificationSystem.addNotification({
            title: <span data-notify="icon" className={
                level === "error" ? "pe-7s-less" :
                    level === "warning" ? "pe-7s-close" :
                        level === "success" ? "pe-7s-like2"
                            : "pe-7s-info"}/>,
            message: (<div>{msg}</div>),
            level: level,
            position: position,
            autoDismiss: 6
        });
    };

    /** Render Routes to Components*/
    getRoutes = routes => {
        return routes.map((prop, key) => {
            return (
                <Route
                    path={prop.path}
                    exact={prop.subroutes == null}
                    render={props => (
                        <prop.component
                            {...props}
                            subroutes={prop.subroutes}
                            showNotification={this.handleNotificationClick}
                            onAction={prop.onAction ? () => this.onAction(prop.name) : null}
                        />
                    )}
                    key={key}
                />
            );
        });
    };

    getBrandText = path => {
        for (let i = 0; i < this.routes.length; i++) {
            if (
                this.props.location.pathname.indexOf(
                    this.routes[i].path
                ) !== -1
            ) {
                return this.routes[i].name;
            }
        }
        return "MovieLand";
    };

    componentDidMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem});
        this.setLoggedIn(this.state.loggedIn);
    }


    /** Toggle nav-open if window width is small  */
    componentDidUpdate(e) {
        if (
            window.innerWidth < 1020 &&
            e.history.location.pathname !== e.location.pathname &&
            document.documentElement.className.indexOf("nav-open") !== -1
        ) {

            document.documentElement.classList.toggle("nav-open");
        }
        if (e.history.action === "PUSH") {
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.refs.mainPanel.scrollTop = 0;
        }
    }

    /** Execute onAction from a Route (e.g. login/logout)*/
    onAction(action) {
        if (action === "Login") {
            this.setLoggedIn(AuthenticationService.isUserLoggedIn());
        } else if (action === "Logout") {
            AuthenticationService.logoutUser();
            this.setLoggedIn(AuthenticationService.isUserLoggedIn());
            history.push("/");
        }
    }

    /** Reaload user/admin routes and actions if loggedin changes*/
    setLoggedIn(loggedIn) {
        let isAdmin = loggedIn && AuthenticationService.isAdmin();
        this.routes = isAdmin ? adminRoutes : userRoutes;
        this.actions = loggedIn ? loggedInActions : loggedOutActions;
        this.setState({loggedIn: loggedIn, isAdmin: isAdmin});
    }

    /** Render TopNavbar + Route's Component + Sidebar + Footer*/
    render() {
        return (
            <div className="wrapper">
                <NotificationSystem ref="notificationSystem" style={style}/>
                <div id="main-panel" className="main-panel" ref="mainPanel">
                    <TopNavbar
                        {...this.props} routes={this.routes} actions={this.actions}
                        brandText={this.getBrandText(this.props.location.pathname)}
                    />
                    <Switch>
                        {this.getRoutes(this.routes)}
                        {this.getRoutes(loggedInActions)}
                        {this.getRoutes(loggedOutActions)}
                        {this.getRoutes(otherActions)}
                    </Switch>
                    <Sidebar {...this.props} routes={this.routes} actions={this.actions}
                             color={this.state.color}
                    />
                    <footer className="footer footer-me">
                        &copy; {new Date().getFullYear()}{" "}
                        <a href="https://github.com/PhilKes">
                            Phil Kes
                        </a>

                        <div className="py-2">All Movie details, images from{" "}
                            <a href="https://www.themoviedb.org/" target="_blank">TMDB</a>
                            , Template by{' '}
                            <a href="http://www.creative-tim.com?ref=lbr-footer">
                                Creative Tim
                            </a>
                        </div>
                    </footer>
                </div>
            </div>

        );
    }
}

export default Layout;
