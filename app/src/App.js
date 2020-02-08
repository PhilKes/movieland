import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import {Router, Redirect, Route, Switch, withRouter} from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieShowList from './components/MovieShowList';
import LoginComponent from "./components/LoginComponent";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import history from './history';
import RegisterComponent from "./components/RegisterComponent";
import AppNavbar from "./AppNavbar";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoggedIn: false, currUser: "admin"};
        this.setUserLogin = this.setUserLogin.bind(this);
        //Ref to call methods on navBar from App
        this.navBar = React.createRef();
    }

    setUserLogin(loggedIn, currUser) {
        this.navBar.current.setLoggedIn(loggedIn, currUser);
        this.setState({isLoggedIn: loggedIn, currUser: currUser});
    }

    render() {
        return (
            <div>
                <AppNavbar ref={this.navBar} user={this.state.currUser} loggedIn={this.state.isLoggedIn}/>
                <Switch>
                    <Route path='/' exact={true} >
                        <Redirect to='/movies' />
                    </Route>
                    {/*<Route path='/movies' exact={true} component={MovieList}/>**/}
                    <AuthenticatedRoute path='/shows' exact={true} component={MovieShowList}/>
                    <AuthenticatedRoute path="/movies" exact component={MovieList}/>
                    <Route path='/login'
                           render={(props) => <LoginComponent onLogin={this.setUserLogin}
                                                              {...props} />}
                    />

                    <Route path='/register' exact={true} component={RegisterComponent}/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(App);