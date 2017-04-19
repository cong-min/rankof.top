/* express - api */
const express = require('express');
const router = express.Router();

router.get('/api', (req, res, next) => {
  res.send('Rank of Top');
});

// 网易云音乐
require('./api/cloud-music')(router);

module.exports = router;
