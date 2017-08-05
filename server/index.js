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
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions


app.use('/api', apiRouter);
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

io.on('connection', (socket) => {
  console.log('A user has connected');
  socket.cookie = socket.handshake.headers.cookie;
  socket.on('disconnect', () => {
    console.log('A user has disconnected');
  })
});