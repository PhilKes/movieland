import React, {Component} from 'react';
import './App.css';
import {Router, Redirect, Route, Switch, withRouter} from 'react-router-dom';
import MovieListEdit from './components/MovieListEdit';
import MovieShowList from './components/MovieShowList';
import Login from "./components/Login";
import AuthenticatedRoute from "./components/misc/AuthenticatedRoute";
import history from './history';
import Register from "./components/Register";
import AppNavbar from "./AppNavbar";
import MovieList from "./components/MovieList";
import MovieShow from "./components/MovieShow";
import Dashboard from "./components/Dashboard";
import AuthenticationService from "./service/AuthenticationService";

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
        this.setState({isLoggedIn: loggedIn, currUser: currUser});
    }

    render() {
        return (
            <div>
                <AppNavbar ref={this.navBar} user={this.state.currUser} loggedIn={this.state.isLoggedIn}/>
                <Switch>
                    <Route path='/' exact={true}>
                        <Redirect to='/movies'/>
                    </Route>
                    {/*<Route path='/movies' exact={true} component={MovieList}/>**/}
                    <AuthenticatedRoute admin={true} path='/shows' exact={true} component={MovieShowList}/>
                    <AuthenticatedRoute admin={true} path="/movies/edit" exact component={MovieListEdit}/>

                    <AuthenticatedRoute
                        path="/show/:showId" exact component={MovieShow}/>

                    <AuthenticatedRoute path="/user/me" exact component={Dashboard}/>

                    <Route path='/movies' exact component={MovieList}/>
                    <Route path='/login'
                           render={(props) => <Login onLogin={this.setUserLogin}
                                                     {...props} />}
                    />

                    <Route path='/register' exact={true} component={Register}/>
                </Switch>
                <footer className="footer">
                    <div className="py-2">All Movie details and images taken from{" "}
                        <a href="https://www.themoviedb.org/" target="_blank">TMDB</a>
                    </div>
                </footer>
            </div>
        )
    }
}

export default withRouter(App);