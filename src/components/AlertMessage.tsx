import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { AlertModel } from "../models/Interfaces";

interface AlertMessageProps {
  show: boolean;
  alertMessage: AlertModel;
  onHide: () => void;
}

function AlertMessage({ show, alertMessage, onHide }: AlertMessageProps): JSX.Element {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="sm"
    >
      <Modal.Header closeButton>
        <Modal.Title>{alertMessage.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant={alertMessage.type} className="mb-0">
          {alertMessage.message}
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AlertMessage;