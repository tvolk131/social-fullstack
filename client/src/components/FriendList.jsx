import React from 'react';
import Friend from './Friend.jsx';

class FriendList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='friend-list panel'>
        <div className='title'>Friends</div>
        {this.props.friends.map((request, index) => {
          return <Friend user={request.friend} forceUpdateList={this.props.forceUpdate.bind(this)} key={index} />;
        })}
      </div>
    ) 
  }
}

export default FriendList;