Core.extend("cordova", function (core) {
    var call = function  (callback, plugin) {
        callback(plugin);
    }
    
    return function (pluginName, success, failed) {
        if (typeof navigator[pluginName] !== "undefined") {
            return call(success, navigator[pluginName]);
        } else if (window.plugins && typeof window.plugins[pluginName] !== "undefined") {
            return call(success, window.plugins[pluginName]);
        } else {
            if (typeof failed === "function") {
                failed();
            }
            Core.warn("Cordova plugin '"+pluginName+"' doesn't exists!",);
            return false;
        }
        
        return true;
    };
});