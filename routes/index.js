'use strict'
const express = require('express');
const router = express.Router();
const models = require('../models');
const posts = require('./posts');
const gets = require('./gets');


router.use(gets);
router.use(posts);

module.exports = router;


