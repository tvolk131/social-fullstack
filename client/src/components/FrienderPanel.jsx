import React from 'react';
import FriendRequest from './FriendRequest.jsx';
import axios from 'axios';

class FrienderPanel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userToAdd: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.sendFriendRequest = this.sendFriendRequest.bind(this);
  }

  handleInputChange (property, e) {
    var stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }

  sendFriendRequest () {
    var userEmail = this.state.userToAdd;
    var resetUserAddTextField = () => {
      this.setState({userToAdd: ''});
    }
    axios.post('/api/addfriend', {userEmail}).then(() => {
      resetUserAddTextField();
    });
  }

  render () {
    return (
      <div className='friender-panel'>
        <div>Add Friends</div>
        User:<br/><input type='text' value={this.state.userToAdd} onChange={this.handleInputChange.bind(this, 'userToAdd')} /><br/>
        <button onClick={this.sendFriendRequest}>Send Request</button>
      </div>
    ) 
  }
}

export default FrienderPanel;