const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database');
const url = require('url');

let app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

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

