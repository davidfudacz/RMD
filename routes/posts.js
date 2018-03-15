'use strict'
const express = require('express');
const router = express.Router();
const m = require('../models');


router.post('/contacts/edit/:id', function (req, res, next) {
  const contactId = req.params.id;
  const contactObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
  }

  const emailPromise = m.Email.create({
    emailAddress: req.body.email,
  })

  m.Contact.findById(contactId)
    .then(contact => {
      return Promise.all([emailPromise,contact.update(contactObj)])
    })
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

router.post('/contacts/edit', async function (req, res, next) {
  const contactObj = req.body;
  try {
    const email = await m.Email.create({
      emailAddress: contactObj.email,
    })

    const contact = await m.Contact.create({
        firstName: contactObj.firstName,
        lastName: contactObj.lastName,
        dateOfBirth: contactObj.dateOfBirth,
    })
    const setEmail = await email.setContact(contact);
  }
  catch console.error('something happened')
    console.log('Added email');
    res.redirect('/contacts');
  
})

module.exports = router;