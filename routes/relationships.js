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
      console.log(relTypes);
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
  const everyoneElse = Contact.findAll({
    where: {
      id: {
        $$ne: req.params.id
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
      console.log(relTypes);
      res.render('addRelationships', {
        contact: contact,
        everyoneElse: everyoneElse,
        relTypes: relTypes,
      });
    })
    .catch(next);
})

module.exports = router;