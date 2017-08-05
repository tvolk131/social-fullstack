var router = require('express').Router();
var db = require('../database');

const passport = require('passport');

var isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

router.get('/messages', isLoggedIn, (req, res) => {
  var user = req.user.email;
  var otherUser = req.query.user;
  db.getMessages(user, otherUser).then(JSON.stringify).then(res.end);
});

router.get('/currentuser', (req, res) => {
  console.log(JSON.stringify(req.user));
  var userData = {
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
    createdAt: req.user.createdAt
  };
  res.send(JSON.stringify(userData));
});

router.get('/*', (req, res) => {
  res.end();
});

module.exports = router;