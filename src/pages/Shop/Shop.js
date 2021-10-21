import React, { Component, Fragment } from 'react';

import Product from '../../components/Shop/Product/Product';
import Button from '../../components/Button/Button';
import ShopEdit from '../../components/Shop/ShopEdit/ShopEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Shop.css';
/**
 * Shop component creation
 * loads available products by fetching them from the API
 */
class Shop extends Component {
  state = {
    isEditing: false,
    products: [],
    totalProducts: 0,
    editProduct: null,
    status: '',
    productPage: 1,
    productsLoading: true,
    editLoading: false
  };
//fetch user status from the api
  componentDidMount() {
    fetch('http://localhost:3333/auth/status', {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ status: resData.status });
      })
      .catch(this.catchError);

    this.loadProducts();
  }
//loads products after user status fetching 
  loadProducts = direction => {
    if (direction) {
      this.setState({ productsLoading: true, products: [] });
    }
    let page = this.state.productPage;
    if (direction === 'next') {
      page++;
      this.setState({ productPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ productPage: page });
    }
    fetch('http://localhost:3333/shop/products?page=' + page, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch products.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          products: resData.products.map(product => {
            return {
              ...product,
              imagePath: product.imageUrl
            };
          }),
          totalProducts: resData.totalItems,
          productsLoading: false
        });
      })
      .catch(this.catchError);
  };
/**
 * 
 * @param {*} event update user status by fetching user data from API
 */
  statusUpdateHandler = event => {
    event.preventDefault();
    fetch('http://localhost:3333/auth/status', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: this.state.status
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newProductHandler = () => {
    this.setState({ isEditing: true });
  };
//product editing and creation
  startEditProductHandler = productId => {
    this.setState(prevState => {
      const loadedProduct = { ...prevState.products.find(p => p._id === productId) };

      return {
        isEditing: true,
        editProduct: loadedProduct
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editProduct: null });
  };

  finishEditHandler = productData => {
    this.setState({
      editLoading: true
    });
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('inStock', productData.inStock);
    formData.append('image', productData.image);
    let url = 'http://localhost:3333/shop/product';
    let method = 'POST';
    if (this.state.editProduct) {
      url = 'http://localhost:3333/shop/product/' + this.state.editProduct._id;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a product failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        const product = {
          _id: resData.product._id,
          name: resData.product.name,
          shop: resData.product.shop.name,
          price: resData.product.price,
          inStock: resData.product.inStock,
          createdAt: resData.product.createdAt
        };
        this.setState(prevState => {
          let updatedProducts = [...prevState.products];
          if (prevState.editProduct) {
            const productIndex = prevState.products.findIndex(
              p => p._id === prevState.editProduct._id
            );
            updatedProducts[productIndex] = product;
          } else if (prevState.products.length < 2) {
            updatedProducts = prevState.products.concat(product);
          }
          return {
            products: updatedProducts,
            isEditing: false,
            editProduct: null,
            editLoading: false
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editProduct: null,
          editLoading: false,
          error: err
        });
      });
  };
/**
 * 
 * @param {*} input 
 * @param {*} value 
 */
  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };
/**
 * delete product by id
 * @param {*} productId delete productId after fetching from the API
 */
  deleteProductHandler = productId => {
    this.setState({ productsLoading: true });
    fetch('http://localhost:3333/shop/product/' + productId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a product failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState(prevState => {
          const updatedProducts = prevState.products.filter(p => p._id !== productId);
          return { products: updatedProducts, productsLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ productsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };
/**
 * 
 * @returns product after editing
 */
  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <ShopEdit
          editing={this.state.isEditing}
          selectedProduct={this.state.editProduct}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="shop__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Mise à jour
            </Button>
          </form>
        </section>
        <section className="shop__control">
          <Button mode="raised" design="accent" onClick={this.newProductHandler}>
            Nouveau produit
          </Button>
        </section>
        {/*new product creation*/}
        <section className="shop">
          {this.state.productsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.products.length <= 0 && !this.state.productsLoading ? (
            <p style={{ textAlign: 'center' }}>No products found.</p>
          ) : null}
          {!this.state.productsLoading && (
            <Paginator
              onPrevious={this.loadProducts.bind(this, 'previous')}
              onNext={this.loadProducts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalProducts / 2)}
              currentPage={this.state.productPage}
            >
              {this.state.products.map(product => (
                <Product
                  key={product._id}
                  id={product._id}
                  shop={product.shop.name}
                  date={new Date(product.createdAt).toLocaleDateString('en-US')}
                  name={product.name}
                  image={product.imageUrl}
                  price={product.price}
                  instock={product.instock}
                  onStartEdit={this.startEditProductHandler.bind(this, product._id)}
                  onDelete={this.deleteProductHandler.bind(this, product._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Shop;
