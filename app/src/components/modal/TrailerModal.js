import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ListGroupItem,
    ListGroup,
    Input,
    Container, Form, ButtonGroup
} from 'reactstrap';
import axios from "axios";
import YouTube from "react-youtube";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faVideo} from "@fortawesome/free-solid-svg-icons";

/** Modal for watching Trailer from youtube*/
export default class TrailerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {modal: false, movId: props.movId, ytId: -1, isLoading: true};
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        axios.get('/api/movie/trailer/' + this.state.movId)
            .then(res => res.data)
            .then(trailerId => {
                console.log("MovId: " + this.state.movId)
                console.log("Youtube: " + trailerId)
                this.setState({ytId: trailerId, isLoading: false})
            })
            .catch(err => {
                this.setState({isLoading: true})
            });
    }

    toggle() {

        this.setState({
            modal: !this.state.modal,
        });
    }


    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };
        return (
            <div>
                <Button color="light" style={{flex: 1}} onClick={this.toggle}>
                    <FontAwesomeIcon icon={faVideo}/>
                </Button>
                <Modal isOpen={this.state.modal}>
                    <YouTube
                        videoId={this.state.ytId}
                        opts={opts}
                        onEnd={this.toggle}
                    />
                </Modal>
            </div>

        );
    }
}
