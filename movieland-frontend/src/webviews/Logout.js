import React, {Component} from 'react'
import {Container} from "reactstrap";

/** /logout page Component
 *  Logout */
class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        document.title = "MovieLand Logout";
    }

    /** Immediately trigger Logout -> onAction prop in Layout*/
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