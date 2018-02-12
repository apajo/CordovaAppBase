<!DOCTYPE html>
<html>
<head>
    <style>
        html, body {width: 100%; height: 100%; overflow:hidden;}
        #player {
            position: fixed; width: 100%; height: calc(100% - 24px); top:0; left:0;bottom:24px;right:0;
            -webkit-transform: translate3d(0, 0, 0);
            -webkit-backface-visibility: hidden;
            -webkit-perspective: 1000;
        }
        #toolbar {
            position: fixed; width: 100%; height: 24px; left:0; bottom:0;right:0;
            background: #000; font-size: .9em;
        }
        #debug {
            display: none;
            position: fixed; 
            right: 10px; bottom: 10px;
            width: 25%; height: calc(100% - 20px);
            background: rgba(0,0,0,.5);
            color: rgba(255, 255, 255, 1);
        }
        
        .simple-notification {right: 0px !important;}
    </style>

    <script src="controller.js?<?php echo(time()); ?>">
    </script>
    
   <script
  src="https://code.jquery.com/jquery-3.2.1.min.js"
  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
  crossorigin="anonymous"></script>
<script src="libs/simpleNotify.js"></script>
<link rel="stylesheet" type="text/css" href="libs/simpleNotifyStyle.css">
</head>
  <body>
    <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    <div id="player"></div>
    <div id="playerInfo" style="display: none;">{}</div>
        <div id="toolbar">
            <div id="debug"></div>
            </div>
    <script>
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '1920',
          width: '1028',
          suggestedQuality:'hd1080',
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
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
        //player.loadPlaylist({playlist:'PLvbgmMVUKHN7mfJRZLjnynviq4rxWAbb7', index:0,startSeconds:0, suggestedQuality:'hd1080'});
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
        player.setLoop(1);
        player.setShuffle(1);
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        switch (event.data) {
          case YT.PlayerState.ENDED:
              pl.runQueue(YT.PlayerState.ENDED);
            break;
          case YT.PlayerState.PLAYING:
              pl.runQueue(YT.PlayerState.PLAYING);
            if (!done) {
              done = true;
            }
            break;
          case YT.PlayerState.PAUSED:
              pl.runQueue(YT.PlayerState.PAUSED);
            break;
          case YT.PlayerState.BUFFERING:
              pl.runQueue(YT.PlayerState.BUFFERING);
            break;
          case YT.PlayerState.CUED:
            break;
        }
        
        pl.updateInfo();
      }
      function stopVideo() {
        player.stopVideo();
      }
    </script>
  </body>
</html>