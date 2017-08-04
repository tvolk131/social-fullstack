import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.sendLoginRequest = this.sendLoginRequest.bind(this);
  }

  handleInputChange (property, e) {
    var stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }

  sendLoginRequest () {
    if (this.state.email && this.state.password) {
      axios.post('/login', {
        email: this.state.email,
        password: this.state.password
      })
      .then((res) => {
        window.location.replace(res.request.responseURL); // Performs redirect to proper page
        return res;
      });
    } else {
      var missingVals = [];
      if (!this.state.email) {
        missingVals.push('email');
      }
      if (!this.state.password) {
        missingVals.push('password');
      }
      var errorString = `Incomplete! You're missing`;
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
        <div className='login'>
          <h1>Login</h1>
          Email:<br/><input type='email' value={this.state.email} onChange={this.handleInputChange.bind(this, 'email')} /><br/>
          Password:<br/><input type='password' value={this.state.password} onChange={this.handleInputChange.bind(this, 'password')} /><br/>
          <button onClick={this.sendLoginRequest}>Login</button>
        </div>
      </div>
    ) 
  }
}

export default Login;