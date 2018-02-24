Core.extend("main", function (core) {
        var data = {};
        
        var init = function () {
            
        };

        var setInterfaces = function (ints) {
            var container = $("#network-interfaces");
            
            container.empty();
            console.log(ints);
            ints.map(function (a) {
                container.append('<li><a href="#" data-value="">Action</a></li>');
            });
        }
        
        return {
            init : init,
            setInterfaces : setInterfaces
        };
});


onload = function() {
  var start = document.getElementById("start");
  var stop = document.getElementById("stop");
  var hosts = document.getElementById("hosts");
  var port = document.getElementById("port");
  var directory = document.getElementById("directory");
  var webview = document.getElementById("webview");
  var localHost = null;
  var localPort = 8080;
  var defaultPort = 8080;
  var localAddress = 'youtube.apajo.ee' + (localPort == defaultPort ? '' : ':' + localPort);

  var tcpServer = chrome.sockets.tcpServer;
  var tcpSocket = chrome.sockets.tcp;

  var serverSocketId = null;
  var filesMap = {};

  var stringToUint8Array = function(string) {
    var buffer = new ArrayBuffer(string.length);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < string.length; i++) {
      view[i] = string.charCodeAt(i);
    }
    return view;
  };

  var arrayBufferToString = function(buffer) {
    var str = '';
    var uArrayVal = new Uint8Array(buffer);
    for (var s = 0; s < uArrayVal.length; s++) {
      str += String.fromCharCode(uArrayVal[s]);
    }
    return str;
  };

  var logToScreen = function(log) {
    logger.textContent += log + "\n";
    logger.scrollTop = logger.scrollHeight;
  };

  var destroySocketById = function(socketId) {
    tcpSocket.disconnect(socketId, function() {
      tcpSocket.close(socketId);
    });
  };

  var closeServerSocket = function() {
    if (serverSocketId) {
      tcpServer.close(serverSocketId, function() {
        if (chrome.runtime.lastError) {
          console.warn("chrome.sockets.tcpServer.close:", chrome.runtime.lastError);
        }
      });
    }

    tcpServer.onAccept.removeListener(onAccept);
    tcpSocket.onReceive.removeListener(onReceive);
  };

  var sendReplyToSocket = function(socketId, buffer, keepAlive) {
    // verify that socket is still connected before trying to send data
    tcpSocket.getInfo(socketId, function(socketInfo) {
      if (!socketInfo.connected) {
        destroySocketById(socketId);
        return;
      }

      tcpSocket.setKeepAlive(socketId, keepAlive, 1, function() {
        if (!chrome.runtime.lastError) {
          tcpSocket.send(socketId, buffer, function(writeInfo) {
            console.log("WRITE", writeInfo);

            if (!keepAlive || chrome.runtime.lastError) {
              destroySocketById(socketId);
            }
          });
        }
        else {
          console.warn("chrome.sockets.tcp.setKeepAlive:", chrome.runtime.lastError);
          destroySocketById(socketId);
        }
      });
    });
  };

  var getResponseHeader = function(file, errorCode, keepAlive) {
    var httpStatus = "HTTP/1.0 200 OK";
    var contentType = "text/plain";
    var contentLength = 0;

    if (!file || errorCode) {
      httpStatus = "HTTP/1.0 " + (errorCode || 404) + " Not Found";
    }
    else {
      contentType = file.type || contentType;
      contentLength = file.size;
    }

    var lines = [
      httpStatus,
      "Content-length: " + contentLength,
      "Content-type:" + contentType
    ];

    lines.push("Access-Control-Allow-Origin: *");


    if (keepAlive) {
      lines.push("Connection: keep-alive");
    }

    return stringToUint8Array(lines.join("\n") + "\n\n");
  };

  var getErrorHeader = function(errorCode, keepAlive) {
    return getResponseHeader(null, errorCode, keepAlive);
  };

  var getSuccessHeader = function(file, keepAlive) {
    return getResponseHeader(file, null, keepAlive);
  };

  var writeErrorResponse = function(socketId, errorCode, keepAlive) {
    console.info("writeErrorResponse:: begin... ");

    var header = getErrorHeader(errorCode, keepAlive);
    console.info("writeErrorResponse:: Done setting header...");
    var outputBuffer = new ArrayBuffer(header.byteLength);
    var view = new Uint8Array(outputBuffer);
    view.set(header, 0);
    console.info("writeErrorResponse:: Done setting view...");

    sendReplyToSocket(socketId, outputBuffer, keepAlive);

    console.info("writeErrorResponse::filereader:: end onload...");
    console.info("writeErrorResponse:: end...");
  };

  var write200Response = function(socketId, data, keepAlive) {
    var header = getSuccessHeader('/', keepAlive);
    var outputBuffer = new ArrayBuffer(header.byteLength + data.length);
    var view = new Uint8Array(outputBuffer);
    view.set(header, 0);



    //var fileReader = new FileReader();
    //fileReader.onload = function(e) {
      view.set(stringToUint8Array(data), header.byteLength);
      sendReplyToSocket(socketId, outputBuffer, keepAlive);
    //};

    //fileReader.readAsArrayBuffer(file);
  };

  var onAccept = function(acceptInfo) {
    tcpSocket.setPaused(acceptInfo.clientSocketId, false);

    if (acceptInfo.socketId != serverSocketId)
      return;
  };

  var onReceive = function(receiveInfo) {
    console.log("READ", receiveInfo);
    var socketId = receiveInfo.socketId;

    // Parse the request.
    var data = arrayBufferToString(receiveInfo.data);
    
    // process received post data
    var crlf = String.fromCharCode(13)+String.fromCharCode(10);
    var postData = data.substr(data.indexOf(crlf+crlf) + 4 );
    message.receive(postData, receiveInfo);
    
    // we can only deal with GET requests
   // if (data.indexOf("GET ") !== 0) {
      // close socket and exit handler
     // destroySocketById(socketId);
      //return;
    //}

    var keepAlive = false;
    if (data.indexOf("Connection: keep-alive") != -1) {
      keepAlive = true;
    }

    var uriEnd = data.indexOf(" ", 4);
    if (uriEnd < 0) { /* throw a wobbler */ return; }
    var uri = data.substring(4, uriEnd);
    // strip query string
    var q = uri.indexOf("?");
    if (q != -1) {
      uri = uri.substring(0, q);
    }
    /* var file = filesMap[uri];
    if (!!file == false) {
      console.warn("File does not exist..." + uri);
      writeErrorResponse(socketId, 404, keepAlive);
      return;
    }
    logToScreen("GET 200 " + uri);*/
    write200Response(socketId, getPlayerInfo(), false);
      
    //write200Response(socketId, file);
  };

  directory.onchange = function(e) {
    closeServerSocket();

    var files = e.target.files;

    for (var i = 0; i < files.length; i++) {
      //remove the first first directory
      var path = files[i].webkitRelativePath;
      if (path && path.indexOf("/") >= 0) {
        filesMap[path.substr(path.indexOf("/"))] = files[i];
      } else {
        filesMap["/" + files[i].fileName] = files[i];
      }
    }

    start.disabled = false;
    stop.disabled = true;
    directory.disabled = true;
  };

  start.onclick = function() {

    tcpServer.create({}, function(socketInfo) {
      serverSocketId = socketInfo.socketId;

      tcpServer.listen(serverSocketId, '192.168.0.12', parseInt(localPort, 10), 50, function(result) {
        console.log("LISTENING:", result);

        tcpServer.onAccept.addListener(onAccept);
        tcpSocket.onReceive.addListener(onReceive);
      });
    });

    directory.disabled = true;
    stop.disabled = false;
    start.disabled = true;
    
    setToolbarData();
  };

  stop.onclick = function() {
    directory.disabled = false;
    stop.disabled = true;
    start.disabled = false;
    Client.stop();
    closeServerSocket();
  };

  chrome.system.network.getNetworkInterfaces(function(interfaces) {
      localHost = interfaces[0];
  });

    var message = {
        send : function (data) {
            webview.contentWindow.postMessage(data, '*');
        },
        receive : function (data, raw) {
            var data = parseQuery(decodeURIComponent( data));
            console.log("Forwarding: ", data);
            message.send(data);
            
            if (typeof data.action !== "undefined") {
                setTimeout(function ( ) {
                    switch (data.action) {
                        case 'info':
                            getPlayerInfo(true);
                            break;
                        case 'play':
                        case 'mute':
                        case 'seek':
                        case 'volume':
                            getPlayerInfo(false);
                    }
                    //write200Response(this.socketId, getPlayerInfo(), false);
                }.bind(raw), 0);
            }

        },
    }
   
    
    var setToolbarData = function () {
        document.getElementById("overlay-content").innerHTML = localAddress;
    }
    
    var playerInfo = {};
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

    webview.addEventListener("loadstart", loadstart);
    webview.addEventListener("loadstop", loadstop);
};