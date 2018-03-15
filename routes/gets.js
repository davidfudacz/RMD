'use strict'

const express = require('express');
const router = express.Router();
const m = require('../models');




router.get('/', function (req,res,next) {
  res.render('index',{title:``});
});

router.get('/contacts/', function (req,res,next) {

  m.Contact.findAll({
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
    ],
  })
    .then(contactObjs => {
      res.render('index',{
        contacts: contactObjs,
      });
    })
    .catch(next);
});

router.get('/contacts/add', function (req,res,next) {
  res.render('inputInfo');
})

router.get('/contacts/:id/edit', function (req,res,next) {
  
  m.Contact.findById(req.params.id)
    .then(contactObj => {
      res.render('inputInfo',{
        contact: contactObj,
      });
    })
    .catch(next);
});

router.get('/contacts/:id', function (req,res,next) {
  m.Contact.findById(req.params.id,{
    include: [{model:m.Email}]
  })
    .then(contactObj => {
      let renderObj = {
        contact: contactObj,
     }
      if (contactObj.emails[0]) {
        renderObj.email = contactObj.emails[0].emailAddress;
      }
      res.render('contact',renderObj);
    })
    .catch(next);
});



module.exports = router;