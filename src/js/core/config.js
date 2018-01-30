Core.extend("config", function (core) {
    var autoSave = true,
        defaultConfig = {
            address : "backtube.apajo.ee/public/app"
        },
        cache = {};
    
    var _storageSystems = {
            "localstorage" : {
                get : function (success, fail) {
                    try{
                        var result = JSON.parse(window.localStorage.getItem(root));
                        
                        if (typeof success === "function") {
                            success(result);
                        }
                    }catch(e){
                        if (typeof fail === "function") { fail(result); }
                    }
                },
                
                set : function (data, success, fail) {
                    var data = $.extend(cache, data);
                    try{
                        window.localStorage.setItem(root,
                            JSON.stringify(data)
                        );//throws storage err
                        
                        try{
                            success(data);
                        }catch(err){}
                    }catch(err){
                        onError(err);
                        if (typeof fail === "function") { fail(err); }
                    }
                }
            }
            //"filesystem" : {}
            //"cookies" : {}
        };

    var system = "localstorage",
        root = "backTube.config",
        autoSave = true, // save after each change
        cache = $.extend(defaultConfig, {});

	var init = function () {
        cache = $.extend(defaultConfig, {});
        
        load(function (cfg) {
            cache = $.extend(defaultConfig, cfg);
        }, function (cfg) {
            console.log("CFG_DATA_ERR", arguments);
        });

        return true;
    }
	
	var uninit = function () {console.log("STOP CFG");
		save();
		
		return true;
	}
    
    var load = function (success, fail) {
        _storageSystems[system].get(function (cfg) {
            cache = $.extend(defaultConfig, cfg);
        
            if (typeof success === "function") { success(cfg); }
        }, fail);
    };
    
    var save = function (success, fail) {
        console.log("CFG.save", cache);

        _storageSystems[system].set({}, function (cfg) {
            if (typeof success === "function") { success(cfg); }
        }, fail);

        return true;
    };
	
    var reset = function () {}
    
	var onError = function (e) {
		var msg = '';
	
		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				msg = 'Storage quota exceeded';
				break;
			case FileError.NOT_FOUND_ERR:
				msg = 'File not found';
				break;
			case FileError.SECURITY_ERR:
				msg = 'Security error';
				break;
			case FileError.INVALID_MODIFICATION_ERR:
				msg = 'Invalid modification';
				break;
			case FileError.INVALID_STATE_ERR:
				msg = 'Invalid state';
				break;
			default:
				msg = 'Unknown error';
				break;
		};
	
		//core.dialog.alert('Error#'+e.code+'(' + fileName + '): ' + msg);
        console.log("config.err", 'Error#'+e.code+': '+ msg, e);
	};
	
	return {
		init : init,
		uninit : uninit,
		
		get : function (name) {
            console.log("cfg", cache, name, cache[name]);
            if (typeof name !== "undefined") {
                return cache[name];
            } else { return conf; }
		},

		set : function (name, val) {console.log("SET.CFG", name, val);
			cache[name] = val;

            if (autoSave) { 
                return save(cache);
            }
            
			return false;
		},
		
		//load : load,
		//save : save,
		reset : reset
	}
});