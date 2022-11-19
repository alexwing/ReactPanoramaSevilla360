import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { getUrl, } from '../lib/Utils.js';
import './Info.css';
import {
    FacebookShareButton, FacebookIcon,
    EmailShareButton, EmailIcon,
    TwitterShareButton, TwitterIcon,
    LinkedinShareButton, LinkedinIcon,
    WhatsappShareButton, WhatsappIcon,
    TelegramShareButton, TelegramIcon
} from "react-share";


export default class Info extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ show: nextProps.show });
    }
    render() {
        const { InfoClose } = this.props;
        let handleClose = () => {
            this.setState({
                show: false
            });
            InfoClose();
        }
        let url = "http://" + getUrl() +"/sevilla360";
        let quote = "Conversión a foto 360 de las fotos tomadas por Jean Laurent, el fotógrafo francés afincado en España que tomó 7 instantáneas para formar una gran panorámica del río y su entorno."
        let hashtag = "education,history,Sevilla,panorama"
        let title = "Sevilla, cerca de 1870."


        return <div>
            <Modal
                show={this.state.show}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Sevilla, cerca de 1870.
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col lg={12} className="info">
                            <p>Conversión a foto 360 de las fotos tomadas por <a href="https://es.wikipedia.org/wiki/J._Laurent" rel="noreferrer nofollow" target="_BLANK">Jean Laurent</a>, el fotógrafo francés afincado en España que tomó 7 instantáneas para formar una gran panorámica del río y su entorno.</p>
                            <h2>Descripción</h2>
                            <p>A partir de fotos a gran resolución se han coloreado con diferentes algoritmos, luego estos se han mezclado y procesado, se ha recreado un cielo creíble y añadido un el falso relleno inferior para que estuviera más integrado.</p>
                            <h2>Proceso:</h2>
                            <ul>
                                <li>Colorear la foto (<a href="https://palette.fm/" rel="noreferrer nofollow"  target="_BLANK">palette.fm</a>)</li>
                                <li>Crear nubes</li>
                                <li>Crear falso relleno inferior</li>
                                <li>Limpieza de artefactos y ajuste del color RAW</li>
                                <li>Creación de la aplicación React usando el plugin <a href="https://github.com/farminf/pannellum-react" rel="noreferrer nofollow" target="_BLANK">Pannellum</a></li>
                            </ul>
                            Codigo fuente del proyecto en <a href="https://github.com/alexwing/ReactPanoramaSevilla360" rel="noreferrer nofollow" target="_BLANK">Github</a> 
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} className="share">
                            <h4>Compartelo</h4>
                            <EmailShareButton url={url} subject={title} body={quote} >
                                <EmailIcon size={48} round={true} />
                            </EmailShareButton>
                            <FacebookShareButton url={url} quote={quote} hashtag={hashtag}>
                                <FacebookIcon size={48} round={true} />
                            </FacebookShareButton>
                            <TwitterShareButton url={url} title={quote} hashtags={hashtag.split(',')}>
                                <TwitterIcon size={48} round={true} />
                            </TwitterShareButton>
                            <LinkedinShareButton url={url} title={title + " - " + this.props.name} summary={quote} source={title}>
                                <LinkedinIcon size={48} round={true} />
                            </LinkedinShareButton>
                            <WhatsappShareButton url={url} title={quote} >
                                <WhatsappIcon size={48} round={true} />
                            </WhatsappShareButton>
                            <TelegramShareButton url={url} title={quote} >
                                <TelegramIcon size={48} round={true} />
                            </TelegramShareButton>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Ok</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }

}