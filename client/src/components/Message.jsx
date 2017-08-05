import React from 'react';
import time from '../helpers/time.js';

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='message'>
        <div>{this.props.user}</div>
        <div>{this.props.text}</div>
        <div>{time.parse(this.props.timestamp, true)}</div>
      </div>
    ) 
  }
}

export default Message;