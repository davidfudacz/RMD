'use strict'
const express = require('express');
const router = express.Router();
const m = require('../models');


router.post('/contacts/edit',function (req,res,next) {
  const contact = req.body;
  m.Contact.findOrCreate({
    where: contact,
  })
    .spread((contact, wasCreated) => {
      if (!wasCreated) {
        console.log('found an existing user')
      }
      else {
        console.log('created a new user');
      }
    })
    .then(contact => {
      res.redirect('/contacts')
    })
    .catch(next)

})

module.exports = router;