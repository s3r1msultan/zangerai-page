// src/components/Modal/Modal.tsx
import React from "react";
import "./Modal.scss";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, onConfirm, title, message }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose}>Отменить</button>
          <button onClick={onConfirm}>Подтвердить</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
