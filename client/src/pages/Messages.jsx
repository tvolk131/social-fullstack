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
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange (property, e) {
    var stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
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
      console.log(messages);
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
        <div className='message-list'>
          {this.state.messages.map((message, index) => {
            return <Message user={message.sender} text={message.text} timestamp={message.createdAt} key={index} />
          })}
        </div>
        <input type='text' value={this.state.pendingMessage} onChange={this.handleInputChange.bind(this, 'pendingMessage')} /><br/>
        <button onClick={this.sendMessage.bind(this, this.state.senderName, this.state.pendingMessage)}>Send</button><br/>
        <input type='text' value={this.state.senderName} onChange={this.handleInputChange.bind(this, 'senderName')} /><br/>
        <button onClick={this.fetchMessagesWithUser.bind(this, this.state.senderName)}>Fetch Messages</button><br/>
      </div>
    ) 
  }
}

export default Messages;