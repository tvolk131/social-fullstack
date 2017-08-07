var router = require('express').Router();

const passport = require('passport');

// Middleware function that will redirect unauthenticated users to
// login screen when trying to access a page that is using this
var isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

// Locks pages to only allow signed-in users to view
router.get('/', isLoggedIn);
router.get('/messages', isLoggedIn);

// Allows passport login on this page
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Allows passport signup on this page
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup'
}));

// Destroys current session when entering this page
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;