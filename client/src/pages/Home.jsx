import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

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
        <Navbar/>
        <div>HOMEPAGE</div>
        <div>User: {this.state.user.firstname} {this.state.user.lastname}</div>
      </div>
    ) 
  }
}

export default Home;