const Homey = require('homey');
const util = require('util');





class circleDevice extends Homey.Device {


    // this method is called when the Device is inited
    //#region onInit


   

    


    onInit() {


       



        this.name = this.getName()
        this.log(`device init ${this.name}`);
        this.log('device name:', this.name);
        this.class = this.getClass();
        this.log('homey class name:', this.class);
        this.driver = this.getDriver().id
        this.log(`driver name id `, this.driver)
        this.log(`node driver classname in file `, this.getDriver().constructor.name);
        // this.log(`driver `, this.inspect(this.getDriver()))


        this.data = this.getData();
        this.log(`device data     ${util.inspect(this.data)} `)


        this.settings = this.getSettings();

        this.log(`this settings ${util.inspect(this.settings)}`)



        this.onCapabilityOnoff = (value, opts, callback) => {

            // ... set value to real device
            this.log(`value send onff   ${value} `)




            //  signal.emit('sendCommand', sendCommand)
            this.log(` sendcommand onoff value`)

            let plugwiseid = this.data.plugwiseid
            this.sendCommandToPlugwise('switch', plugwiseid, value)

            // Then, emit a callback ( err, result )
            callback(null);
            // or, return a Promise
            return Promise.reject(new Error('Switching the device failed!'));
        }

        this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this))

    } // end oninit

    onSettings(oldSettingsObj, newSettingsObj, changedKeysArr, callback) {


        this.log(`oldSettingsObj      ${util.inspect(oldSettingsObj)}          `)
        this.log(` newSettingsObj     ${util.inspect(newSettingsObj)}          `)
        this.log(` changedKeysArr     ${changedKeysArr}          `)





        if (changedKeysArr.includes(`locked`)) {


            this.log(`if locked changedkeyarray entered    ${newSettingsObj.locked}          `)

            let plugwiseid = this.data.plugwiseid

            this.sendCommandToPlugwise('lock', plugwiseid, newSettingsObj.locked)



        }

        // run when the user has changed the device's settings in Homey.
        // changedKeysArr contains an array of keys that have been changed

        // always fire the callback, or the settings won't change!
        // if the settings must not be saved for whatever reason:
        // callback( "Your error message", null );
        // else
        callback(null, true);
    }  // end onsettings



    updateCapabilitiesCircle(HD) {




        if (this.driver === 'circle') {

            this.log(`this is device with driver id  ${this.getDriver().id}`);
            this.log('info from circle device HD  ', HD);

          //  this.log(`capabilitiesObj  ${util.inspect(this.capabilitiesObj.onoff)}`);



            if (HD.realstate === 'unknown') { this.setUnavailable("unavailble message jilles"); }
            else { this.setAvailable(); }





            this.setCapabilityValue(`onoff`, HD.onoff)
                .then(result => {
                    this.log(`result setCqpabiltyValue onoff)     ${result} `);
                })
                .catch(err => {
                    this.log(`errorsetCapabiltyValue onoff ${ err}`);
                });
            this.setCapabilityValue(`measure_power`, HD.measure_power);
            this.setCapabilityValue(`meter_power`, HD.meter_power);
        }
    }

    /// send command to plugwise
    sendCommandToPlugwise(modus, id, onoff) {


        this.log('479 sendcmmand with plugwiseid  modus' + modus + '   id   ' + id + '   and    command   ' + onoff);



        let command = '';
        if (onoff === true) {
            command = 'on';
        }
        else if (onoff === false) {
            command = "off";
        }



        this.log('479 sendcmmand  modus ' + modus + 'with plugwiseid   ' + id + ' and    command   ' + onoff);



        this.log('commandpath = /api/actions.html?option=' + modus + command + '&id=' + id)


        // https://knowledge.zomers.eu/plugwise/Pages/Extract-actual-information-from-Plugwise.aspx

        let path = '/api/actions.html?option=' + modus + command + '&id=' + id

        //Homey.app.
        //self.reqserver = function (ip, port, path, method, username, password) { 
        Homey.app.reqserver(Homey.app.serverip, Homey.app.serverport, path, Homey.app.servermethod, Homey.app.serverusername, Homey.app.serverpassword);







    }


}

module.exports = circleDevice