'use strict';


const http = require('http');
const util = require('util');
const xml2js = require('xml2js');
const Homey = require('homey');
const driverCircle = Homey.ManagerDrivers.getDriver('circle')
const driverLight = Homey.ManagerDrivers.getDriver('light')
class MyApp extends Homey.App {

    onInit() {
        this.log('MyApp is running...');

        this.serverip = Homey.ManagerSettings.get('serverip');
        this.serverport = Homey.ManagerSettings.get('serverport');
        this.serverusername = Homey.ManagerSettings.get('serverusername');
        this.serverpassword = Homey.ManagerSettings.get('serverpassword');

        this.plugwiseserverset = true
        this.plugwiseservertested = false
        this.plugwiseserverconnected = false
        this.polleri = 0
        this.pollInterval = 15000,
            this.serverpath = '/statistics.xml';
        this.servermethod = 'GET';


        this.log("value ip setting input box", this.serverip);
        this.log("value port setting input box", this.serverport);
        this.log("value user setting input box", this.serverusername);
        this.log("value password  setting input box", this.serverpassword);
        this.log("value testing setting", this.plugwiseservertested);
        this.log("99 plugwiseserverconnected ", this.plugwiseserverconnected);
        this.log("plugwiseservertested ", this.plugwiseservertested);

        this.reqserver(this.serverip, this.serverport, this.serverpath, this.servermethod, this.serverusername, this.serverpassword)

        Homey.ManagerSettings.on('set', (key) => {
            let value = Homey.ManagerSettings.get(key);
            if (key == 'serverip') {
                this.serverip = value
            }
            if (key == 'serverport') {
                this.serverport = value
            }
            if (key == 'serverusername') {
                this.serverusername = value
            }
            if (key == 'serverpassword') {
                this.serverpassword = value
            }


            this.log('Setting', key, 'is set ', value)

            clearInterval(this.toset);
            this.polleri += 1

            this.reqserver(this.serverip, this.serverport, this.serverpath, this.servermethod, this.serverusername, this.serverpassword)


            this.pollplugwise();



        })


        this.pollplugwise();






    }  // end onint

    //run when user changed settings



    pollplugwise() {
        this.torepeat = () => {
            this.polleri += 1;
            this.log('app 19 polleri before', this.polleri);


            this.log('pollplugwise  this.plugwiseserverset', this.plugwiseserverset);
            this.log('pollplugwise  this.testplugwiseserver', this.plugwiseservertested);
            this.log('pollplugwise  this.plugwiseserverconnected', this.plugwiseserverconnected);


            if (this.plugwiseserverset && this.plugwiseserverconnected) {

                this.reqserver(this.serverip, this.serverport, this.serverpath, this.servermethod, this.serverusername, this.serverpassword);

            };
            this.log('app 27 polleri after ', this.polleri);


        };


        this.toset = setInterval(() => { this.torepeat() }, this.pollInterval);

    }




    reqserver(ip, port, path, method, username, password) {

        let callback2 = (response) => {
            let str = '';

            //another chunk of data has been recieved, so append it to `str`

            this.log('driver 174  callback2 entered ')

            response.on('data', function (chunk) {
                str += chunk;
                ;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', () => {


                this.log('app 50         response on end');

                if (response.statusCode == 200) {
                    this.log('app 240   after    if (response.statusCode == 200)      ', response.statusCode);
                    this.plugwiseservertested = true;
                    // only do a meesage if value chaneged
                    if (!this.plugwiseserverconnected) {
                        this.log('app 268  after    if (!this.plugwiseserverconnected)      ', !this.plugwiseserverconnected);
                        this.log('app 269  server isconnected      ');

                        this.plugwiseserverconnected = true;
                        this.plugwiseservertesting = false // not more we are connected to  the server

                        // Homey.manager('api').realtime('my_event', { plugwiseserverconnected: true });


                        this.log('app 277   response.statusCode        ', response.statusCode);
                        this.log('app 277    this.testplugwiseserver    ', this.plugwiseservertested);
                    }; //connected
                }


                //else {

                //  this.log('app 201 callback2 response.statusCode', response.statusCode)

                //  self.serverdata = str;   // to send to driver

                let checkpath = '';  //    /api/actions.html?

                checkpath = path.slice(0, 5);
                this.log('let path ', path)
                this.log('/api/  checkpath = ', checkpath)











                if (!(checkpath == '/api/')) {



                    this.log('!(checkpath == /api/)', !(checkpath == '/api/'))

                    this.resolveGet(str, this.polleri);

                };


            }); // on end


        };// callbCK2




        let options2 = {

            host: ip,
            port: port,
            path: path,
            method: method,


            auth: username + ':' + password

        };








        this.log(' before req to be executed options2  ', options2);
        let req = http.request(options2, callback2);
        req.end();
        req.on('error', function (err) {
            this.log('err req', err)
        });

    }// end request

