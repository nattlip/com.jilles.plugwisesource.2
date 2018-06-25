'use strict';


const http = require('http.min');
const Homey = require('homey');

class MyApp extends Homey.App {
	
	onInit() {
        this.log('MyApp is running...');

        this.serverip = Homey.ManagerSettings.get('serverip');
        this.serverport = Homey.ManagerSettings.get('serverport');
        this.serverusername = Homey.ManagerSettings.get('serverusername');
        this.serverpassword = Homey.ManagerSettings.get('serverpassword');

        this.plugwiseserverset = false
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

        this.reqserver(this.serverip, this.serverport, this.serverpath,  this.servermethod, this.serverusername, this.serverpassword)

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
            if(key == 'serverpassword') {
                this.serverpassword = value
            }


            this.log('Setting', key, 'is set ', value)

            clearInterval(this.toset);
            this.polleri += 1
            
            this.reqserver(this.serverip, this.serverport, this.serverpath, this.servermethod, this.serverusername, this.serverpassword)


            this.pollplugwise();
           


        })
        

        this.pollplugwise();

    }
  
   pollplugwise()  {
    this.torepeat =  () => {
        this.polleri += 1;
        this.log('app 19 polleri before', this.polleri);


        this.log('pollplugwise  this.plugwiseserverset', this.plugwiseserverset);
        this.log('pollplugwise  this.testplugwiseserver', this.plugwiseservertested);
        this.log('pollplugwise  this.plugwiseserverconnected', this.plugwiseserverconnected);


        if (this.plugwiseserverset && this.plugwiseserverconnected) {

            this.reqserver(this.serverip, this.serverport, this.serverpath, this.servermethod , this.serverusername, this.serverpassword);

        };
        this.log('app 27 polleri after ', this.polleri);


    };


    this.toset = setInterval( () => { this.torepeat() }, this.pollInterval);

} 




    reqserver(ip, port, path , method, username, password) {

        

        let options = {

            protocol: 'http:',
            hostname: ip,
            port: port,
            path: path,
            method: method,
            auth: username + ':' + password,
            timeout: 3000,
            headers: {
                'User-Agent': 'Node.js http.min'
            }

        }

        this.log(' before req http  min to be executed options  ', options);

        http(options).then((result) => {
            this.log(' result rsponse code   ', result.response.statusCode);

            if (result.response.statusCode == 200) {

                this.log(`responsecode = 200 `)

                this.plugwiseserverconnected = true
                this.plugwiseserverset = true 
                this.plugwiseservertested = true

                if (method == 'GET') { this.resolveGet(result) }

                else if (method == 'POST') { this.resolvePost(result) }
            }
        },
            (error) => {
                this.log("request Failed!", error);
            }

        )
    }  // end req

    resolveGet  (result)  {

        this.log('result get' , result)
    }

    resolvePost  (result)  {

        this.log('result post ', result)
    }


}

module.exports = MyApp;