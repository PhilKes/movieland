import React, {Component, useState} from 'react';
import {Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import AppNavbar from "./AppNavbar";

/** Navigation Bar ,sticky on top*/
export default class ErrorPage extends Component {

    constructor(props) {
        super(props);
        this.state = {message: "Server is unreachable at the moment"};
    }


    render() {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <h2>Error</h2>
                    <b>{this.state.message}</b>
                </Container>
            </div>
        );

    }
}