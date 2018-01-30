Core.extend("cordova", function (core) {
    return function (pluginName, success, failed) {
        if (typeof navigator[pluginName] !== "undefined") {
            if (typeof success === "function") {
                success(navigator[pluginName]);
            }
            
            return true;
        } else {
            if (typeof failed === "function") {
                failed();
            }
            console.log("ERR: Cordova plugin '"+pluginName+"' doesn't exists!");
            return false;
        }
    };
});