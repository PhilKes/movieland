import React from 'react'
import {Container} from "reactstrap";
import MountedComponent from "../misc/MountedComponent";

/** /logout page Component
 *  Logout */
class Logout extends MountedComponent {
    constructor(props) {
        super(props);
        this.state = {}
        document.title = "MovieLand Logout";
    }

    /** Immediately trigger Logout -> onAction prop in Layout*/
    componentDidMount() {
        super.componentDidMount();
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