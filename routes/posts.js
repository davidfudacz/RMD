'use strict'
const express = require('express');
const router = express.Router();
const m = require('../models');


router.post('/contacts/edit/:id', function (req, res, next) {
  const contactId = req.params.id;
  const contactObj = req.body;

  m.Contact.findById(contactId)
    .then((contact) => {
      contact.update(contactObj);
    })
    .then(() => {
      res.redirect('/contacts')
    })
    .catch(next)

})

router.post('/contacts/edit', function (req, res, next) {
  const contactObj = req.body;
  var contactEmail = null;
  
  const emailPromise = m.Email.create({
    emailAddress: contactObj.email,
  })

  const contactPromise = m.Contact.create({
      firstName: contactObj.firstName,
      lastName: contactObj.lastName,
      dateOfBirth: contactObj.dateOfBirth,
  })

  Promise.all([emailPromise,contactPromise])
    .then((array) => {
      let email = array[0];
      let contact = array[1];
      return email.setContact(contact);
    })
    .then((email) => {
      console.log('Added email');
      res.redirect('/contacts');
    })
    .catch(next);

})

module.exports = router;