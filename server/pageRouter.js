var router = require('express').Router();

const passport = require('passport');

var isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', isLoggedIn);

router.post('/login', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup'
}));

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;