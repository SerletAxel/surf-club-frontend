import React from 'react';

import Button from '../../Button/Button';
import './Product.css';

const product = props => (
  <article className="product">
    <header className="product__header">
      <h3 className="product__meta">
        Posté par {props.author} le {props.date}
      </h3>
      <h1 className="product__title">{props.title}</h1>
    </header>
    {/* <div className="product__image">
      <Image imageUrl={props.image} contain />
    </div>
    <div className="product__content">{props.content}</div> */}
    <div className="product__actions">
      <Button mode="flat" link={props.id}>
        Voir
      </Button>
      <Button mode="flat" onClick={props.onStartEdit}>
        Modifier
      </Button>
      <Button mode="flat" design="danger" onClick={props.onDelete}>
        Supprimer
      </Button>
    </div>
  </article>
);

export default product;
