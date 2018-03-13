'use strict'

const express = require('express');
const router = express.Router();
const m = require('../models');




router.get('/', function (req,res,next) {
  res.render('index',{title:``});
});

router.get('/contacts/', function (req,res,next) {

  m.Contact.findAll()
    .then(contactObjs => {
      res.render('index',{
        contacts: contactObjs
      });
    })
    .catch(next);
});

router.get('/contacts/edit', function (req,res,next) {
  res.render('edit');
});

router.get('/contacts/:id/edit', function (req,res,next) {
  console.log(req.params);
  m.Contact.findById(req.params.id)
    .then(contactObj => {
      console.log(`We're here`);
      res.render('edit',{
        contact: contactObj
      });
    })
    .catch(next);
});

router.get('/contacts/:id', function (req,res,next) {
  m.Contact.findById(req.params.id)
    .then(contactObj => {
      console.log(contactObj.dateOfBirth);
      res.render('contact',{
        contact: contactObj
      });
    })
    .catch(next);
});



module.exports = router;