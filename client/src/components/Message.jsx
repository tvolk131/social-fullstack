import React from 'react';
import time from '../helpers/time.js';

class Message extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='message subpanel'>
        <div>{this.props.message.sender}</div>
        <div>{this.props.message.text}</div>
        <div>{time.parse(this.props.message.createdAt, true)}</div>
      </div>
    ) 
  }
}

export default Message;