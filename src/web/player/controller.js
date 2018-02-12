var pl = (function () {
    var cue = [];
    
    var init = function(){
        window.addEventListener('message', onMessage);
        
        setInterval(updateInfo, 2000);
    };
    
    var queue = function (type, callback) {
        cue.push({'type':type, 'callback':callback});
    }
    
    var runQueue = function (type) {
        for (var i in cue) {
            if (cue[i].type == type) {
                
                if (typeof cue[i].callback === "function") {
                    cue[i].callback();
                }
                
                cue.splice(i, 1);
            }
        }
        
        debug("RUNAFTER:("+type+")"+JSON.stringify(cue.map(function (a) {
                                    return a.type;
                                })));
    }
    
    var onMessage = function (e) {
        var d= e.data,
            data=d.data;
    
            try {
                data=JSON.parse(data)['data'];
            } catch (e) {}
    
        if (typeof d.action !== 'undefined'){
            debug(JSON.stringify(d));
        }
    
        switch (d.action){
            case 'open':
                if (data) {
                    switch (data.type) {
                        case 'playlist':
                            message('Playing playlist: ' + data.id);
                            
                            player.loadPlaylist({
                                listType: data.type,
                                list: data.id,
                                'suggestedQuality' : 'hd1080',
                                shuffle : true,
                                autoplay: true,
                                startOpened : false,
                            });
                            break;
                        case 'video':
                            var list = player.getPlaylist();
                            list.push(data.id);
                            
                            if (data.autoplay) {
                                player.loadPlaylist(
                                    list,
                                    list.length - 1,
                                    0,
                                    'hd1080'
                                );
                                message('Adding and playing video: ' + data.id);
                            } else {
                                debug('CUEB4'+JSON.stringify(cue.map(function (a) {
                                    return a.type;
                                })));
                                
                                queue(YT.PlayerState.ENDED, function () {
                                    var list = player.getPlaylist();
                                    list.push(data.id);

                                    player.loadPlaylist(
                                        list,
                                        list.length - 1,
                                        0,
                                        'hd1080'
                                    );
                                });
                                
                                debug('CUEAF'+JSON.stringify(cue.map(function (a) {
                                    return a.type;
                                })));
                            }
                            message('Added video: ' + data.id);


                            /* player.cueVideoById({
                                videoId:'JSda4gCiOf4',
                                startSeconds:0,
                                endSeconds:0,
                                autoplay: true,
                                'suggestedQuality' : 'hd1080'
                            });*/
                            break;
                    }
                    setTimeout(updateInfo, 0);
                }
                break;
            case 'seek':
                var percent = Math.min(Math.max(parseFloat(data) / 1000, 0), 1);
                
                message('Seeking to ' + parseInt(percent * 100) + '%');

                player.seekTo(player.getDuration() * percent);
                break;
            case 'seek-track':
                player.playVideoAt(parseInt(data));
                break;
            case 'play':
                if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
                    player.playVideo();
                } else { 
                    player.pauseVideo();
                }
                break;
            case 'next':
                player.nextVideo();
                break;
            case 'prev':
                player.previousVideo();
                break;
            case 'mute':
                if (!player.isMuted()) {
                    player.mute();
                } else {
                    player.unMute();
                    player.setVolume(player.getVolume());
                }
                break;
            case 'volume':
                var volume = Math.min(Math.max(parseFloat(data), 0), 100)
                player.unMute();
                player.setVolume(volume);
                message('Volume set: ' + volume + '%');
                break;
            case 'info':
                break;
        }
    };

    var getInfo = function () {
        if (!player) {return {};}
       
       var data = typeof player.getVideoData == "function" ? player.getVideoData() : null;
       
       try {
            return {
                'thumbnail' : data ? ('https://img.youtube.com/vi/'+data.video_id+'/0.jpg') : false,
                'video': data ? data.title : '',
                'url' : player.getVideoUrl(),
                'playing' : player.getPlayerState() == YT.PlayerState.PLAYING,
                'state' : YT.PlayerState.PLAYING,
                'volume' : player.getVolume(),
                'muted' : player.isMuted(),
                'time' : player.getCurrentTime(),
                'duration' : player.getDuration(),
                'quality' : player.getPlaybackQuality(),
                'playlist' : player.getPlaylist(),
                'playlistId' : player.getPlaylistId(),
                'playlistIndex' : player.getPlaylistIndex(),
                //'player' : player
             };
       } catch (e){}
       
       return null;
    };

    var updateInfo = function () {
        document.getElementById("playerInfo").innerHTML=JSON.stringify(getInfo());
    }

    var debug = function (txt) {
        var text = document.getElementById("debug").innerHTML;
        
        document.getElementById("debug").innerHTML = text.substr(0, 100) + '<br />' + txt;
    }

    var message = function (txt, danger) {
        simpleNotify(txt, 5, danger === true ? 'warning' : 'good')
    }

    return {
        init : init,
        onMessage : onMessage,
        updateInfo : updateInfo,
        runQueue : runQueue
    }
})();

pl.init();