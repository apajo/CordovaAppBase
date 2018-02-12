Core.extend("rooms", function (core) {
    var context = null;
          
    var init = function () {
        context = $("#rooms");

        setInterval(parse, 30000);
        parse();
    };

    var add = function (room) {
        var html = '<li class=""><a href="room.html" data-server="'+
            room.data.address+'" data-type="room"><div class="nav-menu__ico"><i class="fa fa-fw fa-cube"></i></div><div class="nav-menu__text"><span>'+room.data.name+'</span></div></a></li>';
        
        context.append(html);
    }

    var parse = function () {
        Core.query("rooms", function (data) { 
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