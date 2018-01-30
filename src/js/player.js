Core.extend("player", function (core) {
    var host = "http://localhost.apajo.ee:8080/",
        ytURL = "http://www.youtube.com/",
        updateInterval = 5000,
        timeoutHandler = null,
        tmpl = null,
        conf = {
            type: 'POST',
            dataType: 'json',
            async: true,
            crossDomain: true,
        };
    
    var init = function(){
        tmpl = Handlebars.compile("playlist-item");
        
        $(document).on("click", "button[data-action]", function (e){
            var action = $(this).attr('data-action');
            
            switch (action) {
                case 'open':
                    var value = $("#add-input").val(),
                        data = {
                            id : value,
                            type : 'video',
                            autoplay : false
                        };
                        
                    var data = resolveUrlData(value);
                        
                    /* switch (vidData.type) {
                        case 'playlist':
                            data.type = 'playlist';
                            break;
                        default:
                            data.type = 'video';
                    }

                    if (value.length > 0) {
                        value = value.substr(value.indexOf("?"));

                        if (val = getQueryVariable(value, 'v')) {
                            data.type = 'video';
                        } else if (val = getQueryVariable(value, 'list')){
                            data.type = 'playlist';
                        }
                        
                        data.id = val;
                    }*/
                    
                    (function (data){
                        modal('Lisan nimekirja või alustan video mängimist kohe?', {
                                title : "Import",
                                footer : {
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
                                },
                                danger : false
                        });
                    })(data);

                    break;
                case 'seek-track':
                    send(action, $(this).attr('data-index'));
                    break;
                default:
                    send(action, $(this).val());
            }
                       
        });
        
        $(document).on("slideStop", "input[type='range']", function (e, value){
            var action = $(this).attr('data-action');
            send(action, $(this).slider('getValue'));
        });
        
        getInfo();
        
        $("input[type='range']").each(function (i, e) {
            var inst = $(e).slider({
                    formatter: function(value) {
                            return 'Current value: ' + value;
                    }
            });
        });
        
        return true;
    };
    
    var send = function (action, data) {
        $.ajax(host, $.extend(conf, {
                data:{
                    'action':action,
                    'data' : JSON.stringify({"data":data})
                },
                success:function (d) {
                    setTimer();
                    applyVideoData(d);
                }
            }
        ))
    };

    var getInfo = function ( ) {
        $.ajax(host, $.extend(conf, {
                data:{
                    'action':'info',
                },
                success: function (d) {
                    setTimer();
                    applyVideoData(d);
                }
            }
        ));
        
        setTimer();
    }

    var applyVideoData = function (data) {
        if (!data){return;}
        
        Object.keys(data).map(function (a) {
            var value = data[a],
                elem = $('*[data-action="'+a+'"]');
            
            switch (a) {
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
                    elem.val(value);
                    break;
                case 'time':
                    var percent = data.time / data.duration,
                        elem = $('[data-action="seek"]');
                    
                    percent = parseInt(Math.max(Math.min(percent, 1), 0) * 1000);

                     $(elem).slider('setValue', percent).trigger('update');
                    break;
                case 'playlist':
                    //build(data, data.playlistIndex);
                    break;
            }
        });
    }

    var build = function (data, curIndex) {
        $("#playlist").empty();
        
        /*if (data.playlistId) {
            getPlaylistItems(data.playlistId, function (a ) {
                console.log("PLitem", a);
            });
        }*/
        data.playlist.map(function (a, i) {
            var html = tmpl.render({
                name:a,
                id:a,
                index:i,
                active : curIndex == i ? 'bg-secondary' : ''
            });
            $("#playlist").append(html);
        });
   
    };

    var setTimer = function () {
        if (timeoutHandler) {
            clearTimeout(timeoutHandler);
        }
        
        timeoutHandler = setTimeout(getInfo, updateInterval);
    }
    
    function getQueryVariable(text, variable) {
            var query = text.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
            return(false);
    }

    var getPlaylistItems = function (playListId, callback) {
        var videoURL= 'http://www.youtube.com/watch?v=';
        

        $.post('http://www.youtube.com/playlist?list='+playListId, 
        {}, {
            dataType: 'jsonp',
            async: true,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                var list_data="";

                $.each(data.feed.entry, function(i, item) {
                    list_data.push({
                    'feedTitle' : item.title.$t,
                    'feedURL' : item.link[1].href,
                    'fragments' : feedURL.split("/"),
                    'videoID' : fragments[fragments.length - 2],
                    'url' : videoURL + videoID,
                    'thumb' : "http://img.youtube.com/vi/"+ videoID +"/hqdefault.jpg",
                    });
                });

                callback(list_data);
            }
        });
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
        init : init,
        destroy : function(){}
    };
});