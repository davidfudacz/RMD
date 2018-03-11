class Contact {
  
  constructor (firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName ? lastName : '-Unknown-'; 
    this.email = []
    this.phone = [];
    this.addresses = [];
    this.relationships = {
      spouse: [],
      children: [],
      parents: [],
      siblings: [],
      relatives: [],
      other: [],
    }
    this.dateAdded = new Date();
    this.events = [];

  }

  addAddress (type,street,street2,city,state,zip) {
  
    this.addresses.push({
      'type': type,
      'street': street,
      'street2': street2,
      'city': city,
      'state': state,
      'zip': zip,
    });

  }

  addEmail (type,email) {
  
    this.email.push({
      'type': type,
      'email': email,
    });

  }

  addPhone (type,phone) {
  
    this.phone.push({
      'type': type,
      'phone': phone,
    });

  }
  
  printPhone () {
    let printout = ''
    for (let i = 0; i < this.phone.length; i++) {
      let output = Object.values(this.phone[i]);
      
      printout += '\n  ';
      printout += output[0].toString()[0].toUpperCase();
      printout += output[0].slice(1).toString();
      
      let formattedPhone = '';
      formattedPhone += output[1].slice(0,3).toString();
      formattedPhone += '-';
      formattedPhone += output[1].slice(3,6).toString();
      formattedPhone += '-';
      formattedPhone += output[1].slice(6).toString();
      
      printout += `: ${formattedPhone}`;
    }
    
    return printout;
  }
  
  printEmail () {
    let printout = ''
    for (let i = 0; i < this.email.length; i++) {
      let output = Object.values(this.email[i]);
      
      printout += '\n  ';
      printout += output[0].toString()[0].toUpperCase();
      printout += output[0].slice(1).toString();
      printout += ': ' + output[1].toString();
    }
    
    return printout;
  }
  
  printAddress () {
    let printout = ''
    for (let i = 0; i < this.addresses.length; i++) {
      let output = Object.values(this.addresses[i]);
      let street = output[1].toString();
      let street2 = output[2].toString();
      let city = output[3].toString();
      let state = output[4].toString();
      let zip = output[5].toString();
      
      printout += '\n  ';
      printout += output[0].toString()[0].toUpperCase();
      printout += output[0].slice(1).toString();
      printout += `: 
    ${street}`
      if (street2) printout += `
    ${street2}`;
      printout += `
    ${city}, ${state} ${zip}`;
    }
    
    return printout;
    
  }
  
  printRelationships () {
    let relationshipsArray = Object.entries(this.relationships);
    // console.log(this.relationships);
    // if there are relationships, start printing them
    if (relationshipsArray.length) {
      let printout = `
  `;
      let count = 0;
      // Each elem is an array of length 2 with type of relationship and an array of contacts
      relationshipsArray.forEach(elem => {
        count++;
        let contactArray = elem[1];
        if (contactArray.length) {
          // Each elem below is the contact object
          printout +=  `${elem[0].toString()[0].toUpperCase()}${elem[0].slice(1)}: `;
          for (let i = 0; i < contactArray.length; i++) {
            let contact = contactArray[i];
            printout += contact.firstName + " " + contact.lastName;
            if (contactArray.length -1 !== i) {
              printout += ', ';
            }

          }
          
          if (contactArray.length -1 !== count) {
            printout += `
  `;
          }
        }
      });
      return printout;
    }
    

  }

  printContact () {
    console.log(
      
`${this.firstName} ${this.lastName}
Phone: ${this.printPhone()}

Email: ${this.printEmail()}

Birthday: ${this.printBirthday()}

Age: ${this.age}

Events: ${this.printEvents()}

Address: ${this.printAddress()}

Relationships: ${this.printRelationships()}`);

  }

  addRelationship (existingContact, relation, firstName, lastName) {
    let newPerson;
    if (!existingContact) {
    newPerson = new Contact (firstName, lastName);
    } else newPerson = existingContact;

    switch (relation) {
      case 'child':
        if (newPerson.lastName === '-Unknown-') {
          newPerson.lastName = this.lastName;
        }
        if (this.relationships.children.indexOf(newPerson) === -1){
          this.relationships.children.push(newPerson);
          newPerson.addRelationship(this,'parent');
        }
        break;
      case 'spouse':
        if (newPerson.lastName === '-Unknown-') {
          newPerson.lastName = this.lastName;
        }
        if (this.relationships.spouse.indexOf(newPerson) === -1){
          this.relationships.spouse.push(newPerson);
          newPerson.addRelationship(this,'spouse');
        }
        
        function addSpouseToRelatives () {
          // run through each child, sibling and parent, add spouse to those contacts as a relative.
          let relationshipsArray = Object.entries(this.relationships);

          if (relationshipsArray.length) {

            // Each elem is an array of length 2 with type of relationship and an array of contacts
            relationshipsArray.forEach(elem => {
              
              let identifier = elem[0];
              let contactArray = elem[1];

              if (identifier === 'siblings' || identifier === 'parents' || identifier === 'children') {
                
                for (let i = 0; i < contactArray.length; i++) {
                  let contact = contactArray[i];
                  contact.addRelationship(newPerson,'relative');
                }
              }
            });
          }
        }
        addSpouseToRelatives.call(this);



        break;
      case 'parent':
        if (this.relationships.parents.indexOf(newPerson) === -1){
          this.relationships.parents.push(newPerson);
          newPerson.addRelationship(this,'child');
        }
        break;
      case 'sibling':
        if (this.relationships.siblings.indexOf(newPerson) === -1){
          this.relationships.siblings.push(newPerson);
          newPerson.addRelationship(this,'sibling');
        }
        break;
      case 'relative':
        if (this.relationships.relatives.indexOf(newPerson) === -1){
          this.relationships.relatives.push(newPerson);
          newPerson.addRelationship(this,'relative');
        }
        break;
      
      default:
        if (this.relationships.other.indexOf(newPerson) === -1){
          this.relationships.other.push(newPerson);
          newPerson.addRelationship(this,'other');
        }

    }

  }

  addBirthday(month,day,year) {
    let yearExists = true;
    if (!year) {
      yearExists = false;
      year = 1801;
    } 
    this.birthday = new Date(year,month,day);
    //calculate the age of the Contact
    if (yearExists) {
      function howManyLeapDays (birthday) {
        //get the current year
        let thisYear = new Date();
        thisYear = thisYear.getFullYear();
        //create an array of all the leap years since 1900
        let leapYears = [];
        for (var i = 1900; i < thisYear; i += 4) {
          if (!(i%100 === 0 && i%400 !== 0)) {
            leapYears.push(i);
          }
        }

        let withoutLeaps = Date.now() - birthday;
        let birthYear = birthday.getFullYear();

        //work backward through that array and increment a count of leap days
        let leapDays = 0;
        while (birthYear < leapYears[leapYears.length-1]) {
          leapDays++;
          leapYears.pop();
        }

        return leapDays;

      }
      let leapDaysInMil = howManyLeapDays(this.birthday) * 86400000;
      let leapDayOffset = (Date.now() - this.birthday) - leapDaysInMil;
      let age = (leapDayOffset / 31536000000);
      this.age = Math.floor(age);
    }
  }

  printBirthday() {

    if (this.birthday) {
    
      let MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      
      let day = this.birthday.getDate();
      let year = this.birthday.getFullYear();
      let month = this.birthday.getMonth();
      if (year === 1801) year = '';
      else year = ', '+year;
      
      return `${MONTHS[month]} ${day}${year}`;
    } else return 'Unknown';
  }

  addEvent (str, date) {
    let timestamp = date || new Date();
    this.events.push({'timestamp':timestamp, 'event': str});
  }

  printEvents () {
    let output = '';
    this.events.forEach(elem => {
      output += `${elem.timestamp}: ${elem.event}
`;
    })
    return output;
  }





}

