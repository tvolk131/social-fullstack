var router = require('express').Router();

const passport = require('passport');

router.get('/messages', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup'
}), (req, res) => {
  console.log('USER: ' + res.user);
  res.end();
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