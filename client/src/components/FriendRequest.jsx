import React from 'react';
import axios from 'axios';

class FriendRequest extends React.Component {
  constructor (props) {
    super(props);
    this.acceptRequest = this.acceptRequest.bind(this);
  }

  acceptRequest () {
    axios.post('/api/acceptfriendrequest', {
      friendId: this.props.user.id
    });
    this.props.forceUpdateList();
  }

  render () {
    return (
      <div className='friend-request'>
        <div>{this.props.user.email}</div>
        <button onClick={this.acceptRequest}>Accept</button>
        <button>Decline</button>
      </div>
    ) 
  }
}

export default FriendRequest;