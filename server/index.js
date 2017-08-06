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
var sessionStore = sessionstore.createSessionStore();

// Get models
var models = require('../database/models/index.js');

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

// Setup passport and sessions
app.use(session({
  store: sessionStore,
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions

var sockets = {};

app.use('/api', apiRouter(sockets));
app.use('/', pageRouter); // Middleware redirector

// Serve static files
app.get('/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/bundle.js'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'));
});


app.post('/repos', (req, res) => {
  res.end();
});

app.get('/repos', (req, res) => {
  res.end();
});


let port = process.env.PORT || 8080;

var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(port, () => {
  console.log('Listening on port ' + port);
});

io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'thisisasecret',
  store: sessionStore,
  passport: passport,
  cookieParser: cookieParser
}));

// TODO - Allow for any user to have multiple open sockets
io.on('connection', (socket) => {
  console.log('A user has connected');
  if (socket.request.user.id) {
    sockets[socket.request.user.email] = socket;
  }
  socket.on('disconnect', () => {
    console.log('A user has disconnected');
    if (socket.request.user.id) {
      delete sockets[socket.request.user.id];
    }
  });
  socket.on('message', (messageString) => {
    var message = JSON.parse(messageString);
    db.saveMessage(socket.request.user.email, message.username, message.text).then((data) => {
      // Key is an email
      for (var key in sockets) {
        if (socket.request.user.email === key || message.username === key) {
          sockets[key].emit('message', JSON.stringify(data));
        }
      }
      return data;
    });
  });
});