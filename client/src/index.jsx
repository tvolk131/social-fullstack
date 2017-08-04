import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Search from './components/Search.jsx';
import Test from './components/Test.jsx';
import './styles.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render () {
    return (
      <div>
        <p>Test</p>
        <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono" rel="stylesheet"></link>
      </div>)
  }
}

ReactDOM.render(
<Router history={browserHistory}>
  <Route path='/' component={App}/>
  <Route path='/test' component={Test}/>
  <Route path='/testTestTEST' component={Search}/>
</Router>
, document.getElementById('app'));