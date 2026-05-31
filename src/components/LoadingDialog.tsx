import React from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

interface LoadingDialogProps {
  show: boolean;
  delay?: number;
}

function LoadingDialog({ show, delay = 0 }: LoadingDialogProps): React.JSX.Element {
  const [showSpinner, setShowSpinner] = React.useState(!delay);

  React.useEffect(() => {
    if (delay > 0 && show) {
      const timer = setTimeout(() => {
        setShowSpinner(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(show);
    }
  }, [show, delay]);

  return (
    <Modal
      show={show && showSpinner}
      centered
      backdrop="static"
      keyboard={false}
      size="sm"
    >
      <Modal.Body className="text-center">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <div>Cargando información...</div>
      </Modal.Body>
    </Modal>
  );
}

export default LoadingDialog;
