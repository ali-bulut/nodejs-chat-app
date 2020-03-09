const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  //db'deki giriş yapan user datasını döner
  res.render('chat', {user:req.user});
});

module.exports = router;
