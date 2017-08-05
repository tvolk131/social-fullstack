import React from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

class Messages extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div>Messages</div>
      </div>
    ) 
  }
}

export default Messages;