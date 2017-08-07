import React from 'react';
import axios from 'axios';

class FriendRequest extends React.Component {
  constructor (props) {
    super(props);
    this.unfriend = this.unfriend.bind(this);
  }

  unfriend () {
    axios.post('/api/unfriend', {
      friendId: this.props.user.id
    });
    this.props.forceUpdateList();
  }

  render () {
    return (
      <div className='friend'>
        <div>{this.props.user.firstname} {this.props.user.lastname}</div>
        <button onClick={this.unfriend}>Unfriend</button>
        <button>Message</button>
      </div>
    ) 
  }
}

export default FriendRequest;