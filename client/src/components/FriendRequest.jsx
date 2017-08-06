import React from 'react';

class FriendRequest extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='friend-request'>
        <div>{this.props.user.email}</div>
        <button>Accept</button>
        <button>Decline</button>
      </div>
    ) 
  }
}

export default FriendRequest;