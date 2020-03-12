import React from 'react'
import AuthService from "../../service/AuthenticationService";
import AuthenticationService from "../../service/AuthenticationService";
import history from '../../history';
import {Col, Row} from "reactstrap";
import CustomButton from "../../components/CustomButton/CustomButton";
import {Grid} from "react-bootstrap";
import Card from "../../components/Card/Card";
import FormInputs from "../../components/FormInputs/FormInputs";
import Loader from "react-loader-spinner";
import MountedComponent from "../misc/MountedComponent";

/** /login page Component
 *  Logout Page for JWT Authentication*/
class Login extends MountedComponent {
    constructor(props) {
        super(props);
        let msg = null;
        if (this.props.location.state != null) {
            msg = this.props.location.state.msg;
        }
        this.state = {
            hasLoginFailed: false,
            msg: msg,
            loggingIn: false
        };
        this.loginClicked = this.loginClicked.bind(this);

        document.title = "MovieLand Logout";
    }

    componentDidMount() {
        super.componentDidMount();
    }


    /** Execute Jwt Authentication and forward to last page if successful*/
    loginClicked(ev) {
        ev.preventDefault();
        this.setState({loggingIn: true});
        const data = new FormData(ev.target);
        let user=data.get('username');
        let pwd=data.get('password');
        AuthService
            .executeJwtAuthenticationService(user, pwd)
            .then((resp) => {
                this.setState({loggingIn: false});
                console.log("Successfull login");
                console.log("Token: " + resp.data.accessToken);
                this.props.showNotification("Login successfull","success","bc");
                AuthenticationService.setUserName(user);
                AuthenticationService.registerJwtSuccessfulLogin(resp.data.accessToken);
                this.props.onAction("Login");
                if (this.props.location.state == null || this.props.location.state.previous === "/login") {
                    console.log("to: /")
                    history.push("/");
                } else {
                    console.log("to: " + this.props.location.state.previous)
                    history.push(this.props.location.state.previous);
                }

            })
            .catch((err) => {
                this.setState({loggingIn: false});
                console.log(err)
                this.props.showNotification("Login failed: "
                    + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
        })
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <div className="whole-height">
                                <Card title="Login"
                                content={
                                    <form onSubmit={this.loginClicked.bind(this)}>
                                        <FormInputs
                                            ncols={["col-md-8"]}
                                            properties={[{
                                                label: "Username",
                                                name: "username",
                                                type: "text",
                                                bsClass: "form-control",
                                                placeholder: "Username",
                                                defaultValue: "admin"
                                            }]}
                                        />
                                        <FormInputs
                                            ncols={["col-md-8"]}
                                            properties={[{
                                                label: "Password",
                                                name: "password",
                                                type: "password",
                                                bsClass: "form-control",
                                                placeholder: "Password",
                                                defaultValue: "admin123"
                                            }]}
                                        />
                                        <CustomButton bsStyle="primary" pullLeft type="submit">
                                            {this.state.loggingIn && (<Loader
                                                type="Oval"
                                                color="#FFF"
                                                height={16}
                                                width={16}
                                            />) || "Login"}
                                        </CustomButton>
                                    </form>
                                }
                            />
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default Login