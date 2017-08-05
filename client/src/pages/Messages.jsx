import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Message from '../components/Message.jsx';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      senderName: '',
      pendingMessage: '',
      messages: []
    };
    this.fetchMessagesWithUser('tvolk131@gmail.com');
  }

  // Fetches the messages between you and the other person
  fetchMessagesWithUser(username) {
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
  sendMessage(username, text) {
    return axios.post('/api/messages', {username, text}).then(console.log);
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div>Messages</div>
        {this.state.messages.map((message, index) => {
          return <Message user={message.sender} text={message.text} key={index} />
        })}
      </div>
    ) 
  }
}

export default Messages;