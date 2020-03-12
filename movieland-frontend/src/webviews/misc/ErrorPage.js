import React from 'react';
import {Col, Grid, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSync} from "@fortawesome/free-solid-svg-icons";
import MountedComponent from "./MountedComponent";

/** Error Page is Server Error occurred*/
export default class ErrorPage extends MountedComponent {

    constructor(props) {
        super(props);
        this.state = {message: "Server is unreachable at the moment"};
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col>
                            <div className="text-center align-center-vertical whole-height">
                                <h2>Error</h2>
                                <b>{this.state.message}</b><br/><br/><br/>
                                <a onClick={() => window.location.reload()} className="click-icon">
                                    <FontAwesomeIcon icon={faSync} size="7x"/>
                                </a><br/><br/><br/>
                                Click to reload
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );

    }
}