import React from 'react';
import axios from 'axios';

class FriendRequest extends React.Component {
  constructor (props) {
    super(props);
    this.acceptRequest = this.acceptRequest.bind(this);
    this.declineRequest = this.declineRequest.bind(this);
  }

  acceptRequest () {
    axios.post('/api/acceptfriendrequest', {
      friendId: this.props.user.id
    }).then(() => {
      this.props.forceUpdateList();
    });
  }

  declineRequest () {
    axios.post('/api/removefriend', {
      friendId: this.props.user.id
    }).then(() => {
      this.props.forceUpdateList();
    });
  }

  render () {
    return (
      <div className='friend-request'>
        <div>{this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email})</div>
        <button onClick={this.acceptRequest}>Accept</button>
        <button onClick={this.declineRequest}>Decline</button>
      </div>
    ) 
  }
}

export default FriendRequest;