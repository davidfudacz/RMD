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


router.get('/add/:id', (req,res,next) => {
  const contact = Contact.findById(req.params.id);
  const everyoneElse = Contact.findAll({
    where: {
      id: {
        $ne: req.params.id
      }
    },
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
    ],
  })
  const relationshipTypes = RelationshipType.findAll();

  Promise.all([contact,everyoneElse,relationshipTypes])
    .then(([contact,everyoneElse,relTypes]) => {
      res.render('addRelationships', {
        contact: contact,
        everyoneElse: everyoneElse,
        relTypes: relTypes,
      });
    })
    .catch(next);
})


router.post('/add/:id', (req,res,next) => {

  const contact = Contact.findById(req.params.id);
  const target = Contact.findById(req.body.contact);
  const relationshipType = RelationshipType.findById(req.body.relationship);

  Promise.all([contact,target,relationshipType])
    .then(([contact,target,relType]) => {
      switch (relType.singular) {
        case 'Child': {
          Promise.all([
            contact.addChild(target),
            target.addParent(contact)
          ])
        };
          break;
        case 'Parent': {
          Promise.all([
            contact.addParent(target),
            target.addChild(contact)
          ])
        };
          break;
        case 'Friend': {
          Promise.all([
            contact.addFriend(target),
            target.addFriend(contact)
          ])
        };
          break;
        case 'Other': {
          Promise.all([
            contact.addOther(target),
            target.addOther(contact)
          ])
        };
          break;
        case 'Relative': {
          Promise.all([
            contact.addRelative(target),
            target.addRelative(contact)
          ])
        };
          break;
        case 'Sibling': {
          Promise.all([
            contact.addSibling(target),
            target.addSibling(contact)
          ])
        };
          break;
      }
    })
      .then(() => {
        res.redirect('/contacts/'+req.params.id);
      })
      .catch(next);
  
})


router.post('/addSpouse/:id', (req,res,next) => {
  const spouse = Contact.findById(req.body.spouseId);
  const contact = Contact.findById(req.params.id);

  Promise.all([spouse,contact])
    .then(([spouse,contact]) => {
      contact.setSpouse(spouse);
      spouse.setSpouse(contact);
      res.redirect('/contacts/'+req.params.id);
    })
    .catch(next);
  


})

module.exports = router;