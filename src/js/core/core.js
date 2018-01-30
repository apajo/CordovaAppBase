var Core = (function($){
	var core = null,
            initState = false,
            DEBUG = true,
            extensions = [];

    var init = function () {
        if (initState) {return false;}

        core.log("INIT");

        //document.addEventListener("unload", end);
        $(document).one("unload", end);
        //document.getElementsByTagName("body")[0].addEventListener("load", start);
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
		core.log(("plugin.register."+name).toUpperCase());

		extensions[name] = {
			name : name,
			creator : creator
		};
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
			for(var i in extensions){
                            start(extensions[i].name);
			}
		} else {
                        var ext = extension(name);
                    
			if (plugin(name) == null && typeof ext  !== "undefined") {
                            console.log(("plugin."+name+".start").toUpperCase());
                
				core[name] = new ext.creator(core) ;
	
				if (typeof core[name].init === "function") {
					core[name].init();
				}
			} else {core.log("Unknown module: "+ name);}
		}
	};

	/*
	 * 
	 */
	var stop = function (name) {
		if (typeof name === "undefined") {
			for(var i in extensions) {
				if (typeof core[extensions[i].name] !== "undefined" && core[extensions[i].name] !== null) {
					if (typeof core[extensions[i].name].uninit === "function") {
						core[extensions[i].name].uninit();
					}

					core[extensions[i].name] = null;
				} else {
                                    //console.error("Extension ("+extensions[i].name+") already instantiated!");
				}
			}
		} else {
			var ext = plugin(name);
			
			if (ext !== null) {
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
    
    var log = function () {
        var logr = function(){
            var i = -1, l = arguments.length, args = [], fn = 'console.log(args)';
            while(++i<l){
                args.push('args['+i+']');
            };
            fn = new Function('args',fn.replace(/args/,args.join(',')));
            fn(arguments);
        };
        
        if (core.DEBUG()) {
            logr("[CORE]", arguments);
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
        log : log, debug : log,
		extend : extend,
		start : start,
		end : end
	};

	return core;
})(jQuery);