Core.extend("server", function (core) {
        var tcpServer = null;
        var tcpSocket = null;
        var interfaces = [];
        var started = false;
        var defaultPort = 8080;
        
        var serverSocketId = null;
        var filesMap = {};


        var init = function () {
            if (chrome.system) {
                chrome.system.network.getNetworkInterfaces(function(ints) {
                    interfaces = ints;
                    
                    Core.main.setInterfaces(interfaces, '8080');
                });
            }
            
            if  (chrome && chrome.sockets) {
                tcpServer = chrome.sockets.tcpServer;
                tcpSocket = chrome.sockets.tcp;
            }
        };
        
        var uninit = function () {
            if (started) {
                stop();
            }
        };      
        
        var start = function (address, callback) {
            var parts = address.split(":"),
                address = parts[0];
                port = parts.length > 0 ? parts[1] : defaultPort;
            
            tcpServer.create({}, function(socketInfo) {
              serverSocketId = socketInfo.socketId;

              tcpServer.listen(serverSocketId, address, parseInt(port, 10), 50, function(result) {
                    if (result >= 0) {
                        console.log("LISTENING:", address, port, result);

                        tcpServer.onAccept.addListener(onAccept);
                        tcpSocket.onReceive.addListener(onReceive);

                        if (typeof callback === "function") {callback();}

                        started = true;
                    }
                })
            });
            
            tcpServer.onAccept.addListener(onAccept);
            tcpSocket.onReceive.addListener(onReceive);
        };
        
        var stop = function () {
            closeServerSocket();
            started = false;
        };

        var isStarted = function () {
            return started;
        };

        var getInterface = function (index) {
            return index ? interfaces[index] : interfaces;
        };

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
            console.log("write response", data);
          var header = getSuccessHeader('/', keepAlive);
          var outputBuffer = new ArrayBuffer(header.byteLength + data.length);
          var view = new Uint8Array(outputBuffer);
          view.set(header, 0);

            view.set(stringToUint8Array(data), header.byteLength);
            sendReplyToSocket(socketId, outputBuffer, keepAlive);
        };

        var onAccept = function(acceptInfo) {
          tcpSocket.setPaused(acceptInfo.clientSocketId, false);

          if (acceptInfo.socketId != serverSocketId)
            return;
        };

        var onReceive = function(receiveInfo) {
          var socketId = receiveInfo.socketId;

          // Parse the request.
          var data = arrayBufferToString(receiveInfo.data);

          // process received post data
          var crlf = String.fromCharCode(13)+String.fromCharCode(10);
          var postData = data.substr(data.indexOf(crlf+crlf) + 4 );
          
          
          var keepAlive = false;
          if (data.indexOf("Connection: keep-alive") != -1) {
            keepAlive = true;
          }


        message.receive(postData, receiveInfo);
        setTimeout(function (){
            write200Response(socketId, Core.player.getInfo(), false);
        }, 300);
        
            return ;
            
          var uriEnd = data.indexOf(" ", 4);
          if (uriEnd < 0) { /* throw a wobbler */ return; }
          var uri = data.substring(4, uriEnd);
          // strip query string
          var q = uri.indexOf("?");
          if (q != -1) {
            uri = uri.substring(0, q);
          }
        };
        
        var message = {
            send : function (data) {
                webview.contentWindow.postMessage(data, '*');
            },
            receive : function (data, raw) {
                var data = parseQuery(decodeURIComponent( data));
                message.send(data);

                if (typeof data.action !== "undefined") {
                    setTimeout(function ( ) {
                        switch (data.action) {
                            case 'info':
                                Core.player.getInfo(true);
                                break;
                            case 'play':
                            case 'mute':
                            case 'seek':
                            case 'volume':
                                Core.player.getInfo(false);
                        }
                        //write200Response(this.socketId, Core.player.getInfo(), false);
                    }.bind(raw), 0);
                }

            },
        }
        
	return {
            init : init,
            uninit : uninit,
            start : start,
            stop : stop,
            isStarted : isStarted
        };
});

var parseQuery = function (url) {

  // get query string from url (optional) or window
  var queryString = url;

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      //paramName = paramName.toLowerCase();
      //paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}