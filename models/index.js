'use strict'
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/------DATABASE-NAME-HERE------');

const TableItem = db.define('tableItems', {
  columnNameInteger: {
    type: Sequelize.INTEGER, 
    allownull: false,
  },
  columnNameString: {
    type: Sequelize.STRING, 
    allownull: false,
  },
})


module.exports = {
  db,
  TableItem,
}
