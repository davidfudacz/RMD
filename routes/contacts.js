'use strict'

const express = require('express');
const router = express.Router();
const {
  Contact,
  Address,
  State,
  Country,
  PhoneNumber,
  Email,
  PhoneOrEmailTypeName,
  RelationshipType,
  Event
} = require('../models');




router.get('/', function (req, res, next) {

  Contact.findAll({
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
    ],
  })
    .then(contactObjs => {
      res.render('index', {
        contacts: contactObjs,
      });
    })
    .catch(next);
});

router.get('/add', function (req, res, next) {
  PhoneOrEmailTypeName.findAll()
    .then(types => {
      res.render('inputInfo', {
        types: types
      });

    })

})

router.get('/:id/edit', function (req, res, next) {
  const phoneOrEmailTypesPromise = PhoneOrEmailTypeName.findAll();
  const contactPromise = Contact.findById(req.params.id, {
    include: [{ model: Email }]
  });


  Promise.all([phoneOrEmailTypesPromise, contactPromise])
    .then(promiseArray => {
      let types = promiseArray[0];
      let contact = promiseArray[1];
      let renderContact = {
        contact: contact,
      }
      renderContact.types = types;
      if (contact.emails[0]) {
        renderContact.email = contact.emails[0].emailAddress;
      }
      res.render('inputInfo', renderContact);
    })
    .catch(next);
});

router.get('/:id', function (req, res, next) {
  Contact.findById(req.params.id, {
    include: [{ model: Email }]
  })
    .then(contactObj => {
      let renderContact = {
        contact: contactObj,
      }
      if (contactObj.emails[0]) {
        renderContact.email = contactObj.emails[0].emailAddress;
      }
      res.render('contact', renderContact);
    })
    .catch(next);
});


router.post('/edit/:id', function (req, res, next) {
  const contactId = req.params.id;
  const emailType = req.body.emailType;
  console.log(req.body);
  const contactObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
  }

  const emailPromise = Email.create({
    emailAddress: req.body.email,
  })

  Contact.findById(contactId)
    .then(contact => {
      return Promise.all([emailPromise, contact.update(contactObj)])
    })
    .then((array) => {
      let email = array[0];
      let contact = array[1];
      return Promise.all([
        email.setEmailType(emailType),
        contact.addEmail(email)
      ]);
    })
    .then((email) => {
      console.log('Added email');
      res.redirect('/contacts');
    })
    .catch(next);

})

router.post('/edit', async function (req, res, next) {
  const contactObj = req.body;

  const email = Email.create({
    emailAddress: contactObj.email,
  })

  const contact = Contact.create({
    firstName: contactObj.firstName,
    lastName: contactObj.lastName,
    dateOfBirth: contactObj.dateOfBirth,
  })
  Promise.all([email, contact])
    .then(array => {
      let email = array[0];
      let contact = array[1];
      return Promise.all([
        email.setEmailType(emailType),
        contact.addEmail(email)
      ]);
    })
    .then(() => {
      console.log('Added email');
      res.redirect('/contacts');
    })
    .catch(console.error.bind(console));

})



module.exports = router;