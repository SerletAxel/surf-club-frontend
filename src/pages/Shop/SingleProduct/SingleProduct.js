import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SingleProduct.css';
/**
 * SingleProduct component creation
 * this component defines how a single product details will be represented
 */
class SingleProduct extends Component {
  state = {
    name: '',
    date: '',
    image: '',
    price:'',
    shopId:'',
    size:'',
    status:'', 
    type:'',
    weight:'',
    inStock:''
  };
//fetch shop product from the API by productId
  componentDidMount() {
    const productId = this.props.match.params.productId;
    //http://localhost:3333/shop/product/
    fetch('https://surf-club-app.herokuapp.com/' + productId, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          name: resData.product.name,
          //http://localhost:3333/
          image: 'https://surf-club-app.herokuapp.com/' + resData.product.imageUrl,
          date: new Date(resData.product.createdAt).toLocaleDateString('en-US'),
          price: resData.product.price,
          shop: resData.product.shopId,
          size:resData.product.size,
          status: resData.product.status, 
          type:resData.product.type,
          weight:resData.product.weight,
          inStock: resData.product.inStock
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
/**
 * 
 * @returns single-product with: 
 * name
 * creation date
 * price
 * inStock status
 * image
 * size
 * weight
 * the shop name
 */
  render() {
    return (
      <section className="single-product">
        <h1>{this.state.name}</h1>
        <h2>
          Créé le {this.state.date}.
        </h2>
        <h2>
          Pour {this.state.price} euros.
        </h2>
        <p>En stock: {this.state.inStock}</p>
        <div className="single-product__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.size}, {this.state.weight}</p>
        <p>{this.state.shop.name}</p>
      </section>
    );
  }
}

export default SingleProduct;
