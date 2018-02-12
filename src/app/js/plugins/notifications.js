/*
 * System notifications
 */
/* Core.extend ("notification", function () {
	var idOffset = 100,
		enabled = true;
	
	var init = function (){
		if (Core.isApp()) {
			if (typeof window.plugin.notification.local.setAutoClearAll !== "undefined") {
				window.plugin.notification.local.setAutoClearAll();
		}}
	};

	var post = function (id, title, text) {
		if (Core.isApp() && enabled) {
			window.plugin.notification.local.hasPermission(function (granted) {
				window.plugin.notification.local.registerPermission(function (granted) {
					window.plugin.notification.local.add({
						id : idOffset + parseInt(id),
						title:      title,  // The title of the message
						message:    text,  // The message that is displayed
						ongoing:    false, // Prevent clearing of notification (Android only)
						autoCancel: true,
						//led : "FFFF00",
						//withLed: true,
						//withVibration: true
					});
				});
			});
		}
	};

	var remove = function (id, callback) {
		if (Core.isApp()) {
			window.plugin.notification.local.clear(idOffset + parseInt(id), callback);
		}
	};

	var clear = function (callback) {
		if (Core.isApp()) {
			window.plugin.notification.local.clearAll(callback);
		}
	};

	var uninit = function () {
		clear();
	}

	var disable = function () {enabled = false;};
	var enable = function () {enabled = true;};

	return {
		init : init,
		post : post,
		remove : remove,
		clear: clear,
		uninit : uninit,
		
		disable : disable,
		enable : enable
	}
}); */