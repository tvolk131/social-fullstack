import React from 'react';
import time from '../helpers/time.js';

class Message extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      timestampMessage: ''
    }
    this.updateTimestamp = this.updateTimestamp.bind(this);
  }

  componentDidMount () {
    this.updateTimestamp();
    this.interval = setInterval(this.updateTimestamp, 250);
  }

  updateTimestamp () {
    this.setState({timestampMessage: time.parse(this.props.timestamp, true)});
  }

  render () {
    return (
      <div className='message'>
        <div>{this.props.user}</div>
        <div>{this.props.text}</div>
        <div>{this.state.timestampMessage}</div>
      </div>
    ) 
  }
}

export default Message;