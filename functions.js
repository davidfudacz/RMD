function Contact (firstName, lastName, email, phone) {
  this.firstName = firstName;
  this.lastName = lastName; 
  this.email = {'main': email};
  this.phone = {'main': phone};

}

Contact.prototype.addAddress = function(street,street2,city,state,zip) {
  this.address = {
    'street': street,
    'street2': street2,
    'city': city,
    'state': state,
    'zip': zip,
};
}

Contact.prototype.printAddress = function () {
  console.log(this.address.street + "\n" + this.address.city + ', ' + this.address.state + ' ' + this.address.zip)
};