import React, {Component} from 'react'
import {Route, Redirect} from 'react-router-dom'
import AuthenticationService from "../../service/AuthenticationService";
import history from "../../history";

/** Redirects to login if not authenticated*/
class AuthenticatedRoute extends Route {


    /**Immediately redirect to login page if not logged in or Layout required*/
    componentWillMount() {
        console.log("Cancelling Axios");
        AuthenticationService.cancelAllAxios();
        /* if (!AuthenticationService.isUserLoggedIn()) {
             console.log("path: " + this.props.computedMatch.params.showId);
             let path = this.props.path;
             if (Object.keys(this.props.computedMatch.params).length > 0) {
                 path = this.parseMatchParams(path, this.props.computedMatch.params)
             }
             history.push({
                 pathname: "/login", state: {
                     previous: path,
                     msg: "Must be logged in to access"
                 }
             });
         } else if (this.checkAdmin && !AuthenticationService.isAdmin()) {
             history.push({
                 pathname: "/login", state: {
                     previous: this.props.path,
                     msg: "Must be logged in as Layout to access!"
                 }
             });
         }*/
    }

    /** Replace path match params with values (e.g showId)*/
    parseMatchParams(path, params) {
        let parsed = path;
        Object.keys(params).forEach(key => {
            console.log("Replace: :" + key + " with: " + params[key]);
            parsed = parsed.replace(":" + key, params[key]);
        });
        console.log("Parsed: " + parsed);
        return parsed;
    }

    render() {
        return <Route {...this.props} />
    }

}

export default AuthenticatedRoute