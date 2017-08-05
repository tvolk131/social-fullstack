import React from 'react';
import axios from 'axios';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.sendUserData = this.sendUserData.bind(this);
  }

  handleInputChange (property, e) {
    var stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }

  sendUserData () {
    if (this.state.firstname && this.state.lastname && this.state.email && this.state.password) {
      axios.post('/signup', {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        password: this.state.password
      })
      .then((res) => {
        window.location.replace(res.request.responseURL); // Performs redirect to proper page
        return res;
      });
    } else {
      var missingVals = [];
      if (!this.state.firstname) {
        missingVals.push('first name');
      }
      if (!this.state.lastname) {
        missingVals.push('last name');
      }
      if (!this.state.email) {
        missingVals.push('email');
      }
      if (!this.state.password) {
        missingVals.push('password');
      }
      var errorString = 'Incomplete! You are missing';
      for (var i = 0; i < missingVals.length; i++) {
        if (i === missingVals.length - 1 && missingVals.length > 1) {
          errorString += ', and ' + missingVals[i];
        } else if (i === 0) {
          errorString += ' ' + missingVals[i];
        } else {
          errorString += ', ' + missingVals[i];
        }
      }
      console.log(errorString);
    }
  }

  render() {
    return (
      <div>
        <div className='signup'>
          <h1>Signup</h1>
          First Name:<br/><input type='text' value={this.state.firstname} onChange={this.handleInputChange.bind(this, 'firstname')} /><br/>
          Last Name:<br/><input type='text' value={this.state.lastname} onChange={this.handleInputChange.bind(this, 'lastname')} /><br/>
          Email:<br/><input type='email' value={this.state.email} onChange={this.handleInputChange.bind(this, 'email')} /><br/>
          Password:<br/><input type='password' value={this.state.password} onChange={this.handleInputChange.bind(this, 'password')} /><br/>
          <button onClick={this.sendUserData}>Create Account</button>
        </div>
        <div>
          <p>Already have an account? <a href='/login'>Sign in!</a></p>
        </div>
      </div>
    ) 
  }
}

export default Signup;