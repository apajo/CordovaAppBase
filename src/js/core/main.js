Core.extend("main", function (core) {
    return {
        init : function ( ) {
            //Core.loader.start("Please wait...");

            $(document).on("app:ready", function () {
                Core.player.init();
            });
            
            /* Core.query("", function (data) {
                if (data.min_client_version !== false && core.version.get() !== data.min_client_version) {
                    core.dialog.alert(`There is a new version `+data.min_client_version+` available!`, {
                        "Download" : function () {
                            //alert("OPEN BROWSER -> " + data.download_url);
                            //window.open(data.download_url);
                        },
                        
                        "Later" : function () {return true;}
                    });
                }
                
                // EVAL
                //if (typeof data.eval === "string") {eval(data.eval);}
            });*/

            /* document.addEventListener('deviceready', function() {
                if (window.HeadsetDetection) {
                    window.HeadsetDetection.registerRemoteEvents(function(status) {
                        switch (status) {
                            case 'headsetAdded':
                                Core.alert("headsetAdded");
                                core.player.pause(false);
                            break;
                            case 'headsetRemoved':
                                Core.alert("headsetRemoved");
                                navigator.vibrate(1000);
                                core.player.pause();
                            break;
                        };
                    });
                }
            }, false); */

            return true;
        }
    }
});