import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import {Router, Redirect, Route, Switch} from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieShowList from './components/MovieShowList';
import LoginComponent from "./components/LoginComponent";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import history from './history';

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path='/' exact={true} >
                        <Redirect to='/movies' />
                    </Route>
                    {/*<Route path='/movies' exact={true} component={MovieList}/>**/}
                    <AuthenticatedRoute path='/shows' exact={true} component={MovieShowList}/>
                    <AuthenticatedRoute path="/movies" exact component={MovieList}/>
                    <Route path='/login' exact={true} component={LoginComponent}/>
                </Switch>
            </Router>
        )
    }
}

export default App;