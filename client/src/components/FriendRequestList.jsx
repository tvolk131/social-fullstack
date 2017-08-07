import React from 'react';
import FriendRequest from './FriendRequest.jsx';

class FriendRequestList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='friend-request-list'>
        <div>Friend Requests</div>
        {this.props.requests.map((request, index) => {
          return <FriendRequest user={request.friend} forceUpdateList={this.props.forceUpdate} key={index} />;
        })}
      </div>
    ) 
  }
}

export default FriendRequestList;