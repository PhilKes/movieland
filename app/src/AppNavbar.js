import React, {Component, useState} from 'react';
import {
    Collapse, DropdownItem, DropdownMenu,
    DropdownToggle, Label,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import history from "./history";
import AuthenticationService from "./components/AuthenticationService";
import {
    faUser,
    faSignInAlt,
    faSignOutAlt,
    faAddressCard,
    faTicketAlt,
    faUserPlus,
    faFilm,
    faVideo,
    faCode, faCodeBranch
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

/** Navigation Bar ,sticky on top*/
class AppNavbar extends Component {

    constructor(props) {
        super(props);
        console.log("constructor")

        this.state = {isOpen: false, loggedIn: AuthenticationService.isUserLoggedIn(), user: this.props.user};
        console.log("Constr. Logged in : " + this.props.user)
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.state = {loggedIn: AuthenticationService.isUserLoggedIn(), user: this.props.user};
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    setLoggedIn(loggedIn, username) {
        console.log("Logged in: " + username)
        this.setState({loggedIn: loggedIn, user: username});
    }

    onLogout() {
        AuthenticationService.logoutUser();
        window.location.reload();
    }

    render() {

        let menuItems;
        /** Admin menu */
        if (this.state.loggedIn && AuthenticationService.isAdmin()) {
            menuItems = [
                <UncontrolledDropdown nav inNavbar key='user' color="dark">
                    <DropdownToggle nav caret>
                        <FontAwesomeIcon icon={faUser}/>{" " + this.state.user}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem key='profile' onClick={() => history.push('/user/me')}>
                            <FontAwesomeIcon icon={faAddressCard}/> Dashboard
                        </DropdownItem>
                        <DropdownItem key='reservations'
                                      onClick={() => history.push('/reservations/me')}>
                            <FontAwesomeIcon icon={faTicketAlt}/> Reservations
                        </DropdownItem>
                        <DropdownItem key='shows'
                                      onClick={() => history.push('/shows')}>
                            <FontAwesomeIcon icon={faVideo}/> Manage Shows
                        </DropdownItem>
                        <DropdownItem key='movies'
                                      onClick={() => history.push('/movies/edit')}>
                            <FontAwesomeIcon icon={faFilm}/> Manage Movies
                        </DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem key='logout' onClick={this.onLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt}/> Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            ];
        }
        /** User menu */
        else if (this.state.loggedIn) {
            menuItems = [
                <UncontrolledDropdown nav inNavbar key='user' color="dark">
                    <DropdownToggle nav caret>
                        <FontAwesomeIcon icon={faUser} size="lg"/> {this.state.user}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem key='profile' onClick={() => history.push('/user/me')}>
                            <FontAwesomeIcon icon={faAddressCard}/> Dashboard
                        </DropdownItem>
                        <DropdownItem key='reservations'
                                      onClick={() => history.push('/reservations/me')}>
                            <FontAwesomeIcon icon={faTicketAlt}/> Reservations
                        </DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem key='logout' onClick={this.onLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt}/> Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            ];
        }
        /** Offline visitor menu */
        else {
            menuItems = [
                <Nav key="notloggedin">
                    <NavItem key="register">
                        <NavLink href="/register"> <FontAwesomeIcon icon={faUserPlus}/> Register</NavLink>
                    </NavItem>
                    <NavItem key="login">
                        <NavLink href="/login"> <FontAwesomeIcon icon={faSignInAlt}/> Login</NavLink>
                    </NavItem>
                </Nav>
            ];
        }
        return (
            <Navbar color="dark" dark expand="md" fixed="top">
                <NavbarBrand href="/">MovieLand</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="/movies"><FontAwesomeIcon icon={faFilm} size="lg"/> Movies</NavLink>
                        </NavItem>
                        {/*<NavItem>
                            <NavLink href="/shows">Shows</NavLink>
                        </NavItem>*/}
                        <NavItem>
                            <NavLink href="https://github.com/PhilKes" target="_blank">
                                <FontAwesomeIcon size="lg" icon={faCodeBranch}/> GitHub
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <Nav className="ml-auto" navbar>
                        {menuItems}
                    </Nav>
                </Collapse>
            </Navbar>

        );

    }
}

export default AppNavbar;