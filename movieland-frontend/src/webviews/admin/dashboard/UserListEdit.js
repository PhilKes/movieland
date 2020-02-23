import React, {Component, useState} from 'react';
import {Button, ButtonGroup, Table, Input, Alert} from 'reactstrap';
import MovieModal from "../../modal/MovieModal";
import Moment from 'moment';
import axios from "axios";
import ErrorPage from "../../misc/ErrorPage";
import LoadingPage from "../../misc/LoadingPage";
import {Col, Grid, Row} from "react-bootstrap";

import ReactDataGrid from 'react-data-grid';


/** /dashboard/users page Component*/
class UserListEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {movies: [], isLoading: true, error: "", timedout: false};
        this.searchQuery = "";
    }

    /** Initial load all movies*/
    componentDidMount() {
        document.title = "Manage Movies";
        this.setState({isLoading: true});

        axios.get('/api/movies')
            .then(res => res.data)
            .then(data => this.setState({movies: data, isLoading: false}))
            .catch(err => this.setState({timedout: true}))
        ;
    }

    /** Submit search if pressed enter in searchquery field*/
    handleKeyPress(ev) {
        if (ev.charCode == 13) { //Enter pressed?
            console.log("Search: " + this.searchQuery.value);
            axios.get('/api/movies?name=' + this.searchQuery.value)
                .then(resp => this.setState({movies: resp.data}));
        }
    }

    /** Render Movie List with Actions*/
    render() {
        const {movies, isLoading, error, timedout} = this.state;
        if (timedout) {
            return <ErrorPage/>
        }
        if (isLoading) {
            return <LoadingPage/>;
        }
        const columns = [
            {key: 'id', name: 'ID'},
            {key: 'title', name: 'Title'},
            {key: 'count', name: 'Count'}];

        const rows = [{id: 0, title: 'row1', count: 20}, {id: 1, title: 'row1', count: 40}, {
            id: 2,
            title: 'row1',
            count: 60
        }];

        return (
            <ReactDataGrid
                columns={columns}
                rowGetter={i => rows[i]}
                rowsCount={3}
                minHeight={150}/>
        );
    }
}

export default UserListEdit;