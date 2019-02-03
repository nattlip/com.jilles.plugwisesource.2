'use strict';


const util = require('util');
const Homey = require('homey');

class circleDriver extends Homey.Driver {



    onInit() {

        this.log(`init driver id :   ${this.id}    `);

        this.homeyDevices = [];

        if (this.id === `circle`) {

            this.log(`init driver id :   ${this.id}    `);

            
           

            this.devices = this.getDevices();
          //  this.log(`devices from getdevices  ${util.inspect(this.devices)} `);
        }
    }








    onPairListDevices(data, callback) {

      

        this.log(`pairing started  `);

            callback(null, this.homeyDevices);

     




    }

}











module.exports = circleDriver