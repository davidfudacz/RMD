'use strict'
const express = require('express');
const router = express.Router();
const posts = require('./posts');
const contacts = require('./contacts');
const models = require('../models');



router.use('/contacts',contacts);

router.get('/', function (req,res,next) {
  res.render('index',{title:``});
});

module.exports = router;


