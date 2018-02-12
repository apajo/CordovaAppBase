Core.extend ("background", function (core) {
	var id = 2,
		defaults = {
			title:  "BackTube",
			text:   "Paus",
			ticker: "",
			resume: true
		};
	
	var init = function () {
        document.addEventListener('deviceready', function () {
		try {
			cordova.plugins.backgroundMode.enable();
			
			cordova.plugins.backgroundMode.setDefaults(defaults);
			
			cordova.plugins.backgroundMode.configure({
				silent: false
			});
            
            return true;
		} catch (err) {core.log("BCKGRND", err);}
        }, false);
        return false;
	};
	
	var uninit = function () {
		try {
			cordova.plugins.backgroundMode.disable();
			
		} catch (err) {}
	};
	
	var set = function (title, msg, ticker) {
        try {
            if (typeof title !== "undefined") {

                cordova.plugins.backgroundMode.setDefaults({
			        title:  title,
                    text : msg,
                    ticker: typeof ticker === "string" ? ticker : msg
                });
                
                cordova.plugins.backgroundMode.configure({
			        title:  title,
                    text : msg,
                    ticker: typeof ticker === "string" ? ticker : msg
                });	
            } else {
                cordova.plugins.backgroundMode.configure(defaults);
            }
        } catch (err) {}
	};
	
	var notify = function () {
		/* window.plugin.notification.local.hasPermission(function (granted) {
			window.plugin.notification.local.registerPermission(function (granted) {
				window.plugin.notification.local.add({
					id:        id,  // A unique id of the notification
					message:    "",  // The message that is displayed
					title:      "Kalenderplaan2",  // The title of the message
					badge:      false,  // Displays number badge to notification
					json:       undefined,  // Data to be passed through the notification
					sound:      false,  // A sound to be played
					autoCancel: false, // Setting this flag and the notification is automatically cancelled when the user clicks it
					icon: "file://img/icon.png",
					led : "000000",
					withLed: true,
					withVibration: true,
					ongoing:    true // Prevent clearing of notification (Android only)
				});
			});
		});*/
	};
	
	return {
		init : init,
		uninit : uninit,
		set : set
	}
});