Core.extend("room", function (core) {
    var context = null,
        address = null,
        data = {};
        
    var init = function () {
        context = $("#room");
        
        Core.intent.addListener("text/plain", function (d) {
            console.log("room intent", d);
            if (d.length > 0) {
                console.log("room open", d[0].text);
                exec('open', d[0].text);
            }
        });;
        
        $(document).on("app:page:load", function (e, params) {
            if (params.href == "room.html") {
                var server = params.data["data-server"];

                address = server;
                setInterval(getServerState, 5000);
                getServerState();
            }
        });
        
        $(document).on("app:change", function (e, data){
            var action = data.action,
                value = data.value;

            switch (action) {
                case 'volume':
                    exec('volume', value);
                    break;
                case 'seek':
                    exec('seek', value);
                    break;
            }
        });
        
        $(document).on("click", "*[data-action]", function (e){
            var action = $(this).attr('data-action');
            
            console.log(action, this);
            
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
                    var percent = data.time / data.duration,
                        elem = $('[data-action="seek"]');
                    
                    percent = parseInt(Math.max(Math.min(percent, 1), 0) * 1000);

                    var slider = elem.data("ionRangeSlider");

                    slider.update({
                        from:percent
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

    return {
        init : init
    };
});