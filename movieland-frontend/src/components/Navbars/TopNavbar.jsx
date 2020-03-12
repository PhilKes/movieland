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
import {Navbar} from "react-bootstrap";

import NavbarLinks from "./NavbarLinks.jsx";

import logo from "../../assets/img/movie_land_icon.png";
import menuIcon from "../../assets/img/menu.svg";

/** Top Navbar / showing sidebar on toggle*/
class TopNavbar extends Component {
  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
  }

    /** Toggle sidebar if NavbarToggle is clicked -> CSS*/
    mobileSidebarToggle(e) {
        console.log("Toggle sidebar")
        if (this.state.sidebarExists === false) {
            this.setState({
                sidebarExists: true
            });
        }
        e.preventDefault();
        document.documentElement.classList.toggle("nav-open");
        /** Append node with clicklistener to close Sidebar again*/
        var node = document.createElement("div");
        node.id = "bodyClick";
        node.onclick = function () {
            this.parentElement.removeChild(this);
            document.documentElement.classList.toggle("nav-open");
        };
        //document.body.appendChild(node);
    }

    render() {
    return (
      <Navbar fluid className="top-navbar" >
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">
              <img
                  alt=""
                  src={logo}
                  className="title-icon"
                  style={{width:130, marginTop: 0}}
              />{' '}
            </a>
          </Navbar.Brand>
            <button id="menu-toggle" type="button" className="navbar-toggle navbar-toggler-button"
                    onClick={this.mobileSidebarToggle}>
            <img src={menuIcon} width={40} height={40} style={{marginTop: -8}}/>
            </button>
        </Navbar.Header>
          <Navbar.Collapse>
          <NavbarLinks {...this.props} onTop={true}
                       actions={this.props.actions}
          />
          </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default TopNavbar;
