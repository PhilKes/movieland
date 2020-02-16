import React, {Component, useState} from 'react';
import {Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import AppNavbar from "../../AppNavbar";

/** Navigation Bar ,sticky on top*/
export default class LoadingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {message: ""};
        //TODO SHOW PROGRESS?
    }


    render() {
        return (
                <Container fluid>
                    <h4>Loading...</h4>
                </Container>
        );

    }
}