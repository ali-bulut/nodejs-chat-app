const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  if(!req.user){
    res.render('index', { title: 'ChatDad' }); 
  }
  else{
    res.redirect('/chat')
  }
});

module.exports = router;
