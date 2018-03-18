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
      if (!date) this.setDataValue('dateOfBirth', null);
      else {
        let newDate = new Date(date);
        newDate.setHours(36);//new Date on line 25 makes this off by a day, this fixes it...
        this.setDataValue('dateOfBirth', newDate)
      }
    },
    get() {
      let dob = this.getDataValue('dateOfBirth')
      if (dob) return dob;
      else return '';
    }
    
  },
}, {
  getterMethods: {
    prettyDOB: function () {
      let dob = this.getDataValue('dateOfBirth')
      if (!dob) return '';

      let birthday = new Date(dob);
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
      let birthDate = this.getDataValue('dateOfBirth')
      if (!birthDate) return '';
        birthDate = new Date(birthDate);
        let nowDate = new Date();
    
        var years = (nowDate.getFullYear() - birthDate.getFullYear());

    
        if (nowDate.getMonth() < birthDate.getMonth() || 
            nowDate.getMonth() === birthDate.getMonth() && nowDate.getDate() < birthDate.getDate()+1) {
            years--;
        }
        if (years < 2) {
          let months = (nowDate.getFullYear() - birthDate.getFullYear())*12;
          months += (nowDate.getMonth() - birthDate.getMonth());
          if ((nowDate.getDate() - birthDate.getDate()-1)<0) months--;
          return months+' Months';
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
    allownull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
    get() {
      let email = this.getDataValue('emailAddress');
      if (!email) return ''
      else return email;
    },
    set(email) {
      if (!email) this.setDataValue('dateOfBirth', null);
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
    get: function () {
      let firstLetter = this.getDataValue('singular').slice(0,1);
      let theRest = this.getDataValue('singular').slice(1);
      return firstLetter.toUpperCase() + theRest;
    }
  },
  plural: {
    type: Sequelize.STRING, 
    allownull: false,
    get: function () {
      let firstLetter = this.getDataValue('plural').slice(0,1);
      let theRest = this.getDataValue('plural').slice(1);
      return firstLetter.toUpperCase() + theRest;
    }
  },
});

const Relationship = db.define('relationships', {
  target: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Pet = db.define('pets', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM('cat','dog','bird','horse'),
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
  title: {
    type: Sequelize.STRING, 
    allownull: false,
  },
  description: {
    type: Sequelize.TEXT, 
    allownull: true,
  },
});

Contact.belongsToMany(PhoneNumber, {as: 'Phone Numbers', through: 'ContactPhone'});
Contact.belongsToMany(Address, {as: 'Addresses', through: 'ContactAddress'});
Contact.hasMany(Email, {as: 'Emails'});
PhoneNumber.belongsTo(PhoneOrEmailTypeName, {as: 'phoneType'});
Email.belongsTo(PhoneOrEmailTypeName, {as: 'emailType'});
Contact.hasMany(Event);
Contact.hasMany(Pet,{as: "Pets"});
Contact.belongsToMany(Contact, {as: 'Children', through: 'contactChildren'});
Contact.belongsToMany(Contact, {as: 'Parents', through: 'contactParents'});
Contact.belongsTo(Contact, {as: 'Spouse'});
Contact.belongsToMany(Contact, {as: 'Siblings', through: 'contactSiblings'});
Contact.belongsToMany(Contact, {as: 'Relatives', through: 'contactRelatives'});
Contact.belongsToMany(Contact, {as: 'Friends', through: 'contactFriends'});
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
