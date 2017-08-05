import React from 'react';
import axios from 'axios';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
    this.getData();
  }

  getData () {
    axios.get('/api/currentuser')
    .then((data) => {
      this.setState({user: data.data});
    });
  }

  render() {
    return (
      <div>
        <div>HOMEPAGE</div>
        <div>User: {this.state.user.firstname} {this.state.user.lastname}</div>
      </div>
    ) 
  }
}

export default Home;