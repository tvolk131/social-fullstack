import React from 'react';

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='message'>
        <div>{this.props.user}</div>
        <div>{this.props.text}</div>
      </div>
    ) 
  }
}

export default Message;