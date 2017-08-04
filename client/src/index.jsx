import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Search from './components/Search.jsx';
import './styles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render () {
    return (<div>
      <h1>Social App</h1>
      <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono" rel="stylesheet"></link>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));