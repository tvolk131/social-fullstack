var router = require('express').Router();

const passport = require('passport');

router.get('/messages', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup'
}), (req, res) => {
  console.log('USER: ' + res.user);
  res.end();
});

router.get('/*', (req, res) => {
  res.end();
});

module.exports = router;