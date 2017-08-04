import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Home from './components/Pages/Home.jsx';
import Login from './components/Pages/Login.jsx';
import Signup from './components/Pages/Signup.jsx';
import Messages from './components/Pages/Messages.jsx';
import NotFound from './components/Pages/NotFound.jsx';
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