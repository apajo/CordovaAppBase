Core.extend("intent", function (core) {
    var listeners = [],
        queue = [];
    
    var init = function () {
        core.cordova("intent", function (plugin) {
            plugin.getCordovaIntent(
                onIntent,
                onFail
            );
        });

        core.cordova("intent", function (plugin) {
            plugin.setNewIntentHandler(onIntent,
            function (intent) {
                Core.log("INTENT.ERR",arguments);
            } );
        });
    };

    var add = function (intent) {
        Core.log("INTENT",intent);
        Core.log("INTENT",JSON.stringify(intent));
        queue.push(intent);
    }

    var onIntent = function (intent) {
        add(intent);
        
        check();

        core.cordova("intent", function (plugin) {
            plugin.setNewIntentHandler(onIntent);
        });
    } 

    var check = function () {
        var remove = [];
        
        listeners.map(function (a) {
            queue.map(function (intent, index) {
                if (intent.action == "android.intent.action.SEND" && a.type == intent.type) {
                    console.log("check intent hand", index, intent);
                    if (typeof a.callback === "function") {
                        if(a.callback(intent.clipItems, intent.extras, intent)) {
                            console.log("VALID INTENT HANDLER", index, intent);
                            remove.push(index);
                        }
                    }
                }
            });
        });
        
        remove.map(function (i) {
            queue.splice(remove, 1);
        });
    }

    var onFail = function () {
    }

    var addListener = function (type, callback) {
        listeners.push({
            type : type,
            callback : callback
        });
        
        check();
    }

    return {
        init : init,
        addListener : addListener
    };
});