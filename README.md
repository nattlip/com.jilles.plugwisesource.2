# com.jilles.plugwisesource.2



omey app to integrate Plugwise Windows desktop Source in Homey.

Works with data retreived from Plugwise Source Server . Controls Circles and Stealths with Homey.

30-08-2016 version 0.1.2 first app store release changes : only Circles and Circles+ can be added as Homey socket devices.
 
There is a special Homey app for the Plugwise [Smile] P1 in the Athom App Store so it isnt included anymore in this app.

[Smile]: https://apps.athom.com/app/com.plugwise.smile



Bug fixed  : Testing Plugwise Source server  doesnt give crash app anymore.

Changelog

21-11-2016  v 0.1.40    removed bug compatability >= 1.0.39

21-11-2016  v 0.1.39    added node module node-homey-log to map node_modules
 
18-12-2016  v 0.1.38    version homey FW lifted to >= 1.0.3 removed bug when switch a socket app crashed. added Sentry log require, not implemented yet

18-12-2016  v 0.1.28    moved the initialization of the app settings values to app init from the global space  to prevent app crash after reboot or update  homey 

15-10-2016  v 0.1.18    firmmware update homey to 0.10.5 did give problems with saving settings of server, is solved by bvdbos.

25-09-2016  v 0.1.7     deleteted line 30 in driver which gave app crash in Homey firmware 0.10.0


01-07-2018  v 2.0.0      SDK 2 version   setting locked included to lock circle, and circle can be added as Homey light

03-07-2018  v 2.0.1      SDK 2 version   node modules were excluded in gitignore, light virtual class didnt work  , now it works

08-08-2018  v 2.0.2      fixed a bug

14-08-2018  v 2.0.3      added stealth as a circel device 

[![Paypal donate][pp-donate-image]][pp-donate-link]
[pp-donate-link]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=42UGL52J4KPZE
[pp-donate-image]: https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif
