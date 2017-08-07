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
    res.send(JSON.stringify(req.user));
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
    var friender = req.user;
    var friendee;
    console.log(req.body.userEmail);
    db.getUser({email: req.body.userEmail}).then((user) => {
      friendee = user;
    }).catch((err) => {
      res.end('The email you entered is not linked to an existing user');
    }).then(() => {
      return db.addFriend(friender.id, friendee.id, 'create');
    }).then((data) => {
      if (data) {
        for (var key in sockets) {
          if (friender.id.toString() === key || friendee.id.toString() === key) {
            sockets[key].emit('add friend send request', JSON.stringify({friender, friendee}));
          }
        }
        res.end('Friend request sent');
      } else {
        res.end('Something went wrong when submitting friend request');
      }
    });
  });

  router.post('/acceptfriendrequest', (req, res) => {
    var friender = req.user;
    var friendee;
    db.getUser({id: req.body.friendId}).then((user) => {
      friendee = user;
      return db.addFriend(friender.id, friendee.id, 'accept')
    }).then(() => {
      for (var key in sockets) {
        if (friender.id.toString() === key || friendee.id.toString() === key) {
          sockets[key].emit('add friend accept request', JSON.stringify({friender, friendee}));
        }
      }
      res.end('Friend request accepted');
    });
  });

  router.post('/removefriend', (req, res) => {
    var unfriender = req.user;
    var unfriendee;
    db.getUser({id: req.body.friendId}).then((user) => {
      unfriendee = user;
      db.removeFriend(unfriender.id, unfriendee.id)
    }).then(() => {
      for (var key in sockets) {
        if (unfriender.id.toString() === key || unfriendee.id.toString() === key) {
          sockets[key].emit('remove friend', JSON.stringify({unfriender, unfriendee}));
        }
      }
      res.end('Friend successfully removed');
    });
  });

  router.get('/*', (req, res) => {
    res.end();
  });

  return router;
};