import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import FriendRequestList from '../components/FriendRequestList.jsx';
import FrienderPanel from '../components/FrienderPanel.jsx';
import io from 'socket.io-client';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      friends: [],
      friendRequestsSent: [],
      friendRequestsReceived: []
    }
    this.getData();
    this.socket = io();



    axios.get('/api/frienddata').then((data) => {
      this.setState({friends: data.data.friends});
      this.setState({friendRequestsSent: data.data.friendRequestsSent});
      this.setState({friendRequestsReceived: data.data.friendRequestsReceived});
      this.forceUpdate();
    });
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
        <FriendRequestList requests={this.state.friendRequestsReceived} forceUpdate={this.forceUpdate.bind(this)} socket={this.socket} />
        <FrienderPanel />
      </div>
    ) 
  }
}

export default Home;