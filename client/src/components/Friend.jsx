import React from 'react';
import axios from 'axios';

class FriendRequest extends React.Component {
  constructor (props) {
    super(props);
    this.unfriend = this.unfriend.bind(this);
    this.redirectToMessage = this.redirectToMessage.bind(this);
  }

  unfriend () {
    axios.post('/api/removefriend', {
      friendId: this.props.user.id
    }).then(() => {
      this.props.forceUpdateList();
    });
  }

  redirectToMessage () {
    window.location.href = '/messages?user=' + this.props.user.email;
  }

  render () {
    return (
      <div className='friend'>
        <div>{this.props.user.firstname} {this.props.user.lastname}</div>
        <button onClick={this.redirectToMessage}>Message</button>
        <button onClick={this.unfriend}>Unfriend</button>
      </div>
    ) 
  }
}

export default FriendRequest;