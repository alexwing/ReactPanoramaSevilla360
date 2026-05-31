import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./WikiHotspot.css";
import { AlertModel, WikiInfoPiece } from "../models/Interfaces";
import LoadingDialog from "./LoadingDialog";
import AlertMessage from "./AlertMessage";
import { Wikipedia, Check } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

interface WikiHotspotProps {
  show: boolean;
  onHide: (val: boolean) => void;
  hotspotData: {
    text: string;
    URL: string;
  } | null;
}

function WikiHotspot({
  show = false,
  onHide,
  hotspotData,
}: WikiHotspotProps): React.JSX.Element {
  const [wikiInfo, setWikiInfo] = useState({
    title: "",
    contents: [],
    image: "",
    langs: [],
  } as WikiInfoPiece);

  const [loading, setLoading] = useState(false);
  const [showIn, setShowIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertModal, setAlertModal] = useState({
    title: "",
    message: "",
    type: "danger",
  } as AlertModel);
  
  const { t } = useTranslation();

  // Mostrar modal cuando show cambie
  useEffect(() => {
    setShowIn(show);
  }, [show]);

  // Cargar información cuando se muestra el modal
  useEffect(() => {
    if (show && hotspotData && hotspotData.text) {
      setLoading(true);
      fetchWikiInfo(hotspotData.text)
        .then((info) => {
          if (info.title === "Not found data on Wikipedia") {
            setAlertModal({
              title: t("wikiInfo.notFound"),
              message: info.title,
              type: "danger",
            } as AlertModel);
            setShowAlert(true);
            setShowIn(false);
          } else {
            setWikiInfo(info);
            setShowAlert(false);
            setShowIn(true);
          }
        })
        .catch((error) => {
          setShowAlert(true);
          setAlertModal({
            title: t("wikiInfo.notFound"),
            message: error.message,
            type: "danger",
          } as AlertModel);
          setWikiInfo({
            title: t("wikiInfo.notFound"),
            contents: [error.message],
            langs: [],
          } as WikiInfoPiece);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [show, hotspotData, t]);

  // Función para extraer el título de Wikipedia de la URL
  const extractWikiTitle = (url: string): string => {
    try {
      // Intentar extraer de URL de Wikipedia
      const match = url.match(/\/wiki\/(.+)$/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
      
      // Si no es una URL de Wikipedia, usar el texto del hotspot
      return hotspotData?.text || "";
    } catch {
      return hotspotData?.text || "";
    }
  };

  // Función para obtener información de Wikipedia
  const fetchWikiInfo = async (searchTerm: string): Promise<WikiInfoPiece> => {
    try {
      const title = hotspotData?.URL ? extractWikiTitle(hotspotData.URL) : searchTerm;
      
      const url = `https://es.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts|pageimages&piprop=original&format=json&exintro=&titles=${encodeURIComponent(title)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      
      if (pageId === "-1" || !page.extract) {
        throw new Error("No se encontró información en Wikipedia");
      }
      
      return {
        title: page.title,
        contents: page.extract.split('\n').filter((line: string) => line.trim() !== ''),
        image: page.original?.source || "",
        langs: [],
      };
    } catch (error) {
      console.error("Error fetching Wikipedia info:", error);
      return {
        title: "Not found data on Wikipedia",
        contents: [(error as Error).message],
        langs: [],
      };
    }
  };

  function handleClose() {
    clearAlert();
    onHide(false);
  }

  const wikiTitle = () => {
    if (wikiInfo.title !== "" && wikiInfo.title !== "Not found data on Wikipedia") {
      return (
        <span>
          <Wikipedia size={28} className="me-2" />
          {wikiInfo.title}
        </span>
      );
    } else {
      return <span>{hotspotData?.text || t("wikiInfo.notFound")}</span>;
    }
  };

  const clearAlert = () => {
    setAlertModal({
      title: "",
      message: "",
      type: "danger",
    } as AlertModel);
    setShowAlert(false);
  };

  if (loading) return <LoadingDialog show={loading} delay={1000} />;

  return (
    <React.Fragment>
      <AlertMessage
        show={showAlert}
        alertMessage={alertModal}
        onHide={clearAlert}
      />
      <Modal
        show={showIn}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
        className="alertWiki"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {wikiTitle()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>{printContent()}</Row>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Body id="contained-modal-title-vcenter">
            <small>
              Este artículo utiliza material del artículo de Wikipedia&nbsp;
              {hotspotData?.URL && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={hotspotData.URL}
                >
                  {wikiInfo.title}
                </a>
              )}
              {!hotspotData?.URL && wikiInfo.title}
              , que se publica bajo la&nbsp;
              <a href="https://creativecommons.org/licenses/by-sa/3.0/">
                Licencia Creative Commons Attribution-Share-Alike 3.0
              </a>
              .
            </small>
          </Modal.Body>
          <Button onClick={handleClose}>
            <Check size={22} className="me-2" />
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );

  function printContent() {
    if (wikiInfo.title === "" || wikiInfo.title === "Not found data on Wikipedia") {
      return null;
    }
    
    return (
      <Col lg={12} className="infoWiki">
        {wikiInfo.image && (
          <img
            src={wikiInfo.image}
            alt={wikiInfo.title}
            className="imgWiki"
          />
        )}
        {wikiInfo.contents.map((content, index: number) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: content }} />
        ))}
      </Col>
    );
  }
}

export default WikiHotspot;
