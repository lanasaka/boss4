import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'; // Import PropTypes

const ConfirmationModal = ({ show, onHide, onConfirm, userName }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete {userName}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Add prop type validation
ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired, // Add userName prop validation
};

export default ConfirmationModal;
