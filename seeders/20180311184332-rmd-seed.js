'use strict';
const Sequelize = require('sequelize');

module.exports = {
  up: (m) => {
    
    m.Contact.bulkCreate([{
      firstName: 'Laura',
      lastName: 'Fudacz',
      middleName: 'Anne',
      dateOfBirth: '1983-06-08',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Joseph',
      lastName: 'Fudacz',
      middleName: 'Gerard',
      dateOfBirth: '1956-02-27',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Edward',
      lastName: 'Fudacz',
      middleName: 'Thomas',
      dateOfBirth: '1982-01-15',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Monica',
      lastName: 'Fudacz',
      middleName: 'Dunne',
      dateOfBirth: '1957-03-15',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Ashley',
      lastName: 'Jensen Fudacz',
      dateOfBirth: '1986-09-16',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'David',
      lastName: 'Fudacz',
      middleName: 'Michael',
      dateOfBirth: '1986-12-03',
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
    .then(() => {
      console.log('Inital Contacts created successfully!')
    })
    .catch(console.error.bind(console));

    m.PhoneOrEmailTypeName.bulkCreate([{
      name: 'home',
    },
    {
      name: 'work',
    },
    {
      name: 'mobile',
    }])
    .then(() => {
      console.log('Phone & Email types created successfully!')
    })
    .catch(console.error.bind(console));



    let ed = m.Contact.findById(3);
    let dave = m.Contact.findById(6);
    let laura = m.Contact.findById(1);
    let mom = m.Contact.findById(4);
    let dad = m.Contact.findById(2)
      .then((dad) => {
        console.log(dad.age)
      })

    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Contact', null, {});
  }
};
