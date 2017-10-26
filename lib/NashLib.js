export class Nash {

  constructor(type) {
    this.generateconstants(type);
  }

  generateconstants(type) {
    switch ( type ) {
      case 'sheldon' :
      this.name = 'sheldon';
      this.fullname="Sheldon Cooper";
      this.age = 45;
      break;
      case 'rajesh' :
      default :
      this.name = 'rajesh';
      this.fullname = 'Rajesh Koothrapoly';
      this.age = 38;
    }
  }

  display(message) {
    let fullname = this.fullname;
    let age = this.age

    return fullname + "[" + age + "] says: " + message;
  }

}
