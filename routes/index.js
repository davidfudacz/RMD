'use strict'
const express = require('express');
const router = express.Router();
const posts = require('./posts');
const contacts = require('./contacts');
const relationships = require('./relationships');
const models = require('../models');



router.use('/contacts',contacts);
router.use('/relationships',relationships);

router.get('/', function (req,res,next) {
  res.render('index',{title:``});
});

module.exports = router;


