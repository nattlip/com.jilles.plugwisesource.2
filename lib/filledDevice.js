"use strict";

//const libClass = require('./libClass.js');
//const path = require('path');
const util = require('util');
const Homey = require('homey');
//const Fdevice = require('../lib/filledDevice.js');

class filledDevice {

    constructor(data, driver, capabilities, virtualClass) {



        //this.filename = path.basename(__filename)
        //this.dirname = path.basename(__dirname);



        //Homey.app.log(`filled device ${util.inspect(Homey,true,0) }`)

        Homey.app.log(`filled device ${util.inspect(Homey.dir, true, 0)}`);

        //this.debug = true;//  to set debug on or off
        //this.lib = new libClass();
        //this.lib.log = this.lib.log.bind(this);

        //this.lib.log(` ${this.constructor.name}  is this. `);
        //this.debug = true
        //this.lib.log(` dir   ${this.dirname}  file ${this.filename} `);


        //let absolutePath = path.resolve("filledDevice.js");
        //this.lib.log(` ${this.absolutePath}  absolutepath. `);

        //this.lib.log('module.filename filleddevice', module.filename)

        //this.lib.log(`app manifest      ${util.inspect(Homey.app.manifest,true,null)}                   ` )
        //  this.icon = '../drivers/X10/assets/onoff.svg'
        // this.icon = './X10/assets/onoff.svg'
        //this.icon = "/drivers/X10/assets/onoff.svg"
        //  this.icon = `rivers/X10/assets/onoff.svg`

        //  this.icon = 'onoff.svg'

        //this.icon = "/assets/icons/onoff.svg" 

        // relative to assets
        let iconPath = `/icons/`;

        
            this.icon = iconPath + 'onoff.svg';

        if (virtualClass !== 'none') { this.virtualClass = virtualClass; }
       
       
        this.driver = driver,
        this.data = data;// = devicedata
        this.rx = [];
        this.capabilities = capabilities;
        this.capability = {};
        this.capability = Object.assign(this.capability, this.capabilities.forEach(c => this.capability[c] = false));
        this.settings = { id: data.id };












    }







}

module.exports = filledDevice;