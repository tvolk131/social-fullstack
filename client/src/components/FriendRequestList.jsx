import React from 'react';
import FriendRequest from './FriendRequest.jsx';

class FriendRequestList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      requests: props.requests
    }
    props.socket.on('friend request', (requestString) => {
      var request = JSON.parse(requestString);
      this.state.requests.push(request);
      this.forceUpdate();
    });
  }

  render () {
    return (
      <div className='friend-request-list'>
        <div>Friend Requests</div>
        {this.state.requests.map((request, index) => {
          return <FriendRequest user={request.friend} forceUpdateList={this.forceUpdate.bind(this)} key={index} />;
        })}
      </div>
    ) 
  }
}

export default FriendRequestList;