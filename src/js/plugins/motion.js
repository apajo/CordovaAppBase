Core.extend("motion", function (core) {
    function onSuccess(acceleration) {
        $("#video-title").html([
            acceleration.x,
            acceleration.y,
            acceleration.z,
            acceleration.timestamp
        ]);;
    }

    function onError() {
        alert('onError!');
    }

    var options = { frequency: 3000 };  // Update every 3 seconds

    return {
        init : function (callback) {
            var watchID = null;
            
            core.cordova("accelerometer", function (plugin) {
                watchID = plugin.watchAcceleration(
                    onSuccess,
                    onError,
                    options
                )
            });
        },
    }
});