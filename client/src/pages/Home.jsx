import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import FriendRequestList from '../components/FriendRequestList.jsx';
import FrienderPanel from '../components/FrienderPanel.jsx';
import FriendList from '../components/FriendList.jsx';
import SentFriendRequestList from '../components/SentFriendRequestList.jsx';
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
    this.getCurrentUser();
    this.socket = io();
    this.socket.on('add friend send request', (messageString) => {
      var message = JSON.parse(messageString);
      var request = {
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        friender_id: message.friender.id,
        friendee_id: message.friendee.id
      };
      if (request.friender_id === this.state.user.id) {
        request.friend = message.friendee;
        this.state.friendRequestsSent.push(request);
      } else {
        request.friend = message.friender;
        this.state.friendRequestsReceived.push(request);
      }
      this.forceUpdate();
    });
    this.socket.on('add friend accept request', (messageString) => {
      var message = JSON.parse(messageString);
      for (var i = 0; i < this.state.friendRequestsSent.length; i++) {
        if (this.state.friendRequestsSent[i].friend.id === message.friender.id) {
          this.state.friendRequestsSent.splice(i);
        }
      }
      for (var i = 0; i < this.state.friendRequestsReceived.length; i++) {
        if (this.state.friendRequestsReceived[i].friend.id === message.friendee.id) {
          this.state.friendRequestsReceived.splice(i);
        }
      }
      console.log(this.state.friends);
      var friend = {
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        friender_id: message.friender.id,
        friendee_id: message.friendee.id,
      };
      if (friend.friender_id === this.state.user.id) {
        friend.friend = message.friendee;
        this.state.friends.push(friend);
      } else {
        friend.friend = message.friender;
        this.state.friends.push(friend);
      }
      this.forceUpdate();
    });
    this.socket.on('remove friend', (messageString) => {
      var message = JSON.parse(messageString);
      for (var i = 0; i < this.state.friends.length; i++) {
        if (this.state.friends[i].friend.id === message.unfriender.id || this.state.friends[i].friend.id === message.unfriendee.id) {
          this.state.friends.splice(i);
        }
      }
      for (var i = 0; i < this.state.friendRequestsSent.length; i++) {
        if (this.state.friendRequestsSent[i].friend.id === message.unfriender.id || this.state.friendRequestsSent[i].friend.id === message.unfriendee.id) {
          this.state.friendRequestsSent.splice(i);
        }
      }
      for (var i = 0; i < this.state.friendRequestsReceived.length; i++) {
        if (this.state.friendRequestsReceived[i].friend.id === message.unfriender.id || this.state.friendRequestsReceived[i].friend.id === message.unfriendee.id) {
          this.state.friendRequestsReceived.splice(i);
        }
      }
      this.forceUpdate();
    });

    axios.get('/api/frienddata').then((data) => {
      this.setState({friends: data.data.friends});
      this.setState({friendRequestsSent: data.data.friendRequestsSent});
      this.setState({friendRequestsReceived: data.data.friendRequestsReceived});
      this.forceUpdate();
    });
  }

  getCurrentUser () {
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
        <FriendList friends={this.state.friends} forceUpdate={this.forceUpdate.bind(this)} />
        <SentFriendRequestList requests={this.state.friendRequestsSent} forceUpdate={this.forceUpdate.bind(this)} />
      </div>
    ) 
  }
}

export default Home;