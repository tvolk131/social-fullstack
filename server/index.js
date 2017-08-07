const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const db = require('../database');
const url = require('url');
const env = require('dotenv').load();
const path = require('path');
const apiRouter = require('./apiRouter.js');
const cookieParser = require('cookie-parser');
const pageRouter = require('./pageRouter.js');
const sessionstore = require('sessionstore');
const passportSocketIo = require('passport.socketio');

// Get models
var models = require('../database/models/index.js');

// Create session store (needs explicit definition because of socket.io authentication)
var sessionStore = sessionstore.createSessionStore();

// Initialize passport strategy
require('../config/passport.js')(passport, models.users);

// Sync database
models.sequelize.sync().then(() => {
  console.log('Nice! Database looks fine.');
}).catch((err) => {
  console.log('Uh oh. something went wrong when updating the database.');
  console.error(err);
});

// Create app
let app = express();

// Setup body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Cookie parser
app.use(cookieParser());

var sockets = {};

app.use('/api', apiRouter(sockets)); // API router manages sensitive data and makes sure not to leak unauthorized user info
app.use('/', pageRouter); // Middleware redirector

// Serve static files - Since we are using React Router, there are only two files
app.get('/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/bundle.js'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'));
});

// Start server
let port = process.env.PORT || 8080;
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(port, () => {
  console.log('Listening on port ' + port);
});

// Setup passport and sessions for http and socket.io
app.use(session({
  store: sessionStore,
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions
io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'thisisasecret',
  store: sessionStore,
  passport: passport,
  cookieParser: cookieParser
}));

// Handle client socket connections and add any needed socket listeners
// TODO - Allow for any user to have multiple open sockets
io.on('connection', (socket) => {
  console.log('A user has connected');
  if (socket.request.user.id) {
    sockets[socket.request.user.id] = socket;
  }
  socket.on('disconnect', () => {
    console.log('A user has disconnected');
    if (socket.request.user.id) {
      delete sockets[socket.request.user.id];
    }
  });
  socket.on('message', (messageString) => {
    var message = JSON.parse(messageString);
    var userEmail = socket.request.user.email;
    var userId = socket.request.user.id;
    var otherUserId;
    var otherUserEmail = message.email;
    db.getUser({email: message.email}).then((user) => {
      otherUserId = user.dataValues.id;
    })
    .then(() => {
      return db.addMessage(userId, otherUserId, message.text);
    })
    .then((messageData) => {
      var message = JSON.parse(JSON.stringify(messageData.dataValues));
      message.sender = userEmail;
      message.recipient = otherUserEmail;
      return message;
    })
    .then((message) => {
      // Key is a user ID
      for (var key in sockets) {
        if (userId.toString() === key || otherUserId.toString() === key) {
          sockets[key].emit('message', JSON.stringify(message));
        }
      }
      return message;
    });
  });
});