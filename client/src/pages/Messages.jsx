import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

class Messages extends React.Component {
  constructor(props) {
    super(props);
  }

  // Fetches the messages between you and the other person
  fetchMessages(username) {
    return axios.get('/api/messages?user=' + username);
  }
  sendMessage(username, text) {
    return axios.post('/api/messages', {username, text}).then(console.log);
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div>Messages</div>
      </div>
    ) 
  }
}

export default Messages;