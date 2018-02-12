Core.extend("room", function (core) {
    var context = null,
        address = null;
          
    var init = function () {
        context = $("#room");
        
        $(document).on("app:page:load", function (e, params) {
            if (params.href == "room.html") {
                var server = params.data["data-server"];

                address = server;
                getServerState();
            }
        });
        
        setInterval(getServerState, 3000);
    };

    var getServerState = function () {
        if (address) {
            console.log("getdata", address);
            $.get("http://"+address, function (data) {
                console.log("STATE", data);
            });
        }
    }

    return {
        init : init
    };
});