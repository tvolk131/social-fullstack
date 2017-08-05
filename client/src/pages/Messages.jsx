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
    this.fetchMessages(); // Loads messages on initial load or redirect from messages with anothe user
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
        console.log(messages);
        setMessages(messages);
      });
    }
  }

  changeUserSelected (username) {
    window.location.href = '/messages?user=' + username;
  }

  sendMessage(username, text) {
    return axios.post('/api/messages', {username, text}).then(console.log);
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div>Messages</div>
        <input type='text' value={this.state.senderName} onChange={this.handleInputChange.bind(this, 'senderName')} /><br/>
        <button onClick={this.changeUserSelected.bind(this, this.state.senderName)}>Fetch Messages</button><br/>
        <div className='message-list'>
          {this.state.messages.map((message, index) => {
            return <Message user={message.sender} text={message.text} timestamp={message.createdAt} key={index} />
          })}
        </div>
        <input type='text' value={this.state.pendingMessage} onChange={this.handleInputChange.bind(this, 'pendingMessage')} /><br/>
        <button onClick={this.sendMessage.bind(this, this.state.senderName, this.state.pendingMessage)}>Send</button><br/>
      </div>
    ) 
  }
}

export default Messages;