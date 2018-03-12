'use strict'
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/RMD');

const Contact = db.define('contacts', {
  firstName: {
    type: Sequelize.STRING, 
    allownull: false,
  },
  lastName: {
    type: Sequelize.STRING, 
    allownull: false,
  },
  middleName: {
    type: Sequelize.STRING, 
    allownull: true,
  },
  dateOfBirth: {
    type: Sequelize.DATEONLY, 
    allownull: true,
    validate: {
      isDate: true,
    }
  },
});

const Address = db.define('addresses', {
  addressType: {
    type: Sequelize.INTEGER, 
    allownull: false,
  },
  lineOne: {
    type: Sequelize.STRING, 
    allownull: false,
  },
  lineTwo: {
    type: Sequelize.STRING, 
    allownull: true,
  },
  city: {
    type: Sequelize.STRING, 
    allownull: false,
  },
  state: {
    type: Sequelize.INTEGER, 
    allownull: false,
  },
  zip: {
    type: Sequelize.INTEGER, 
    allownull: false,
    validate: {
      isNumeric: true,
    }
  },
});

const State = db.define('states', {
  long: {
    type: Sequelize.STRING, 
    allownull: false,
  },
  short: {
    type: Sequelize.STRING, 
    allownull: false,
  },
});

const Country = db.define('countries', {
  long: {
    type: Sequelize.STRING, 
    allownull: false,
  },
  short: {
    type: Sequelize.STRING, 
    allownull: false,
  },
});

const PhoneNumber = db.define('phoneNumbers', {
  number: {
    type: Sequelize.STRING, 
    allownull: false,
  },
});

const Email = db.define('emails', {
  emailAddress: {
    type: Sequelize.STRING, 
    allownull: false,
  },
});

const PhoneOrEmailTypeName = db.define('phoneOrEmailTypeName', {
  type: {
    type: Sequelize.STRING, 
    allownull: false,
  },
});

const RelationshipType = db.define('relationshipTypes', {
  singular: {
    type: Sequelize.STRING, 
    allownull: false,
  },
  plural: {
    type: Sequelize.STRING, 
    allownull: false,
  },
});

const Relationship = db.define('relationships', {
  target: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Event = db.define('events', {
  date: {
    type: Sequelize.DATEONLY, 
    allownull: false,
    validate: {
      isDate: true,
    }
  },
  event: {
    type: Sequelize.STRING, 
    allownull: false,
  },
});

Contact.belongsToMany(PhoneNumber, {as: 'PhoneNum', through: 'ContactPhone'});
PhoneNumber.belongsToMany(Contact, {through: 'ContactPhone'});
Contact.belongsToMany(Address, {as: 'Address', through: 'ContactAddress'});
Address.belongsToMany(Contact, {through: 'ContactAddress'});
Email.belongsTo(PhoneOrEmailTypeName);
PhoneNumber.belongsTo(PhoneOrEmailTypeName);
Relationship.belongsTo(RelationshipType);
Contact.hasMany(Email);
Contact.hasMany(Event);
Contact.hasMany(PhoneNumber);
Contact.belongsToMany(Contact, {as: 'Children', through: 'contactChildren'});
Contact.belongsToMany(Contact, {as: 'Parents', through: 'contactParents'});
Contact.belongsTo(Contact, {as: 'Spouse', through: 'contactSpouse'});
Contact.belongsToMany(Contact, {as: 'Siblings', through: 'contactSiblings'});
Contact.belongsToMany(Contact, {as: 'Relatives', through: 'contactRelatives'});
Contact.belongsToMany(Contact, {as: 'Others', through: 'contactOthers'});




module.exports = {
  db,
  Contact,
  Address,
  State,
  Country,
  PhoneNumber,
  Email,
  PhoneOrEmailTypeName,
  RelationshipType,
  Event,
}
