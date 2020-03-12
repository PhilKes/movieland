import React from 'react';
import {Container} from 'reactstrap';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner';
import MountedComponent from "./MountedComponent";

/** LoadingPage if Fetching data from Server*/
export default class LoadingPage extends MountedComponent {

    constructor(props) {
        super(props);
        this.state = {message: ""};
    }


    render() {
        return (
            <Container fluid className="whole-height">
                <div className="text-center align-center-vertical">
                    <h3>Loading</h3>
                    <Loader
                        type="Oval"
                        color="#AAA"
                        height={80}
                        width={80}
                    />
                </div>
            </Container>
        );

    }
}