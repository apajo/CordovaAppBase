Core.extend("rooms", function (core) {
    var context = null;
          
    var init = function () {
        context = $("#rooms");

        setInterval(parse, 30000);
        setTimeout(parse, 100);
    };

    var add = function (room) {
        checkRoom(room.data.address, function () {
            var html = '<li class=""><a href="room.html" data-server="'+
                room.data.address+'" data-type="room"><div class="nav-menu__ico"><i class="fa fa-fw fa-cube"></i></div><div class="nav-menu__text"><span>'+room.data.name+'</span></div></a></li>';

            context.append(html);
        });
    }

    var checkRoom = function (address, callback) {
        if (address) {
            $.get("http://"+address, function () {
                if (typeof callback === "function") {
                    callback();
                }
            });
        } else {
            Core.warn("Room inst active: "+address);
        }
    }

    var parse = function () {
        Core.query("rooms", {}, function (data) { 
            context.empty();

            data.rooms.map(function (a) {
                add(a);
            });
        });
    }

    return {
        init : init
    };
});