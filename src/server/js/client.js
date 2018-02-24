Core.extend("client", function (core) {
    var server = 'ytrc.apajo.ee/app/room/',
        data = {};
    
    var init = function () {
    }
    var uninit = function () {
        stop();
    }
    
    var start = function (d, callback) {
        data = d;

        if (data) {
            setInterval(parse, 30000);
            parse();
        
            if (typeof callback === "function") {callback();}
        }
    }
    
    var stop = function () {
        if (data) {
            query([",room", "stop"], data, function (d) {
                console.log("query successz", data);
            });
        }
    }
    
    var parse = function ( ){
        //  && Core.server.isStarted()
        if (data) {
            query("room", data, function (d) {
            });
        }
    }
    
    var query = function (object, data, success, failed) {
        var path = "http://"+server+"?"+
                        (typeof object === "string" ? object : "/" + object.join("/"));

        //if (true || navigator.onLine) {
            _$.ajax({
                "type": 'post',
                "url" : path,
                dataType: 'json',
                async : true,
                data : data,
                xhrFields: {
                    //withCredentials: true
                    },
                success: function(d, status, xhr){

                    try { success.apply(this, arguments); } catch (err) {}
                },
                error: failed
            });
        /* } else {
            Core.log("No Connection!");
            failed(null, "Interneti ühendus puudub!");
        }*/
    };
        
    return {
        init : init,
        uninit : uninit,
        start : start,
        stop : stop
    };
});