    resolveGet(data, poller) {

        this.log('driver 258 processdevcedata entered ');
        //  this.log("driver 259 received xml", data);



        //  "[{"error":{"type":101,"address":"","description":"link button not pressed"}}]"
        // "[{"error":{"type":2,"address":"","description":"body contains invalid json"}}]"
        // "[{"success":{"username":"abd7825e - aa9d - c301 - 8e4a - 3e6de64a8aaf"}}]"


        //  Homey.log(data)

        // this.log(data);

        let parser = new xml2js.Parser({ explicitArray: false })

        parser.parseString(data, (err, result) => {

            // this.log(util.inspect(result, false, null))
            //this.log(result);
            // this.log('results length', results.length);



            //  this.log(util.inspect(results, false, null));


            let sourceobject = result;

            //  this.log('result get', result)

            let appliances = sourceobject.items.appliance;
            this.log('APPLIANCES GET get', sourceobject.items.appliance)

            this.TranslateAppliancesToAppDevices(sourceobject.items.appliance);





            //for (let i = 0; i < cloned_devices_data.length; i++) {

            //  this.log('driver 278   virtual setavailablity' , cloned_devices_data[i])
            //  module.exports.setAvailable(devices_data[i])                      
            //  module.exports.getSettings(devices_data[i], function (err, settings) {
            // this.log(settings.toString)
            //           })

            //  let plugewiseid = getCircleId2(device_data.id);
            //  this.log('driver 29 init', plugwiseid)

            //  };
            //  this.log(' poller poller % stateModulus (poller % stateModulus) == 0)', poller + '  ' + poller % stateModulus + '  ' + (poller % stateModulus == 0));
            //if (((poller % stateModulus) == 0) && poller > 1 )
            //{
            //    for (let i = 0; i < pairedDevices.length; i++)
            //    {

            //        let thisdevice = {};
            //        this.log('driver 292   realtime  device capabilities for insights paireddevices[i]":', pairedDevices[i].data);
            //        this.log('driver 292   realtime  device capabilities for insights paireddevicesOld[i]":', PairedDevicesOld[i].data);
            //        thisdevice = pairedDevices[i];

            //        if (thisdevice.onoff !== PairedDevicesOld[i].onoff)
            //        {
            //            module.exports.realtime(thisdevice.data, 'onoff', thisdevice.onoff);
            //        }
            //        if (thisdevice.measure_power !== PairedDevicesOld[i].measure_power)
            //        {
            //            module.exports.realtime(thisdevice.data, 'measure_power', thisdevice.measure_power);
            //        }
            //        if (thisdevice.meter_power !== PairedDevicesOld[i].meter_power)
            //        {
            //            module.exports.realtime(thisdevice.data, 'meter_power', thisdevice.meter_power);
            //        }
            //    };
            //};






        }); // parser









    }  // resolve get




    resolvePost(result) {

        this.log('result post ', result)



    }

    translateLocked(s) {

        if (s == `False`)
            return false
        if (s == `True`)
            return true
    }



    TranslateAppliancesToAppDevices(dat) {





        let len = dat.length
        let homeyDevices = [];
        this.log('entered tranlateapplicance to homeyDevice');

        for (let i = 0; i < len; i++) {
            let homeyDevice = {};
            //  util.log(util.inspect((dat[i].moduletype == "Circle" || dat[i].moduletype == "Circle+"), false, null))
            //  util.log(util.inspect((dat[i]), false, null))
            // filter out all other devices as circles and circles+
            if (dat[i].moduletype == "Circle" || dat[i].moduletype == "Circle+") {
                homeyDevice = {
                    data: {
                        id: dat[i].macaddr,
                        plugwiseid: dat[i].id, // id in plugwise needed  to send command
                        sourseid: dat[i].macaddr.slice(-6)              // id in source
                    },
                    name: dat[i].name,
                    capabilities: ["onoff", "measure_power", "meter_power"],
                    measure_power: Number(((dat[i].powerusage) / 100).toFixed(2)),
                    meter_power: Number(((dat[i].totalusage) / 100).toFixed(0)),
                    type: dat[i].type,
                    room: dat[i].room,
                    onoff: this.translatePowerstateFromPlugwiseToHomey(dat[i].realstate),
                    settings: { id: dat[i].macaddr.slice(-6), locked: this.translateLocked(dat[i].locked) }
                };

                this.log('device      ', homeyDevice);


                this.transports(homeyDevice)
            };
        };




    }  // TranslateAppliancesToAppDevices


    translatePowerstateFromPlugwiseToHomey(state) {
        if (state == "on") {
            return true
        }
        else if (state == "off") {
            return false
        }

    }

    transports(filledDevice) {


         // circle
        if (!this.contains(driverCircle.homeyDevices, filledDevice)) {
            driverCircle.homeyDevices.push(filledDevice);
            this.log(` device pushed to homeyDevices  ${filledDevice.data.id}`)
        } else {
            this.log(` device found in homey devices ${filledDevice.data.id}`)
            let device = driverCircle.getDevice(filledDevice.data);
            this.log(`device instanceof Homey.Device              ${device instanceof Homey.Device}`)
            if (device instanceof Homey.Device) {
                Homey.app.log('orgeon decoding device is already registered')
                driverCircle.log('device is already registered');
                device.log(`device is already registered with  getData() ${util.inspect(device.getData())}  `)
                device.updateCapabilitiesCircle(filledDevice)
                // client.end();
                // return callback(Error('duplicate'));
            }
        }

        filledDevice.virtualClass = 'light'

        if (!this.contains(driverLight.homeyDevices, filledDevice)) {
            
            driverLight.homeyDevices.push(filledDevice);
            this.log(` device pushed to homeyDevices  ${filledDevice.data.id}`)
        } else {
            this.log(` device found in homey devices ${filledDevice.data.id}`)
            let device = driverLight.getDevice(filledDevice.data);
            this.log(`device instanceof Homey.Device              ${device instanceof Homey.Device}`)
            if (device instanceof Homey.Device) {
                Homey.app.log('orgeon decoding device is already registered')
                driverLight.log('device is already registered');
                device.log(`device is already registered with  getData() ${util.inspect(device.getData())}  `)
                device.updateCapabilitiesCircle(filledDevice)
                // client.end();
                // return callback(Error('duplicate'));
            }
        }



    }

    contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].data.id == obj.data.id) {
                return true;
            }
        }
        return false;
    };








}

module.exports = MyApp;