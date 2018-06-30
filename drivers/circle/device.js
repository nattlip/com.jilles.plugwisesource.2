const Homey = require('homey');
const util = require('util');





class circleDevice extends Homey.Device {


    // this method is called when the Device is inited
    //#region onInit

    onInit() {


        this.name =   this.getName()
        this.log(`device init ${this.name}`);
        this.log('device name:', this.name);
        this.class = this.getClass();
        this.log('homey class name:', this.class);
        this.driver = this.getDriver().id
        this.log(`driver name id `, this.driver)       
        this.log(`node driver classname in file `, this.getDriver().constructor.name)
        // this.log(`driver `, this.inspect(this.getDriver()))
             

        this.data = this.getData()
        this.log(`device data     ${this.data} `)


        this.settings = this.getSettings();

        this.log(`this settings ${util.inspect(this.settings)}`)

        

        this.onCapabilityOnoff = (value, opts, callback) => {
            
            // ... set value to real device
            this.log(`value send onff   ${value} `)

           

            
            //  signal.emit('sendCommand', sendCommand)
            this.log(` sendcommand onoff value`)

            let plugwiseid = this.data.plugwiseid
            this.sendCommandToPlugwise(plugwiseid,value)

            // Then, emit a callback ( err, result )
            callback(null);
            // or, return a Promise
            return Promise.reject(new Error('Switching the device failed!'));
        }

        this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this))

    }


    updateCapabilitiesCircle(HD) {




        if (this.driver == 'circle') {

            this.log(`this is device with driver id  ${this.getDriver().id}`)
            this.log('info from circle device HD  ', HD)


            this.setCapabilityValue(`onoff`, HD.onoff)
            this.setCapabilityValue(`measure_power`, HD.measure_power)
            this.setCapabilityValue(`meter_power`, HD.meter_power)
        }
    }

    /// send command to plugwise
    sendCommandToPlugwise(id, onoff) {
        this.log('479 sendcmmand with plugwiseid   ' + id + ' and    command   ' + onoff);

        let command = '';
        if (onoff == true) {
            command = 'on';
        }
        else if (onoff == false) {
            command = "off";
        }
        this.log('commandpath = /api/actions.html?option=switch' + command + '&id=' + id)


       // https://knowledge.zomers.eu/plugwise/Pages/Extract-actual-information-from-Plugwise.aspx

        let path = '/api/actions.html?option=switch' + command + '&id=' + id

        //Homey.app.
        //self.reqserver = function (ip, port, path, method, username, password) { 
        Homey.app.reqserver(Homey.app.serverip, Homey.app.serverport, path, Homey.app.servermethod, Homey.app.serverusername, Homey.app.serverpassword);







    }


}

module.exports = circleDevice