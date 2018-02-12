/*

EXAMPLE INTENT:
{  
   "clipItems":[  
      {  
         "text":"benny benassi: http://www.youtube.com/playlist?list=PLvbgmMVUKHN6wSM9DQe4hjK5rjsmcpGM-"
      }
   ],
   "type":"text/plain",
   "extras":{  
      "android.intent.extra.SUBJECT":"Watch \"benny benassi\" on YouTube",
      "android.intent.extra.TEXT":"benny benassi: http://www.youtube.com/playlist?list=PLvbgmMVUKHN6wSM9DQe4hjK5rjsmcpGM-"
   },
   "action":"android.intent.action.SEND",
   "flags":453509121,
   "component":"ComponentInfo{ee.apajo.backtube/ee.apajo.backtube.MainActivity}"
}


{  
   "action":"android.intent.action.MAIN",
   "categories":"{android.intent.category.LAUNCHER}",
   "flags":270532608,
   "component":"ComponentInfo{ee.apajo.backtube/ee.apajo.backtube.MainActivity}"
}








*/

/*
 * SocialShare plugin for exchanging Intents between apps
 */
Core.extend("share", function (core) {
    var //closeOnLaunchIntent = true,
        defaults = {
            subject: "BackTube", // fi. for email
            message: "Happy listening!", // not supported on some apps (Facebook, Instagram)
            url: "http://backtube.apajo.ee",
            chooserTitle: 'Share via an App' // Android only, you can override the default share sheet title
            //files: ['', ''], // an array of filenames either locally or remotely
        };
    
    var init = function () {
        document.addEventListener('deviceready', function () {
            // GET INTENT
            window.plugins.intent.getCordovaIntent(function (intent) {
                setTimeout(function ( ){
                    $(document).trigger("share", intent);
                }, 500);
                
                return false;
            }, function (e) {
                Core.log('Error', e);
            });
            
            // LISTEN FOR INTENTS
            receive();
        }, false);
    };
    
    var receive = function () {
        try {
            window.plugins.intent.setNewIntentHandler(function (intent) {
                $(document).trigger("share", intent);
                
                return false;
            }, function (e) {
                Core.log('Error', e);
            });
        } catch (e) {core.log('INTENT:ERR', e);}
    };

    var send = function (title, message, url, params) {
        var options = $.extend(defaults, {
            subject: title, 
            message: message, 
            url: url,
            chooserTitle: params.title || 'Share via an App'
        });

        try {
            window.plugins.socialsharing.shareWithOptions(options, function(result) {
                core.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                core.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
            }, onError = function(msg) {
                core.log("Sharing failed with message: " + msg);
            });
        } catch (e) {
            core.log("SHARE:FAIL", options);
        }
    };


	return {
        init : init,
        send : send
	}
});