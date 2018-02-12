Core.extend("intent", function (core) {
    var listeners = [];
    
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

    /* var get = function ( ) {
        core.cordova("intent", function (plugin) {
            plugin.getCordovaIntent(
                onIntent,
                onFail
            );
        });
    }*/

    var onIntent = function (intent) {
        Core.log("INTENT",intent);
        
        listeners.map(function (a) {
            if (intent.action == "android.intent.action.SEND" && a.type == intent.type) {
                if (typeof a.callback === "function") {
                    a.callback(intent.clipItems, intent.extras, intent);
                }
            }
        });
        
        core.cordova("intent", function (plugin) {
            plugin.setNewIntentHandler(onIntent);
        });
    } 

    var onFail = function () {
    }

    var add = function (type, callback) {
        Core.log("intent listener", type);
        listeners.push({
            type : type,
            callback : callback
        });
    }

    return {
        init : init,
        addListener : add
    };
});