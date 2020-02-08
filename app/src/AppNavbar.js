import React, {Component, useState} from 'react';
import {
    Collapse, DropdownItem, DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import history from "./history";

/** Navigation Bar ,sticky on top*/
export default class AppNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: false, loggedIn: false};
        this.toggle = this.toggle.bind(this);

    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    setLoggedIn(loggedIn) {
        console.log("Navbar login:" + loggedIn)
        this.setState({loggedIn: loggedIn});
    }

    render() {

        let menuItems;
        if (this.state.loggedIn === true) {
            console.log("Logged in Navbar")
            menuItems = [
                <UncontrolledDropdown nav inNavbar key='/user' color="dark">
                    <DropdownToggle nav caret>
                        {this.props.currUser}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem key='/profile' onClick={() => history.push('/user/' + this.props.currUser)}>
                            Dashboard
                        </DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem key='/logout' onClick={() => history.push('/logout')}>
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            ];
        } else {
            console.log("Not logged in Navbar")
            menuItems = (<NavItem>
                <NavLink href="/login">Login</NavLink>
            </NavItem>);
        }
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
                        {menuItems}
                    </Nav>
                </Collapse>
            </Navbar>

        );

    }
}