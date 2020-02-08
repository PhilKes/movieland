import React, {Component} from 'react'
import {Route, Redirect} from 'react-router-dom'
import AuthenticationService from "./AuthenticationService";
import history from "../history";
class AuthenticatedRoute extends Component {

    componentDidMount() {
        if (!AuthenticationService.isUserLoggedIn()) {
            history.push({pathname: "/login", state: {previous: this.props.path}});
        }

    }

    render() {
        if (AuthenticationService.isUserLoggedIn()) {
            return <Route {...this.props} />
        } else {
            return (<div>Empty</div>);
        }
    }
}

export default AuthenticatedRoute