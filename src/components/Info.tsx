import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Row, Col, Figure } from "react-bootstrap";
import "../i18n/config";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

import { getLang, getUrl } from "../lib/Utils";
import { Check, Heart, ShieldShaded, Github } from "react-bootstrap-icons";
import "./Info.css";
import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import { PuzzleService } from "../services/puzzleService";
import Privacy from "./Privacy";
//to function hooks

interface InfoProps {
  show: boolean;
  InfoClose: () => void;
}

function Info({ show = false, InfoClose }: InfoProps): JSX.Element | null {
  const [showIn, setShowIn] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const { t } = useTranslation();
  const [showInPrivacy, setShowInPrivacy] = useState(false);

  useEffect(() => {
    setShowIn(show);
  }, [show]);

  function handleClose() {
    InfoClose();
  }

  useEffect(() => {
    if (!showIn) {
      return;
    }
    const lang = getLang() === "es" ? "ES" : "EN";
    console.log("lang service", getLang());
    console.log("lang", lang);
    PuzzleService.getResource(`./doc/about${lang}.md`).then((response) => {
      setMarkdown(response);
    });
  }, [showIn]);

  const url = "http://" + getUrl() + "/sevilla360/";
  const quote = t("info.quote");
  const hashtag = t("common.share.hashtag");
  const title = t("common.share.title");

  return !markdown ? null : (
    <React.Fragment>
      <Privacy showIn={showInPrivacy} setShowIn={setShowInPrivacy} />
      <Modal
        show={showIn && !showInPrivacy}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
        className="infoModal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {t("topMenu.title")}{" "}
            <span className="hide-xs d-none d-sm-inline">
              {" "}
              - {t("common.share.subtitle")}
            </span>
            <a
              rel="noreferrer"
              style={{ position: "absolute", right: "20px" }}
              onClick={() => setShowInPrivacy(true)}
            >
              <ShieldShaded size={22} className="me-2" />
              {t("common.privacy")}
            </a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="info">
          <Row>
            <Col lg={12}>
              <ReactMarkdown>{markdown}</ReactMarkdown>
              <Row>
                <Col lg={6} className="p-3">
                  <Figure>
                    <Figure.Image
                      src="./images/1860_01.jpg"
                      alt="Sevilla 1860"
                      className="img-fluid"
                    />
                    <Figure.Caption>{t("info.caption1")}</Figure.Caption>
                  </Figure>
                </Col>
                <Col lg={6} className="p-3">
                  <Figure>
                    <Figure.Image
                      src="./images/1860_02.jpg"
                      alt="Sevilla 1860"
                      className="img-fluid"
                    />
                    <Figure.Caption>{t("info.caption2")}</Figure.Caption>
                  </Figure>
                </Col>
              </Row>
              <p>
                {t("info.github")}:&nbsp;
                <a
                  href="https://github.com/alexwing/ReactPanoramaSevilla360"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/alexwing/ReactPanoramaSevilla360
                </a>
              </p>
              <p>
              {t("info.moreInfo")}:&nbsp;
                <a
                  href="https://aaranda.es/en/mappuzzle-gl-en/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  aaranda.es
                </a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="share">
              <h4>{t("info.share")}</h4>
              <EmailShareButton url={url} subject={title} body={quote}>
                <EmailIcon size={48} round={true} />
              </EmailShareButton>
              <FacebookShareButton url={url} hashtag={hashtag}>
                <FacebookIcon size={48} round={true} />
              </FacebookShareButton>
              <TwitterShareButton
                url={url}
                title={quote}
                hashtags={hashtag.split(",")}
              >
                <TwitterIcon size={48} round={true} />
              </TwitterShareButton>
              <LinkedinShareButton
                url={url}
                title={title}
                summary={quote}
                source={title}
              >
                <LinkedinIcon size={48} round={true} />
              </LinkedinShareButton>
              <WhatsappShareButton url={url} title={quote}>
                <WhatsappIcon size={48} round={true} />
              </WhatsappShareButton>
              <TelegramShareButton url={url} title={quote}>
                <TelegramIcon size={48} round={true} />
              </TelegramShareButton>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ position: "absolute", left: "20px" }}>
            <Button
              href="https://github.com/sponsors/alexwing"
              target="_blank"
              rel="noreferrer"
              variant="danger"
            >
              <Heart size={22} className="me-2" />
              {t("common.donate")}
            </Button>
            <Button
              href="https://github.com/alexwing/ReactPanoramaSevilla360"
              target="_blank"
              rel="noopener noreferrer"
              variant="none"
              className="ms-2"
            >
              <Github size={22} className="me-2" />
              Github
            </Button>
          </div>
          <Button onClick={handleClose}>
            <Check size={22} className="me-2" />
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
export default Info;
