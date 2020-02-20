import React from 'react';
import {
    Button,
    ListGroupItem,
    ListGroup,
    Input,
    Container, Form, ButtonGroup
} from 'reactstrap';
import axios from "axios";
import YouTube from "react-youtube";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faVideo} from "@fortawesome/free-solid-svg-icons";
import {Modal} from "react-bootstrap";

/** Modal for watching Trailer from youtube*/
export default class TrailerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {modal: false, movId: props.movId, ytId: -1, isLoading: true};
        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
    }

    handleClick = (e)=>{
        if(this.wrapperRef && !this.wrapperRef.contains(e.target)){
            this.toggle();
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    componentDidMount() {
        axios.get('/api/movie/trailer/' + this.state.movId)
            .then(res => res.data)
            .then(trailerId => {
                this.setState({ytId: trailerId, isLoading: false})
            })
            .catch(err => {
                this.setState({isLoading: true})
            });
    }

    toggle() {
        if(!this.state.modal){
            document.addEventListener('mousedown',this.handleClick,false);
        }else{
            document.removeEventListener('mousedown',this.handleClick,false);
        }
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
            <div ref={this.setWrapperRef}>
                <Button color="light" style={{flex: 1}} onClick={this.toggle}>
                    <FontAwesomeIcon icon={faVideo}/>
                </Button>
                <Modal show={this.state.modal} className="modal-trailer"  onRequestClose={this.toggle}>
                    <Modal.Body>
                        <YouTube
                            videoId={this.state.ytId+""}
                            opts={opts}
                            onEnd={this.toggle}
                        />
                    </Modal.Body>
                </Modal>
            </div>

        );
    }
}
