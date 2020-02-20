import React, {Component} from 'react'
import AuthService from "../service/AuthenticationService";
import history from '../history';
import AuthenticationService from "../service/AuthenticationService";
import {Alert, Button, Container, FormFeedback, FormGroup, Input, Label} from "reactstrap";
import App from "../App";

/** /logout page Component
 *  Logout */
class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        document.title = "MovieLand Logout";
    }
    componentDidMount() {
        this.props.onAction("Logout");
    }


    render() {
        return (
            <div className="content">
                <Container fluid>
                    <h2>Logging out...</h2>
                    <div className="container">

                    </div>
                </Container>
            </div>
        )
    }
}

export default Logout