import {Component} from "react";

/** Prohibit setState if component is not mounted*/
class MountedComponent extends Component {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setState(state, callback) {
        if (this._isMounted)
            super.setState(state, callback);
        else
            console.log("Blocking setState");
    }
}

export default MountedComponent;