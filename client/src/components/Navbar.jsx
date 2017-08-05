import React from 'react';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='navbar'>
        <div className='content-wrap'>
          <a href='/'>Home</a>
          <a href='/messages'>Messages</a>
          <a href='/logout'>Logout</a>
        </div>
      </div>
    ) 
  }
}

export default Navbar;