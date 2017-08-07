import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Message from '../components/Message.jsx';
import io from 'socket.io-client';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    var urlParams = new URLSearchParams(window.location.search);
    this.state = {
      friends: [],
      otherUser: {
        firstname: '',
        lastname: '',
        email: urlParams.get('user')
      },
      pendingMessage: '',
      messages: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchMessages(); // Loads messages on initial load or redirect from messages with another user
    this.socket = io();
    // Updates messages that have been after since the page was loaded
    this.socket.on('message', (message) => {
      this.state.messages.push(JSON.parse(message));
      this.forceUpdate();
    });
    axios.get('/api/frienddata').then((data) => {
      this.setState({friends: data.data.friends});
      for (var i = 0; i < this.state.friends.length; i++) {
        if (this.state.friends[i].friend.email === urlParams.get('user')) {
          this.setState({otherUser: this.state.friends[i].friend});
        }
      }
    });
  }

  componentDidMount () {
    this.interval = setInterval(this.forceUpdate.bind(this), 1000);
  }

  handleInputChange (property, e) {
    var stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }

  // Fetches the messages between you and another person using your
   // URL's 'user' query parameter to choose who use as the other person
  fetchMessages() {
    var urlParams = new URLSearchParams(window.location.search);
    var username = urlParams.get('user');
    if (username) {
      var setMessages = (messageArray) => {
        this.setState({messages: messageArray});
      }

      return axios.get('/api/messages?user=' + username)
      .then((data) => {
        return data.data;
      })
      .then((messages) => {
        setMessages(messages);
      });
    }
  }

  changeUserSelected (username) {
    window.location.href = '/messages?user=' + username;
  }

  sendMessage(email, text) {
    this.socket.emit('message', JSON.stringify({email, text}));
    this.setState({pendingMessage: ''});
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div>Messages with {this.state.otherUser.firstname} {this.state.otherUser.lastname}</div>
        <select>
          {this.state.friends.map((friend, index) => {
            return <option value='test' key={index}>{friend.friend.firstname} {friend.friend.lastname} ({friend.friend.email})</option>
          })}
        </select>
        <div className='message-list panel'>
          {this.state.messages.map((message, index) => {
            return <Message message={message} key={index} />
          })}
        </div>
        <input type='text' value={this.state.pendingMessage} onChange={this.handleInputChange.bind(this, 'pendingMessage')} /><br/>
        <button onClick={this.sendMessage.bind(this, this.state.otherUser.email, this.state.pendingMessage)}>Send</button><br/>
      </div>
    ) 
  }
}

export default Messages;