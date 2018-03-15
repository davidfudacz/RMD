'use strict'
const express = require('express');
const router = express.Router();
const m = require('../models');


router.post('/contacts/edit/:id',function (req,res,next) {
  const contactId = req.params.id;
  const contactObj = req.body;
  
  m.Contact.findById(contactId)
    .then((contact) => {
      contact.update(contactObj);
      console.log('updated', contact.firstName)
    })
    .then(() => {
      
      res.redirect('/contacts')
    })
    .catch(next)

})

router.post('/contacts/edit',function (req,res,next) {
  const contact = req.body;
  console.log(contact);
  m.Contact.findOrCreate({
    where: contact,
  })
    .then(() => {
      res.redirect('/contacts')
    })
    .catch(next)

})

module.exports = router;