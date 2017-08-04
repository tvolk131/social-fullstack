import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import NotFound from './components/NotFound.jsx';
import './styles.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

ReactDOM.render(
<Router history={browserHistory}>
  <Route path='/' component={Home}/>
  <Route path='/login' component={Login}/>
  <Route path='/signup' component={Signup}/>
  <Route path='*' component={NotFound}/>
</Router>
, document.getElementById('app'));