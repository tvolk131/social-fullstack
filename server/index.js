const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const db = require('../database');
const url = require('url');
const env = require('dotenv').load();

// Get models
var models = require('../database/models/index.js');

// Sync database
models.sequelize.sync().then(() => {
  console.log('Nice! Database looks fine.');
}).catch((err) => {
  console.log('Uh oh. something went wrong when updating the database.');
});

// Create app
let app = express();

// Setup body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Setup passport and sessions
app.use(session({
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions

// Serve static files
app.use(express.static(__dirname + '/../client/dist'));


app.post('/repos', (req, res) => {
  res.end();
});

app.get('/repos', (req, res) => {
  res.end();
});


let port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});