const Dave = new Contact('Dave','Fudacz');
Dave.addPhone('cell','7733685517');
Dave.addEmail('main','davidfudacz@gmail.com');
Dave.addEmail('work','dave@dmfwoodworks.com');
Dave.addAddress('home','2800 N Lake Shore Drive','Unit 2101','Chicago', 'IL','60657');
Dave.addAddress('work','6855 W 65th St','','Chicago', 'IL','60638');
Dave.addPhone('home', '7732330025');
Dave.addBirthday(1,28,1987);
Dave.addEvent('went to school');

const Ed = new Contact('Ed','Fudacz');
Ed.addPhone('cell','7733685517');
Ed.addEmail('main','davidfudacz@gmail.com');
Ed.addEmail('work','dave@dmfwoodworks.com');
Ed.addAddress('home','2800 N Lake Shore Drive','Unit 2101','Chicago', 'IL','60657');

Ed.addBirthday(0,15,1982);
Ed.addRelationship(Dave,'sibling')
Ed.addRelationship(false,'spouse','Ashley','Jensen-Fudacz')

Dave.addRelationship(false, 'parent','Joe','Fudacz');
Dave.addRelationship(false, 'parent','Monica','Fudacz');
Dave.addRelationship(Ed, 'sibling');
Dave.addRelationship(false, 'sibling','Laura','Fudacz');
Dave.addRelationship(false, 'child','Roark');
Dave.addRelationship(false, 'spouse','Cheryl','Catrini');


Dave.printContact();
Ed.printContact();