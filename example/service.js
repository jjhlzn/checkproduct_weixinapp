

class Service {
  constructor() {
   this.isTest = true;
   this.isLocal = false;
   if (this.isLocal) {
     this.http = "http";
     this.host = "localhost";
     this.port = 16623;
     this.prefix = '.aspx'
   } else {
    if (this.isTest) {
      this.http = "http";
      this.host = "test2.hengdianworld.com";
      this.port = 3003;
      this.prefix = '.aspx'
    } else {
      this.http = "http";
      this.host = "10.211.55.3";
      this.port = 80;
      this.prefix = '.aspx'
    } 
   }
    
  }
   loginUrl() {
     return `${this.http}://${this.host}:${this.port}/login${this.prefix}`
   }

   uploadFileUrl() {
     return `${this.http}://${this.host}:${this.port}/upload${this.prefix}`
   }

   checkProductUrl() {
     return `${this.http}://${this.host}:${this.port}/checkproduct${this.prefix}`
   }

   getNotCheckListUrl() {
     return `${this.http}://${this.host}:${this.port}/getnotchecklist${this.prefix}`
   }

   getCheckListUrl() {
     return `${this.http}://${this.host}:${this.port}/getchecklist${this.prefix}`
   }

   getCheckItemUrl() {
     return `${this.http}://${this.host}:${this.port}/getcheckitem${this.prefix}`
   }

   getCheckFileUrl() {
     return `${this.http}://${this.host}:${this.port}/getcheckfile${this.prefix}`
   }

   getCheckImagesUrl() {
     return `${this.http}://${this.host}:${this.port}/getcheckimages${this.prefix}`
   }

   getCheckImageUrl(filename) {
     return `${this.http}://${this.host}:${this.port}/uploads/${filename}`
   }
}


module.exports = {
  Service: new Service()
}
