import React, {Component} from 'react'
import AuthService from "./AuthenticationService";
import history from '../history';
import AuthenticationService from "./AuthenticationService";
import AppNavbar from "../AppNavbar";
import {
    Alert,
    Button,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label, NavItem, NavLink
} from "reactstrap";
import {faUserAlt, faUser, faLock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";

/** Register page*/
class RegisterComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            err: 0, // 0=no error, 1= password too short, 2= repeat doesnt match, 3= username taken, 4= missing fields
            showSuccessMessage: false
        }
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    registerClicked(ev) {
        ev.preventDefault();
        const data = new FormData(ev.target);
        let pwd = data.get('password'), user = data.get('username'), name = data.get('name');
        if (pwd.length < 5) {
            this.setState({err: 1, showSuccessMessage: false});
            return;
        }
        if (user.length < 4 || name.length < 4) {
            this.setState({err: 4, showSuccessMessage: false});
            return;
        }
        if (pwd !== data.get('repeat')) {
            console.log("Repaet not matching")
            this.setState({err: 2, showSuccessMessage: false});
            return;
        }
        axios.post(`/api/auth/signup`, {
                name: name, username: user, email: user + "@mail.com", password: pwd
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response);
                this.setState({err: 0, showSuccessMessage: true});
            })
            .catch(err => {
                console.log(err.response.data.message);
                this.setState({err: 3, showSuccessMessage: false});
            });
    }

    render() {
        let {err} = this.state;
        let usernameErr = err === 3 ? (<div>Username already taken</div>) : (<div>At least 4 Characters</div>);
        return (
                <Container fluid>
                    <h2>Register</h2>
                    <div className="container">
                        <Form onSubmit={this.registerClicked.bind(this)}>
                            <FormGroup>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><FontAwesomeIcon icon={faUserAlt}/></InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" name="name" placeholder="Full Name"
                                           className="col-md-4" required invalid={err === 4}/>
                                    <FormFeedback invalid={1}>At least 4 Characters</FormFeedback>
                                </InputGroup><br/>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><FontAwesomeIcon icon={faUser}/></InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" name="username" placeholder="Username"
                                           className="col-md-4" invalid={err === 3 || err === 4} required/>
                                    <FormFeedback invalid={1}>{usernameErr}</FormFeedback>
                                </InputGroup><br/>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><FontAwesomeIcon icon={faLock}/></InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="password" name="password" placeholder="Password"
                                           className="col-md-4" invalid={err === 1} required/>
                                    <FormFeedback invalid={1}>Password too short</FormFeedback>
                                </InputGroup><br/>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><FontAwesomeIcon icon={faLock}/></InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="password" name="repeat" placeholder="Repeat"
                                           className="col-md-4" invalid={err === 2} required/>
                                    <FormFeedback invalid={1}>Passwords do not match</FormFeedback>
                                </InputGroup><br/>
                                {this.state.showSuccessMessage && <Alert color="success" className="col-md-4">
                                    Registration successfull! <br/>
                                    <a href="/login">Log in</a> to your new Account
                                </Alert>}
                                <Button color="primary" onClick={this.loginClicked}>Register</Button>
                            </FormGroup>

                        </Form>
                    </div>
                </Container>
        )
    }
}

export default RegisterComponent