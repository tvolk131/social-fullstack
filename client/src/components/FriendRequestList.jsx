import React from 'react';
import FriendRequest from './FriendRequest.jsx';

class FriendRequestList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      requests: []
    };
    props.socket.on('incoming friend request', (friendRequestString) => {
      var friendRequest = JSON.parse(friendRequestString);
      this.state.requests.push(friendRequest);
      this.forceUpdate();
    });
  }

  render () {
    this.state.requests = JSON.parse(JSON.stringify(this.props.requests));
    return (
      <div className='friend-request-list'>
        <div>Friend Requests</div>
        {this.state.requests.map((request, index) => {
          return <FriendRequest user={request.friend} forceUpdateList={this.props.forceUpdate} key={index} />;
        })}
      </div>
    ) 
  }
}

export default FriendRequestList;