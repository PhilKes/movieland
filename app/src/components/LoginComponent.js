import React, {Component} from 'react'
import AuthService from "./AuthenticationService";
import history from '../history';
import AuthenticationService from "./AuthenticationService";
import AppNavbar from "../AppNavbar";
import {Alert, Button, Container, FormFeedback, FormGroup, Input, Label} from "reactstrap";
import App from "../App";

/** Login Page for JWT Authentication generation*/
class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'admin',
            password: 'admin123',
            hasLoginFailed: false,
            showSuccessMessage: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.loginClicked = this.loginClicked.bind(this)
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    /** Execute Jwt Authentication and forward to last page if successful*/
    loginClicked() {
        AuthService
            .executeJwtAuthenticationService(this.state.username, this.state.password)
            .then((resp) => {
                console.log("Successfull login");
                console.log("Token: " + resp.data.accessToken);
                /*AuthenticationService.setUserName(this.state.username);*/
                AuthenticationService.registerJwtSuccessfulLogin(resp.data.accessToken);
                this.props.onLogin(true, this.state.username);
                this.setState({showSuccessMessage: true, hasLoginFailed: false});
                if (window.location.pathname !== this.props.location.state.previous) {
                    //TODO
                    history.push(this.props.location.state.previous);
                }

            }).catch(() => {
            this.setState({showSuccessMessage: false})
            this.setState({hasLoginFailed: true})
        })
    }

    render() {
        return (
            <Container fluid>
                <h2>Login</h2>
                <div className="container">
                    {this.state.hasLoginFailed && <Alert color="warning">Invalid Credentials</Alert>}
                    {this.state.showSuccessMessage && <Alert color="success">Login Successful</Alert>}
                    <FormGroup>
                        <Label>Username</Label>
                        <Input type="text" name="username"
                               className="col-md-4"
                               value={this.state.username}
                               onChange={this.handleChange}/>
                        <Label>Password</Label>
                        <Input type="password" name="password"
                               className="col-md-4"
                               value={this.state.password}
                               onChange={this.handleChange}/><br/>
                        {/* <FormFeedback invalid>Invalid Credentials!</FormFeedback>*/}
                        <Button className="btn btn-success" onClick={this.loginClicked}>Login</Button>
                    </FormGroup>
                </div>
            </Container>
        )
    }
}

export default LoginComponent