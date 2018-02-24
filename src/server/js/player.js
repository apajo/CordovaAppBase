Core.extend("player", function (core) {
        var playerInfo = {},
            webview = null;
        
        var init = function () {
            $(document).on("app:page:load", function (e, params) {
                if (params.href == "player.html") {
                    start();
                }
            });
        };
        
        var start = function () {
            webview = document.getElementById("webview");
            
            webview.addEventListener("loadstart", loadstart);
            webview.addEventListener("loadstop", loadstop);
        };
        
        var setToolbarData = function () {
            document.getElementById("overlay-content").innerHTML = localAddress;
        }

        var getPlayerInfo = function () {
            return playerInfo;
        }
        var updatePlayerInfo = function () {
            webview.executeScript(
                {code: 'window.document.documentElement.querySelector("#playerInfo").innerHTML'},
                function(results) {
                    if (results && results.length > 0) {
                        playerInfo = results[0];

                        playerInfo.playlist = [];
                        delete playerInfo.playlist;
                    }
                });
        }

        var loadstart = function() {
            setInterval(updatePlayerInfo, 1000);
            updatePlayerInfo();
        }
        var loadstop = function() {
            //chrome.runtime.onMessage.addListener(message.playerReceive);
        }

	return {
            init : init,
            open : open,
            getInfo : getPlayerInfo
        };
});