module.exports = (sockets) => {
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
    var userId = req.user.id;
    var otherUserId;
    var userEmail;
    var otherUserEmail;
    db.getUser({email: req.query.user})
    .then((user) => {
      otherUserId = user.id;
      otherUserEmail = user.email;
    })
    .then(() => {
      return db.getUser({id: userId});
    })
    .then((user) => {
      userEmail = user.email;
    })
    .then(() => {
      return db.getMessages(userId, otherUserId);
    })
    .then((messagesOld) => {
      var messages = JSON.parse(JSON.stringify(messagesOld));
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].sender_id === userId) {
          messages[i].sender = userEmail;
          messages[i].recipient = otherUserEmail;
        } else {
          messages[i].sender = otherUserEmail;
          messages[i].recipient = userEmail;
        }
      }
      return messages;
    })
    .then(JSON.stringify)
    .then(res.end);
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

  return router;
};