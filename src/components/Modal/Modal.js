import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../Button/Button';
import './Modal.css';
//defines modal that is displayed when an error occurs
const modal = props =>
  ReactDOM.createPortal(
    <div className="modal">
      <header className="modal__header">
        <h1>{props.title}</h1>
      </header>
      <div className="modal__content">{props.children}</div>
      <div className="modal__actions">
        <Button design="danger" mode="flat" onClick={props.onCancelModal}>
          Annuler
        </Button>
        <Button
          mode="raised"
          onClick={props.onAcceptModal}
          disabled={!props.acceptEnabled}
          loading={props.isLoading}
        >
          Accepter
        </Button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );

export default modal;
