/* express - api */
const express = require('express');
const router = express.Router();

router.get('/api', function(req, res, next) {
  res.send('test');
});

module.exports = router;
