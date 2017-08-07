import React from 'react';
import SentFriendRequest from './SentFriendRequest.jsx';

class SentFriendRequestList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='friend-request-list panel'>
        <div>Sent Friend Requests</div>
        {this.props.requests.map((request, index) => {
          return <SentFriendRequest user={request.friend} forceUpdateList={this.props.forceUpdate} key={index} />;
        })}
      </div>
    ) 
  }
}

export default SentFriendRequestList;