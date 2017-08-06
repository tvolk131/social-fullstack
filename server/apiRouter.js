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
    var userData = {
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      createdAt: req.user.createdAt
    };
    res.send(JSON.stringify(userData));
  });

  router.get('/frienddata', (req, res) => {
    db.getFriendData(req.user.id).then(JSON.stringify).then((data) => {
      console.log(JSON.parse(data));
      res.end(data);
    });
  });

  // Expects another user's email in req.body.userEmail
  // and then adds a friend request with that particular user
  router.post('/addfriend', (req, res) => {
    var frienderId = req.user.id;
    var friendeeId;
    console.log(req.body.userEmail);
    db.getUser({email: req.body.userEmail}).then((user) => {
      friendeeId = user.id;
    }).catch((err) => {
      res.end('The email you entered is not linked to an existing user');
    }).then(() => {
      return db.addFriend(frienderId, friendeeId, 'create');
    }).then(() => {
      res.end('Friend request sent');
    });
  });

  router.post('/acceptfriendrequest', (req, res) => {
    var frienderId = req.user.id;
    var friendeeId = req.body.friendId;
    db.addFriend(frienderId, friendeeId, 'accept').then(() => {
      res.end('Friend request accepted');
    });
  });

  router.get('/*', (req, res) => {
    res.end();
  });

  return router;
};