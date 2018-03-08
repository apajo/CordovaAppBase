Core.extend("room", function (core) {
    var context = null,
        address = false,
        data = {},
        interval = null;
        
    var init = function () {
        context = $("#room");
        

        
        $(document).on("app:page:load", function (e, params) {
            if (params.href == "room.html") {
                var server = params.data["data-server"];
                selectRoom(server);
            }
            
            Core.intent.addListener("text/plain", function (d) {
                console.log("intent", d);
                if (d.length > 0) {
                    exec('open', d[0].text);
                }

                return true;
            });
        });
        
        $(document).on("app:change", function (e, data){
            var action = data.action,
                value = data.value;

            switch (action) {
                case 'volume':
                case 'seek':
                    exec(action, value);
                    break;
            }
        });
        
        $(document).on("click", "*[data-action]", function (e){
            var action = $(this).attr('data-action');

            switch (action) {
                case 'open':
                    exec('open', $("#add-input").val());
                    break;
                default:
                    exec(action, $(this).val());
            }
        });
    };

    var exec = function (action, value) {
        switch (action) {
            case 'open':
                var data = {
                        id : value,
                        type : 'video',
                        autoplay : false
                    };

                var data = resolveUrlData(value);

                switch (data.type) {
                    case 'playlist':
                        send(action, data);
                        break;
                    default:
                        Core.modal.open(
                                'Import',
                                'Lisan nimekirja või alustan video mängimist kohe?', 
                                {
                                        "Lisa nimekirja" : function ( ) {
                                            data.autoplay = false;
                                            send(action, data);
                                            return true;
                                        },
                                        "Alusta kohe" : function (modal) {
                                            data.autoplay = true;
                                            send(action, data);
                                            return true;
                                        }
                                }
                        );
               }

                break;
            default:
                send(action, value);
        }
    }

    var getServerState = function () {
        query(null, null, function (d) {
            updateController(processVideoData(d));
        });
    }

    var processVideoData = function  (data) {
        if (data) {
            if (typeof data === "string") {
                var data = data.split("\n\n");

                try {
                    return JSON.parse(data[1]);
                } catch (err) {
                    Core.error("Unable to parse player data!");
                }
            }
        }
        
        return data;
    }

    var updateController = function (data) {
        if (!data){return;}
        
        Object.keys(data).map(function (a) {
            var value = data[a],
                elem = $('*[data-action="'+a+'"]');

            switch (a) {
                case 'thumbnail':
                    $(".users-preview__photo div").css("background-image", 'url('+value+')');
                    break;
                case 'video':
                    $("#video-title").html(value);
                    break;
                case 'playing':
                    $('[data-action="play"]')[value ? 'removeClass':'addClass']("btn-danger triggered");
                    break;
                case 'muted':
                    $('[data-action="mute"]')[!value ? 'removeClass':'addClass']("btn-danger triggered");
                    break;
                case 'volume':
                    
                    var slider = elem.data("ionRangeSlider");
                    
                    slider.update({
                        from:value
                    });
                    break;
                case 'time':
                    var elem = $('[data-action="seek"]');

                    //elem.data("ionRangeSlider").destroy();
                    elem.ionRangeSlider({
                        type: "single",
                        min:0,
                        max:data.duration,
                        from:data.time,
                        grid: false,
                        step:1,
                        onChange: function (data) {
                            $(document).trigger("app:change", {action:'seek', value:$('[data-action="seek"]').val()});
                        },
                        prettify: function (num) {
                            return parseInt(num) + "s";
                        }
                    });

                    elem.data("ionRangeSlider").update({
                        min:0,
                        max:data.duration,
                        from:data.time,
                        step:1
                    });
                    break;
                case 'playlist':
                    //build(data, data.playlistIndex);
                    break;
            }
        });
    }
    
    var send = function (action, data, callback) {
        query(action, data, function (d) {
            updateController(processVideoData(d));
        });
        
        return ;
    };

    var query = function (action, data, callback) {
        if (address) {
            $.post({
                url : "http://"+address,
                data: {
                    'action':action,
                    'data' : JSON.stringify({"data":data})
                },
                cache : false,
                success : function (d) {
                    if (typeof callback === "function") {
                        callback(d)
                    }
                }
            });
        } else {
            Core.warn("There is no address for the room!");
        }
    }

    var resolveUrlData = function (url) {
        var regex = /(?:\?v=|\?list=|be\/)(\w*)/,
            result = regex.exec(url);

        return {
            type : result[1].substr(0, 2) == 'PL' ? 'playlist' : 'video',
            id : result[1]
        };
    }

    var getAddress = function ( ) {
        return address;
    }

    var selectRoom = function (server) {
        address = server;
        interval = setInterval(getServerState, 5000);
        getServerState();
    }
    
    return {
        init : init,
        getAddress : getAddress,
        select : selectRoom
    };
});