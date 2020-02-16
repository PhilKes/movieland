import React, {Component} from 'react'
import {Route, Redirect} from 'react-router-dom'
import AuthenticationService from "../../service/AuthenticationService";
import history from "../../history";

/** Redirects to login if not authenticated*/
class AuthenticatedRoute extends Component {
    constructor(props) {
        super(props);
        this.checkAdmin = props.admin;
    }

    componentDidMount() {
        if (!AuthenticationService.isUserLoggedIn()) {
            history.push({
                pathname: "/login", state: {
                    previous: this.props.path,
                    msg: "Must be logged in to access"
                }
            });
        } else if (this.checkAdmin && !AuthenticationService.isAdmin()) {
            history.push({
                pathname: "/login", state: {
                    previous: this.props.path,
                    msg: "Must be logged in as Admin to access!"
                }
            });
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