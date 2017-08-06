import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import FriendRequestList from '../components/FriendRequestList.jsx';
import io from 'socket.io-client';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
    this.getData();
    this.socket = io();
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
        <div>Welcome, {this.state.user.firstname}</div>
        <FriendRequestList socket={this.socket} />
      </div>
    ) 
  }
}

export default Home;