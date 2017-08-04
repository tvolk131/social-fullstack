var router = require('express').Router();

const passport = require('passport');

router.post('/login', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup'
}));

module.exports = router;