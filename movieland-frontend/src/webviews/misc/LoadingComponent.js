import React from "react";
import MountedComponent from "./MountedComponent";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";

/** Render Loading/Error Page if loading/error occurred*/
class LoadingComponent extends MountedComponent {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, error: "", timedout: false}
    }

    setLoading(loading) {
        this.setState({isLoading: loading});
    }

    setTimedOut(timedout) {
        this.setState({timedout: timedout});
    }

    render() {
        const {isLoading, error, timedout} = this.state;
        if (timedout) {
            return <ErrorPage/>
        }
        if (isLoading) {
            return <LoadingPage/>;
        }
    }

}

export default LoadingComponent;