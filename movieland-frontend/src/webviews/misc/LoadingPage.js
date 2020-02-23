import React, {Component, useState} from 'react';
import {Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner';
/** Navigation Bar ,sticky on top*/
export default class LoadingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {message: ""};
        //TODO SHOW PROGRESS?
    }


    render() {
        return (
            <Container fluid className="whole-height">
                <div className="text-center align-center-vertical">
                    <h3>Loading</h3>
                    <Loader
                        type="Oval"
                        color="#AAA"
                        height={80}
                        width={80}

                    />
                </div>
            </Container>
        );

    }
}