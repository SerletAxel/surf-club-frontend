import React, { Component, Fragment } from 'react';

import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import Input from '../../Form/Input/Input';
import FilePicker from '../../Form/Input/FilePicker';
import Image from '../../Image/Image';
import { required, length } from '../../../util/validators';
import { generateBase64FromImage } from '../../../util/image';

const PRODUCT_FORM = {
  title: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  },
  image: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  content: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  }
};

class ShopEdit extends Component {
  state = {
    productForm: PRODUCT_FORM,
    formIsValid: false,
    imagePreview: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.editing &&
      prevProps.editing !== this.props.editing &&
      prevProps.selectedProduct !== this.props.selectedProduct
    ) {
      const productForm = {
        title: {
          ...prevState.productForm.title,
          value: this.props.selectedProduct.title,
          valid: true
        },
        image: {
          ...prevState.productForm.image,
          value: this.props.selectedProduct.imagePath,
          valid: true
        },
        content: {
          ...prevState.productForm.content,
          value: this.props.selectedProduct.content,
          valid: true
        }
      };
      this.setState({ productForm: productForm, formIsValid: true });
    }
  }

  productInputChangeHandler = (input, value, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then(b64 => {
          this.setState({ imagePreview: b64 });
        })
        .catch(e => {
          this.setState({ imagePreview: null });
        });
    }
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.productForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.productForm,
        [input]: {
          ...prevState.productForm[input],
          valid: isValid,
          value: files ? files[0] : value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        productForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        productForm: {
          ...prevState.productForm,
          [input]: {
            ...prevState.productForm[input],
            touched: true
          }
        }
      };
    });
  };

  cancelProductChangeHandler = () => {
    this.setState({
      productForm: PRODUCT_FORM,
      formIsValid: false
    });
    this.props.onCancelEdit();
  };

  acceptProductChangeHandler = () => {
    const product = {
      title: this.state.productForm.title.value,
      image: this.state.productForm.image.value,
      content: this.state.productForm.content.value
    };
    this.props.onFinishEdit(product);
    this.setState({
      productForm: PRODUCT_FORM,
      formIsValid: false,
      imagePreview: null
    });
  };
//render new product creation form
  render() {
    return this.props.editing ? (
      <Fragment>
        <Backdrop onClick={this.cancelProductChangeHandler} />
        <Modal
          title="Nouveau produit"
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelProductChangeHandler}
          onAcceptModal={this.acceptProductChangeHandler}
          isLoading={this.props.loading}
        >
          <form>
            <Input
              id="title"
              label="Title"
              control="input"
              onChange={this.productInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'title')}
              valid={this.state.productForm['title'].valid}
              touched={this.state.productForm['title'].touched}
              value={this.state.productForm['title'].value}
            />
            <FilePicker
              id="image"
              label="Image"
              control="input"
              onChange={this.productInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'image')}
              valid={this.state.productForm['image'].valid}
              touched={this.state.productForm['image'].touched}
            />
            <div className="new-product__preview-image">
              {!this.state.imagePreview && <p>Please choose an image.</p>}
              {this.state.imagePreview && (
                <Image imageUrl={this.state.imagePreview} contain left />
              )}
            </div>
            <Input
              id="content"
              label="Content"
              control="textarea"
              rows="5"
              onChange={this.productInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'content')}
              valid={this.state.productForm['content'].valid}
              touched={this.state.productForm['content'].touched}
              value={this.state.productForm['content'].value}
            />
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default ShopEdit;