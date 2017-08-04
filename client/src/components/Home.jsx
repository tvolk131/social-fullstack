import React from 'react';
import axios from 'axios';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);
    this.getData();
  }

  onChange (e) {
    this.setState({
      term: e.target.value
    });
  }

  getData () {
    axios.get('/api/currentuser')
    .then((data) => {
      this.setState({username: data.data});
    });
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return (
      <div>
        <div>HOMEPAGE</div>
        <div>User: {this.state.username}</div>
      </div>
    ) 
  }
}

export default Search;