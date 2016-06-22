module.exports = function(io) {
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
 
/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user){
        Account.findOne({"_id":req.user._id}).populate('livres_emp').exec(function(err,livres)
                                                  { res.render('index.twig', { user : livres });           
                                                })
    }
    else
    {
    res.render('index.twig', { user : req.user });
    }
  
});
    
    router.post('/', function(req, res, next) {
    
        io.emit('status', 'Notification '+ req.user.email+ ' ' + new Date().toDateString());
        res.redirect('/');
    });

router.get('/register', function(req, res) {
  res.render('register.twig', { });
});

router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username, email: req.body.email, role:false
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register.twig', { account : account
      });
    }
    passport.authenticate('local')(req, res, function () {
        
        io.emit('status', 'Notification '+ req.user.email+ ' ' + new Date().toDateString());
      res.redirect('/');
    });
  });
});


router.get('/users', function(req,res){
	
	Account.find({}).exec(function(err,users){
    if(err) res.send('Error');
    res.render('users.twig', { title: 'users',users:users, curruser : req.user });
    
});
	
});

router.get('/users/:id', function(req,res){
	
	Account.findOne({"_id":req.params.id}).exec(function(err,user){
    if(err) res.send('Error');
    res.render('oneuser.twig', { title: 'user',user:user, curruser : req.user });
    
});
});

router.post('/users/:id',function(req,res){ 

Account.findOneAndUpdate({"_id" :req.params.id},{$set:{"username" : req.body.username,"email" : req.body.email}}).exec(function(err){
	if(err)
		res.send(err);
	else
	res.redirect('/users');
});



});


router.get('/login', function(req, res) {
  res.render('login.twig', { user : req.user });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


return router;
};
