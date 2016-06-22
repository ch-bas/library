module.exports = function(io) {
var os = require('os');

var express = require('express');
var Livre = require('../models/livre');
var X = require('../models/category');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next)
{
    Livre.find().populate('_category').exec(function(err,livres)
    {
    
    res.render('livre.twig', { curruser : req.user , livres : livres });
    });
  
});
 
router.get('/emp/:id', function(req, res, next) 
{
    Livre.findOneAndUpdate({"_id":req.params.id},{$set:{"disponible":false}}).exec(function(err,results)
     {
        Account.findOneAndUpdate({"_id":req.user._id},{$push:{"livres_emp":req.params.id}}).exec(function(err,result)
                                        {
         io.emit('status', 'Notification: '+os.hostname()+' a emprunté '+results.titre+' ' + new Date().toDateString());

        res.redirect('/');
        })
            

    });
});

router.get('/nahi/:id', function(req, res, next) 
{
    Livre.findOneAndUpdate({"_id":req.params.id},{$set:{"disponible":true}}).exec(function(err,results)
     {
        Account.findOneAndUpdate({"_id":req.user._id},{$pull:{"livres_emp":req.params.id}}).exec(function(err,result)
                                        {
         io.emit('status', 'Notification: '+result.username+' a emprunté '+results.titre+' ' + new Date().toDateString());

        res.redirect('/');
        })
            

    });
});


          
router.get('/new', function(req, res, next) 
{
    
          X.find().exec(function(err,cat)
        {
               
                res.render('newlivre.twig', { curruser : req.user ,cat:cat});

        });
});

router.post('/new', function(req, res, next) 
{

    var c = new Livre({titre: req.body.titre, description: req.body.desc , _category:req.body.cat,isbn: req.body.isbn , disponible: true});
      c.save();
    
  res.redirect('/livre');
});
 
return router;
};
