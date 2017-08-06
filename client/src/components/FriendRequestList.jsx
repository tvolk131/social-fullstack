import React from 'react';
import FriendRequest from './FriendRequest.jsx';
import axios from 'axios';

class FriendRequestList extends React.Component {
  constructor (props) {
    super(props);
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
        {this.props.requests.map((request, index) => {
          return <FriendRequest user={request.friend} key={index} />;
        })}
      </div>
    ) 
  }
}

export default FriendRequestList;