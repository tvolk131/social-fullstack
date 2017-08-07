import React from 'react';
import axios from 'axios';

class SentFriendRequest extends React.Component {
  constructor (props) {
    super(props);
    this.revokeRequest = this.revokeRequest.bind(this);
  }

  revokeRequest () {
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
        <button onClick={this.revokeRequest}>Revoke Request</button>
      </div>
    ) 
  }
}

export default SentFriendRequest;