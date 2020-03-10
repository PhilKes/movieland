import React from 'react';
import {
    Button,
    ListGroup,
    ListGroupItem,
    ButtonGroup, FormGroup,
} from 'reactstrap';
import Moment from "moment";
import {Link} from "react-router-dom";
import {faSearch, faClock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {Col, Grid, Row, Modal, ControlLabel, FormControl} from "react-bootstrap";
import FormInputs from "../../components/FormInputs/FormInputs";
import Input from "reactstrap/lib/Input";
import Loader from "react-loader-spinner";
import CustomButton from "../../components/CustomButton/CustomButton";

/** Modal for adding a new User*/
export default class AddUserModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {modal: false, name: '', movies: [], selMovId: ''};

        this.toggle = this.toggle.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: false});
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    /** Send movId + time back to page*/
    handleSubmit(ev) {
        ev.preventDefault();

        const data = new FormData(ev.target);
        let pwd = data.get('password'), user = data.get('username'), name = data.get('name'), role = data.get('role');
        if (pwd.length < 5) {
            this.props.showNotification("Password at least 5 characters", "error", "bc");
            return;
        }
        if (user.length < 4 || name.length < 4) {
            this.props.showNotification("Username and Full Name at least 4 characters", "error", "bc");
            return;
        }
        if (pwd !== data.get('repeat')) {
            console.log("Repaet not matching")
            this.props.showNotification("Passwords not matching! ", "error", "bc");
            return;
        }
        this.setState({isRegistering: true});
        axios.post(`/api/auth/admin/signup`, {
                name: name, username: user, email: user + "@mail.com", password: pwd, roleName: role
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this.setState({isRegistering: false});
                this.props.showNotification("Registration successful ", "success", "bc");
                console.log(response);
                this.toggle();
            })
            .catch(err => {
                this.setState({isRegistering: false});
                console.log(err.response.data.message);
                this.props.showNotification("Registration failed: "
                    + (err.response.data.message ? err.response.data.message : "Server is unreachable"), "error", "bc");
                this.toggle();
            });
        //this.props.onSubmit(show);
    }

    selectMov(movId) {
        this.setState({selMovId: movId});
    }

    /** Render TimePicker + MovieList*/
    render() {
        const {movies, name, selMovId} = this.state;

        return (
            <div className="content">
                <Button color="success" className="margin-bottom" onClick={this.toggle}>AddUser</Button>
                <Modal show={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header>Add a new User</Modal.Header>
                        <Modal.Body>
                            <Grid fluid>
                                <Row>
                                    <Col md={8}>
                                        <div className="form-group">
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    label: "Full Name",
                                                    name: "name",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Full Name"
                                                }]}
                                            />
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    label: "Username",
                                                    name: "username",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Username"
                                                }]}
                                            />
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    label: "Password",
                                                    name: "password",
                                                    type: "password",
                                                    bsClass: "form-control",
                                                    placeholder: "Password"
                                                }]}
                                            />
                                            <FormInputs
                                                ncols={["col-md-8"]}
                                                properties={[{
                                                    label: "Repeat",
                                                    name: "repeat",
                                                    type: "password",
                                                    bsClass: "form-control",
                                                    placeholder: "Repeat"
                                                }]}
                                            />
                                            <FormGroup controlId="exampleForm.ControlSelect1">
                                                <ControlLabel>Role</ControlLabel>
                                                <Input type="select" name="role">
                                                    {this.props.roleTypes.map(role =>
                                                        <option>{role.value}</option>
                                                    )}
                                                </Input>
                                            </FormGroup>
                                        </div>
                                    </Col>
                                </Row>
                            </Grid>
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" color="success" className="btn btn-primary"
                                   disabled={this.state.isRegistering}
                                   value={"Add"}
                            >

                            </input>
                            <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>

        );
    }


}
