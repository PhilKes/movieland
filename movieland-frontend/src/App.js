import React, {Component} from 'react';
import './assets/sass/lbd/_App.scss';
import {Router, Redirect, Route, Switch, withRouter} from 'react-router-dom';
import AuthenticationService from "./service/AuthenticationService";
import Layout from "./layouts/Layout";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoggedIn: false, currUser: AuthenticationService.getUserName()};
        this.setUserLogin = this.setUserLogin.bind(this);
        //Ref to call methods on navBar from App
        this.navBar = React.createRef();
    }

    /** Notify navbar if loggedIn user changed*/
    setUserLogin(loggedIn, currUser) {
        this.navBar.current.setLoggedIn(loggedIn, currUser);
        //this.setState({isLoggedIn: loggedIn, currUser: currUser});
    }

    render() {
        return (
            <Switch>
                <Route path='/' exact={true}>
                    <Redirect to='/movies'/>
                </Route>
                <Route path="/*" render={props => <Layout {...props} ref={this.navBar} />} />
            </Switch>
        )
    }
}

export default withRouter(App);