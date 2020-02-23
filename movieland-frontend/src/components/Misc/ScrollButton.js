import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faClock} from "@fortawesome/free-solid-svg-icons";
import InputGroupText from "reactstrap/lib/InputGroupText";
import {Button} from "react-bootstrap";

class ScrollButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            intervalId: 0
        };
    }

    scrollStep() {
        window.scrollTo(0, 0);
        console.log("Offset: ")
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }

        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    }

    scrollToTop() {
        this.props.onScroll();
        /*let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
        this.setState({ intervalId: intervalId });*/
    }

    render() {
        return <Button title='Back to top' className='scroll'
                       onClick={() => {
                           this.scrollToTop();
                       }}>
            <FontAwesomeIcon icon={faArrowUp} size="2x" className="arrow-up"/>
        </Button>;
    }
}

export default ScrollButton;