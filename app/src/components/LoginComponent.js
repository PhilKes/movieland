import React, {Component} from 'react'
import AuthService from "./AuthenticationService";
import history from '../history';
import AuthenticationService from "./AuthenticationService";
import AppNavbar from "../AppNavbar";
import {Button, Container, FormFeedback, FormGroup, Input, Label} from "reactstrap";

class LoginComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: 'admin',
            password: 'admin',
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

    loginClicked() {
        /* if(this.state.username==='admin' && this.state.password==='admin'){
             /!*AuthService.registerSuccessfulLogin(this.state.username,this.state.password)*!/
             this.props.history.push(`/movies`);
             this.setState({showSuccessMessage:true})
             this.setState({hasLoginFailed:false})
         }
         else {
             this.setState({showSuccessMessage:false})
             this.setState({hasLoginFailed:true})
         }*/
        AuthService
            .executeBasicAuthenticationService(this.state.username, this.state.password)
            .then(() => {
                console.log("Successfull login");
                AuthenticationService.registerSuccessfulLogin(this.state.username, this.state.password)
                history.push(`/movies`)
            }).catch(() => {
            this.setState({showSuccessMessage: false})
            this.setState({hasLoginFailed: true})
        })
    }

    render() {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <h2>Login</h2>
                    <div className="container">
                        {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
                        {this.state.showSuccessMessage && <div>Login Sucessful</div>}
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
            </div>
        )
    }
}

export default LoginComponent