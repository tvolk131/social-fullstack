import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Messages from './pages/Messages.jsx';
import NotFound from './pages/NotFound.jsx';
import './styles.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

ReactDOM.render(
<Router history={browserHistory}>
  <Route path='/' component={Home}/>
  <Route path='/login' component={Login}/>
  <Route path='/signup' component={Signup}/>
  <Route path='/messages' component={Messages}/>
  <Route path='*' component={NotFound}/>
</Router>
, document.getElementById('app'));