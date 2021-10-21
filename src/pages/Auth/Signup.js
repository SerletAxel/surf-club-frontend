import React, { Component } from 'react';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';
/**
 * Signup component creation
 */
class Signup extends Component {
  state = {
    signupForm: {
      email: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, email]
      },
      password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
      },
      firstName: {
        value: '',
        valid: false,
        touched: false,
        validators: [required]
      },
      lastName: {
        value: '',
        valid: false,
        touched: false,
        validators: [required]
      },
      phoneNumber: {
        value: '',
        valid: false,
        touched: false,
        validators: [required]
      },
      formIsValid: false
    }
  };
/**
 * 
 * @param {*} input receives user signup form values
 * @param {*} value verifies values validity and return signup form values
 */
  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.signupForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.signupForm,
        [input]: {
          ...prevState.signupForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        signupForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };
/**
 * 
 * @param {*} input 
 */
  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        signupForm: {
          ...prevState.signupForm,
          [input]: {
            ...prevState.signupForm[input],
            touched: true
          }
        }
      };
    });
  };
/**
 * 
 * @returns onSubmit the signing form with data after validation 
 */
  render() {
    return (
      <Auth>
        <form onSubmit={e => this.props.onSignup(e, this.state)}>
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'email')}
            value={this.state.signupForm['email'].value}
            valid={this.state.signupForm['email'].valid}
            touched={this.state.signupForm['email'].touched}
          />
          <Input
            id="firstName"
            label="Your First Name"
            type="text"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'firstName')}
            value={this.state.signupForm['firstName'].value}
            valid={this.state.signupForm['firstName'].valid}
            touched={this.state.signupForm['firstName'].touched}
          />
          <Input
            id="lastName"
            label="Your Last Name"
            type="text"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'lastName')}
            value={this.state.signupForm['lastName'].value}
            valid={this.state.signupForm['lastName'].valid}
            touched={this.state.signupForm['lastName'].touched}
          />
          <Input
            id="phoneNumber"
            label="Your Phone Number"
            type="text"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'phoneNumber')}
            value={this.state.signupForm['phoneNumber'].value}
            valid={this.state.signupForm['phoneNumber'].valid}
            touched={this.state.signupForm['phoneNumber'].touched}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'password')}
            value={this.state.signupForm['password'].value}
            valid={this.state.signupForm['password'].valid}
            touched={this.state.signupForm['password'].touched}
          />
          <Button design="raised" type="submit" loading={this.props.loading}>
            Signup
          </Button>
        </form>
      </Auth>
    );
  }
}

export default Signup;
