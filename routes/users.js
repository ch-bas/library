var express = require('express');
var X = require('../models/category');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/blabla', function(req, res, next) {
    
         
  res.render('new.twig');
 
});

router.post('/blabla', function(req, res, next) {

    var c = new X({libel: req.body.lib});
      c.save();
    
  res.redirect('/livre');
});


module.exports = router;
