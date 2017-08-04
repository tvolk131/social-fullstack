import React from 'react';
import axios from 'axios';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }
    this.onChange = this.onChange.bind(this);
    this.sendUserData = this.sendUserData.bind(this);
  }

  onChange (e) {
    this.setState({
      term: e.target.value
    });
  }

  sendUserData () {
    axios.post('/signup', {
      firstname: 'Tommy',
      lastname: 'Volk',
      email: 'tvolk131@gmail.com',
      password: 'test'
    })
    .then((res) => {
      window.location.replace(res.request.responseURL); // Performs redirect to proper page
      return res;
    });
  }

  render() {
    return (
      <div>
        <h1>SIGNUP</h1>
        <form method='POST'>
          Email:<br/><input type='text' /><br/>
          Password:<br/><input type='password' /><br/>
          <input type='submit' />
        </form>
        <button onClick={this.sendUserData}>SEND</button>
      </div>
    ) 
  }
}

export default Search;