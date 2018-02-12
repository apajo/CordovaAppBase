var Core = (function($){
	var core = null,
            initState = false,
            DEBUG = true,
            extensions = [];

    var init = function () {
        console.groupEnd();
        
        if (initState) {return false;}

        $(document).one("unload", end);
        initState = true;

        start();
        
        setTimeout(function () {
            $(document).trigger("app:ready", core);
        }, 100);
    };

    var ready = function (callback) {
        if (!initState) {
            $(document).on("app:ready", function () {
                callback(core);
            });
        } else {
            callback(core);
        }

    };

	var extend = function (name, creator) {
		core.log("plugin.register."+name);

		extensions[name] = {
			name : name,
			creator : creator,
                        started : false
		};
                
                core[name] = new creator(core);
	};

	var extension = function (name) {
                if (typeof extensions[name] !== "undefined") {
                    return extensions[name];
                }

		return null;
	}

	var plugin = function (name) {
                if (typeof core[name] !== "undefined") {
                    return core[name];
                }

		return null;
	}

	var start = function (name) {
		if (typeof name === "undefined") {
                        console.groupCollapsed('Core.init');
			for(var i in extensions){
                            start(extensions[i].name);
			}
                        console.groupEnd();
		} else {
                        var ext = extension(name);
                    
			if (ext.started == false) {
                                Core.log(("plugin."+name+".start"));
				if (typeof core[name].init === "function") {
                                    try {
                                        core[name].init();
                                    } catch (e) {
                                        Core.error("MODULE.INIT failed: " + e.toString());
                                    }
				}
                                extensions[name].started = true;
			} else {core.log("Unknown module: "+ name);}
		}
	};

	/*
	 * 
	 */
	var stop = function (name) {
		if (typeof name === "undefined") {
			for(var i in extensions){
                            start(extensions[i].name);
			}
		} else {
			var ext = plugin(name);
			
			if (ext.started == true) {
				if (typeof ext.uninit === "function") {
					ext.uninit();
				}
			} else {console.error("Unknown module!");}
		}

	}
	
    /*
     * 
     */
    var isApp = function () {
        return typeof cordova !== "undefined";
    };
    
    var log = function (msg, params) {
        if (core.DEBUG() &&  window.console) {
            console.log(msg);
        }  
    };
    var warn = function (msg, params) {
        if (core.DEBUG() &&  window.console) {
            console.warn(msg);
        }  
    };
    var error = function (msg, params) {
        if (core.DEBUG() &&  window.console) {
            console.error(msg);
        }  
    };
	/*
	 * Uninit all the modules and close the app
	 */
	var end = function (e) {
		stop();

		$(document).trigger("unload");
        
		if (core.isApp()) {
			navigator.app.exitApp();
		}
        
            core.log("THE END!");
	};

	core = {
            init : init,
            DEBUG : function (setMode) {
                    if (typeof setMode !== "undefined") {
                            $("html").attr('data-debug', setMode ? 'true' : 'false');
                    }

                    return typeof setMode === "undefined" ?
                            DEBUG : DEBUG = setMode;
            },
            isApp : isApp,
            ready : ready,
            log : log,
            warn : warn,
            error : error,
            debug : log,
            extend : extend,
            start : start,
            end : end
	};

	return core;
})(jQuery);
console.groupCollapsed('Core.plugin.register');