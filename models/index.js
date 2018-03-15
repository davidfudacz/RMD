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
    },
    set(date) {
      let newDate = new Date(date);
      newDate.setHours(36);//new Date on line 25 makes this off by a day, this fixes it...
      this.setDataValue('dateOfBirth', newDate)
    }
    
  },
}, {
  getterMethods: {
    prettyDOB: function () {

      let birthday = new Date(this.getDataValue('dateOfBirth'));
      birthday.setHours(36);//SAME THING HERE AS IN THE SETTER FOR BIRTHDAY
      

      let MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      
      let day = birthday.getDate();//SOMETHING GOING ON WITH NEW DATE THAT MAKES THE DATE OFF BY 1
      let year = birthday.getFullYear();
      let month = birthday.getMonth();
      return `${MONTHS[month]} ${day}, ${year}`;
    },
    firstLast: function () {
      return this.firstName + ' ' + this.lastName;
    },
    fullName: function () {
      return this.firstName + ' ' + this.middleName + ' ' + this.lastName;
    },
    age: function () {
        let birthDate = this.getDataValue('dateOfBirth');
        birthDate = new Date(birthDate);
        let nowDate = new Date();
    
        var years = (nowDate.getFullYear() - birthDate.getFullYear());
    
        if (nowDate.getMonth() < birthDate.getMonth() || 
            nowDate.getMonth() == birthDate.getMonth() && nowDate.getDate() < birthDate.getDate()+1) {
            years--;
        }
    
        return years;
    
    }
  }
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
    unique: true,
    validate: {
      isEmail: true,
    }
  },
});

const PhoneOrEmailTypeName = db.define('phoneOrEmailTypeName', {
  name: {
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

Contact.belongsToMany(PhoneNumber, {as: 'phoneNumbers', through: 'ContactPhone'});
PhoneNumber.belongsToMany(Contact, {as: 'contacts', through: 'ContactPhone'});
Contact.belongsToMany(Address, {as: 'Addresses', through: 'ContactAddress'});
Address.belongsToMany(Contact, {as: 'contacts', through: 'ContactAddress'});
Email.belongsTo(Contact);
Contact.hasMany(Email);
PhoneNumber.hasOne(PhoneOrEmailTypeName);
// Email.hasOne(PhoneOrEmailTypeName);
// Relationship.belongsTo(RelationshipType);
Event.belongsTo(Contact)
Contact.hasMany(Event);
Contact.belongsToMany(Contact, {as: 'Children', through: 'contactChildren'});
Contact.belongsToMany(Contact, {as: 'Parents', through: 'contactParents'});
Contact.belongsTo(Contact, {as: 'Spouse'});
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
