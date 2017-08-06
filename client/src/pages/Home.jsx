import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import FriendRequestList from '../components/FriendRequestList.jsx';
import io from 'socket.io-client';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      friendData: {friends: [], friendRequestsSent: [], friendRequestsReceived: []}
    }
    this.getData();
    this.socket = io();



    axios.get('/api/frienddata').then((data) => {
      this.setState({friendData: data.data});
    });
    // this.socket.on('friend request', (requestString) => {
    //   var request = JSON.parse(requestString);
    //   this.state.requests.push(request);
    //   this.forceUpdate();
    // });
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
        <FriendRequestList requests={this.state.friendData.friendRequestsReceived} socket={this.socket} />
      </div>
    ) 
  }
}

export default Home;