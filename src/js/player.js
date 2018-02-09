Core.extend("player", function (core) {
    var contextId = 'player',
        loaded = false,
        instance = null,
        options = {
            height: window.innerHeight,
            width: window.innerWidth,
            suggestedQuality:'medium',//'hd1080',
            //videoId: '4d1_OVCv-zg',
            playerVars: 
            {
              listType:'playlist',
              list: 'PLWenDbXlMqij3QXYlLy__coqtpFdpq0bF',
              'rel': 0,
              'showinfo': 1,
              'autoplay': 1,
              'loop': 1,
              'shuffle' : 1,
              'autohide': 1,
              'color': 'white',
              'theme': 'light',
              'controls': 1
            },
            events: {
              'onReady': play,
              'onStateChange': onState
            }
          };
          
    var init = function () {
        $(document).on("app:page:load", function (e, data) {
            $.getScript("https://www.youtube.com/iframe_api");
        });
        
        if (!loaded) {
            $(document).on("app:page:load", function (e, data) {
                $.getScript("https://www.youtube.com/iframe_api");
            });
        } else {
            ready();
        }
    };

    var ready = function () {
        loaded = true;
        instance = new YT.Player(contextId, options);
    };

    var onState = function (event) {
        switch (event.data) {
          case YT.PlayerState.ENDED:
              //pl.runQueue(YT.PlayerState.ENDED);
            break;
          case YT.PlayerState.PLAYING:
              //pl.runQueue(YT.PlayerState.PLAYING);
            if (!done) {
              done = true;
            }
            break;
          case YT.PlayerState.PAUSED:
              //pl.runQueue(YT.PlayerState.PAUSED);
            break;
          case YT.PlayerState.BUFFERING:
              //pl.runQueue(YT.PlayerState.BUFFERING);
            break;
          case YT.PlayerState.CUED:
            break;
        }
    }

    var play = function (e) {
        e.target.playVideo();
        instance.setLoop(1);
        instance.setShuffle(1);
    }
    
    var stop = function ( ) {
        instance.stopVideo();
        instance = null;
    }

    var load = function (id, type) {
        if (instance) {
            instance.loadPlaylist({
                listType: type,
                list: id,
                'suggestedQuality' : 'medium',
                shuffle : true,
                autoplay: true,
                startOpened : false,
            });
        }
    }

    return {
        init : init,
        ready : ready,
        play : play,
        stop : stop,
        state : onState,
        load : load
    };
});



function onYouTubeIframeAPIReady() {
    Core.player.ready();
  
  //player.loadPlaylist({playlist:'PLvbgmMVUKHN7mfJRZLjnynviq4rxWAbb7', index:0,startSeconds:0, suggestedQuality:'hd1080'});
}
