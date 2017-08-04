var router = require('express').Router();

router.get('/messages', (req, res) => {
  res.end();
});

router.get('/*', (req, res) => {
  res.end();
});

module.exports = router;