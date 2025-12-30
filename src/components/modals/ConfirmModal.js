import React from 'react';
import ButtonBox from '../common/ButtonBox';
import '../../styles/components/Modal.css';
import '../../styles/components/ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} title="Close">×</button>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <ButtonBox
            type="cancel"
            onClickHandler={onClose}
            className="btn-sm"
            text={cancelText}
          />
          <ButtonBox
            type={type === 'danger' ? 'delete' : 'save'}
            onClickHandler={onConfirm}
            className="btn-sm"
            text={confirmText}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

