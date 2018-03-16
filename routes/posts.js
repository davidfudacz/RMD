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
  
    const email = m.Email.create({
      emailAddress: contactObj.email,
    })

    const contact = m.Contact.create({
        firstName: contactObj.firstName,
        lastName: contactObj.lastName,
        dateOfBirth: contactObj.dateOfBirth,
    })
    Promise.all([email,contact])
      .then(arr => {
        let email = arr[0];
        let contact = arr[1];
        return email.setContact(contact);
      })
      .then(() => {
        console.log('Added email');
        res.redirect('/contacts');
      })
      .catch(console.error.bind(console));


  
}
)

module.exports = router;