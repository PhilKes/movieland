import React, {Component, useState} from 'react';
import {Button, ButtonGroup, Table, Input, Alert} from 'reactstrap';
import MovieModal from "../../modal/MovieModal";
import Moment from 'moment';
import axios from "axios";
import ErrorPage from "../../misc/ErrorPage";
import LoadingPage from "../../misc/LoadingPage";
import {Col, Grid, Row} from "react-bootstrap";
import ReactDataGrid from 'react-data-grid';
import {Editors} from "react-data-grid-addons";

import ReactDOM from "react-dom";

/** /dashboard/users page Component*/


const {DropDownEditor} = Editors;
const roleTypes = [
    {id: "ROLE_ADMIN", value: "ROLE_ADMIN"},
    {id: "ROLE_USER", value: "ROLE_USER"},
];
const RoleEditor = <DropDownEditor options={roleTypes}/>;

class UserListEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {movies: [], isLoading: true, error: "", timedout: false};
        this.searchQuery = "";
    }

    onGridRowsUpdated = ({fromRow, toRow, updated}) => {
        this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = {...rows[i], ...updated};
            }
            console.log("updated")
            console.log(rows[fromRow])
            this.submitUpdateUser(rows[fromRow], updated);
            return {rows};
        });
    };


    submitUpdateUser(user, updated) {
        console.log("Updating:")
        console.log(user)
        console.log("With:")
        console.log(updated)

        const rows = [
            {
                id: 3, name: 'Phil Key', username: "admin", email: "admin@mail.com",
                password: "$2a$10$LHw9UMpmij5QIHoNFckR6utW1HX4EooTugBAcJ8jYqp6Ymv/FujJG",
                roles: "ROLE_ADMIN",
            },
        ];

        if (updated.roles) {
            if (updated.roles === "ROLE_ADMIN")
                updated.roles = [
                    {
                        "id": 1,
                        "name": "ROLE_USER"
                    },
                    {
                        "id": 2,
                        "name": "ROLE_ADMIN"
                    }
                ]
            else if (updated.roles === "ROLE_USER") {
                updated.roles = [{
                    "id": 1,
                    "name": "ROLE_USER"
                }];
            }
        }
        axios.put('/api/user/' + user.id, updated)
            .then(resp => console.log(resp.data))
            .catch(err => console.log("Update user " + user.id + " failed"))

    }

    /** Initial load all movies*/
    componentDidMount() {
        document.title = "Manage Movies";
        this.setState({isLoading: true});

        axios.get('/api/user/all')
            .then(res => res.data)
            .then(data => {
                console.log(data)
                let rows = data.map(user => {
                    let highestRole;
                    user.roles.forEach(role => {
                        if (!highestRole || (highestRole.name === "ROLE_USER" && role.name === "ROLE_ADMIN"))
                            highestRole = role.name;
                    });
                    user.roles = highestRole;
                    return user;
                });
                console.log("Rows:")
                console.log(rows)
                this.setState({rows: rows, isLoading: false})
            })
            .catch(err => this.setState({timedout: true}))
        ;

        const columns = [
            {key: 'id', name: 'ID', width: 40, editable: false},
            {key: 'name', name: 'Full Name', editable: true},
            {key: 'username', name: 'Username', editable: true},
            {key: 'email', name: 'Email', editable: true},
            //TODO {key: 'password', name: 'Password Encoded', editable: true},
            {key: 'roles', name: 'Role', editable: true, editor: RoleEditor},
        ];

        this.setState({columns: columns});
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
        const {isLoading, timedout, rows, columns} = this.state;
        if (timedout) {
            return <ErrorPage/>
        }
        if (isLoading) {
            return <LoadingPage/>;
        }

        return (
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <ReactDataGrid
                            className="whole-height"
                            columns={columns}
                            rowGetter={i => rows[i]}
                            rowsCount={rows.length}
                            rowHeight={70}
                            minHeight={(rows.length + 1) * 70 + 2}
                            enableCellSelect={true}
                            onGridRowsUpdated={this.onGridRowsUpdated}
                        />
                    </Col>
                </Row>
                <Row className="whole-height">
                    <Col md={12}>
                    </Col>
                </Row>
            </Grid>
        );
    }


}

export default UserListEdit;