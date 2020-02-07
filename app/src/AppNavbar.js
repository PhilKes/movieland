import React, {Component, useState} from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

/** Navigation Bar ,sticky on top*/
export default class AppNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (

            <Navbar color="dark" dark expand="md" fixed="top">
                <NavbarBrand href="/">MovieLand</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="/movies">Movies</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/shows">Shows</NavLink>
                        </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/PhilKes" target="_blank">GitHub</NavLink>
                            </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>

        );

    }
}