Core.extend("motion", function (core) {
    var watching = false;

    var lastAcceleration = null;
    var lastRotation = null;

    var startWatch = function () {
        watching = true;
        window.addEventListener("devicemotion", onMotion, true);
    }

    var stopWatch = function () {
        window.removeEventListener("devicemotion");
        watching = false;
    }

    var onMotion = function (acceleration) {
        if (acceleration.accelerationIncludingGravity.x !== null) {
            acc = lastAcceleration = acceleration.accelerationIncludingGravity;
            
            $(document).trigger("app:motion", [
                acc.x,
                acc.y,
                acc.z
            ]);
        }
        
        if (acceleration.rotationRate.alpha !== null) {
            lastRotation = acceleration.rotationRate;
        }
    }

    var get = function (rotation) {
        return rotation !== true ? lastAcceleration : lastRotation;
    }
    
    var isWatching = function () {
        return watching;
    }

    return {
        init : function () {
            startWatch();
        },
        
        onMotion : onMotion,
        isWatching : isWatching,
        
        start : startWatch,
        stop : stopWatch,
        get : get
    }
});