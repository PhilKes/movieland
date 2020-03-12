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
import React, {Component} from "react";

import NavbarLinks from "../Navbars/NavbarLinks.jsx";

import logo from "../../assets/img/movie_land_icon.png";

/** Sidebar for Navigation, shown on NavbarToggle */
class Sidebar extends Component {
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
        this.setState({width: window.innerWidth});
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    /** Render Sidebar with NavbarLinks to routes/actions*/
    render() {
        return (
            <div
                id="sidebar"
                className="sidebar"
                data-color={this.props.color}
            >
                <div className="logo">
                    <a
                        href="/"
                        className="simple-text logo-normal"
                    >
                        <div className="logo-img">
                            <img src={logo} alt="logo_image"/>
                        </div>
                    </a>
                </div>
                <div className="sidebar-wrapper">
                    <ul className="nav">
                        <NavbarLinks {...this.props} routes={this.props.routes} onTop={false}
                                     actions={this.props.actions}
                        />
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;
