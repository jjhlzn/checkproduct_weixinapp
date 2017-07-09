

class Service {
  constructor() {
   this.http = "http";
   this.host = "localhost";
   this.port = 6035;
  }
   loginUrl() {
     return `${this.http}://${this.host}:${this.port}/login.aspx`
   }

   uploadFileUrl() {
     return `${this.http}://${this.host}:${this.port}/upload.aspx`
   }
}


module.exports = {
  Service: new Service()
}
