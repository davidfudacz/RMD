'use strict'
const express = require('express');
const router = express.Router();
const models = require('../models');


router.post('/',function (req,res,next) {
  res.render('index',{title:''});
})

module.exports = router;