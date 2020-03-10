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
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilm, faSignOutAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import {loggedInActions, loggedOutActions} from "../../userActions";
import AuthenticationService from "../../service/AuthenticationService";

/** NavLinks either shown on top or in Sidebar
 *  Routes/actions for user/admin*/
class NavbarLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth
        };
    }

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    updateDimensions() {
        this.setState({ width: window.innerWidth });
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    /** Render Routes (left) and Actions (right)*/
    render() {
        const notification = (
            <div>
                <i className="fa fa-globe"/>
                <b className="caret"/>
                <span className="notification">5</span>
                <p className="hidden-lg hidden-md">Notification</p>
            </div>
        );

        return (
            <div>
                <Nav pullLeft>
                    {this.props.routes.map((prop, key) => {
                        if (!prop.redirect && prop.show)
                            return (

                                <NavItem key={key} className="nav-link">
                                    <NavLink
                                        className={"nav-link ontop"} to={prop.path}>
                                        <div className="navlink-div">
                                            <FontAwesomeIcon className="fontaw-icon" icon={prop.icon}
                                                             size="lg"/>{prop.name}
                                        </div>
                                    </NavLink>
                                </NavItem>

                            );
                        return null;
                    })}
                </Nav>
                <Nav pullRight>
                    {this.props.actions.map((prop, key) => {
                        return (
                            <NavItem key={key} className="nav-link">
                                <div className="navlink-div">
                                    <NavLink className={"nav-link ontop"} to={prop.path}>
                                        <FontAwesomeIcon className="fontaw-icon" icon={prop.icon} size="lg"/>
                                        {prop.name === "Account" ? AuthenticationService.getUserName() : prop.name}
                                    </NavLink>
                                </div>
                            </NavItem>
                        )
                    })
                    }
                </Nav>
            </div>
        );
    }
}

export default NavbarLinks;
