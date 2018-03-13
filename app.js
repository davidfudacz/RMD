'use strict'
const Sequelize = require('sequelize');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const app = express();
const routes = require('./routes');
const models = require('./models');
const seeder = require('./seeders/20180311184332-rmd-seed');

const queryInterface = models.db.getQueryInterface();


const pg = require('pg');

models.db.sync({force: true})
.then(function () {
    return seeder.up(queryInterface,Sequelize);
})
.then(function () {
    console.log('All tables created!');
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error.bind(console));




const env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);

nunjucks.configure('views',{ noCache: true });


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.use(routes);
app.use((err,req,res,next) => {
    res.status(500).send(err);
})

