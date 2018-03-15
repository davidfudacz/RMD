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
  m.PhoneOrEmailTypeName.findAll()
    .then(types => {
      res.render('inputInfo',{
        types: types
      });

    })
  
})

router.get('/contacts/:id/edit', function (req,res,next) {
  const phoneOrEmailTypesPromise = m.PhoneOrEmailTypeName.findAll();
  const contactPromise = m.Contact.findById(req.params.id);

  Promise.all([phoneOrEmailTypesPromise,contactPromise])
    .then(promiseArray => {
      let types = promiseArray[0];
      let contact = promiseArray[1];
      res.render('inputInfo',{
        contact: contact,
        types: types,
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