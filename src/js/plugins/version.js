Core.extend("version", function (core) {
    var versionNumber = '?',
        targetSelector = '.app-version';
    
	return {
        init : function () {
            if (core.isApp()) {
                try {
                        cordova.getAppVersion.getVersionNumber(function (num) {
                            versionNumber = num;
                        });
                } catch (err) {}
            } else {
                $.get("../config.xml", function (d) {
                    versionNumber = $(d).find("widget").attr("version");
                })
            }
        },
        
        get : function ( ) {
            return versionNumber;
        }
    };
});
