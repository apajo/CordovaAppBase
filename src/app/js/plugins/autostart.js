Core.extend ("autostart", function (Core) {
	var plugin = null,
		state = false;
	
	var enable = function () {
		if (Core.isApp()) {
			plugin.enable();
		}
	};
	
	var disable = function () {
		if (Core.isApp()) {
			plugin.disable();
		}
	};
	
	var setState = function (newState) {
		state = newState === true;
		
		if (Core.isApp() && plugin) {
			if (state) {
				enable();
			} else {disable();}
		}

	};
	
	return {
		init : function () {
			if (Core.isApp()) {

				// set autostart after config is loaded
				$(document).on("config", function (e, settings) {
					var state = settings.autostart;
					
					setState(state);
				});
				
				setState(false);
			}

			return true;
		},
		
		setState : setState
	}
});