/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    ready : {
        device : false,
        document : false
    },
    
    // Application Constructor
    initialize : function() {
        this.bindEvents();
        
        $.get("cordova.js", function ( ){
            $.ajax({
                url: "cordova.js",
                dataType: "script",
                cache: true,
                success: function() {
                }
            })
        }).fail(function() {
            app.receivedEvent('deviceready');
        });;

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).ready(this.onDocumentReady);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDocumentReady: function() {
        app.receivedEvent('documentready');
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        switch (id) {
            case 'documentready':
                app.ready.document = true;
                break;
            case 'deviceready':
                app.ready.device = true;
                break;
        }
        
        if (app.ready.document && app.ready.device) {
            Core.init();
        }
    }
};

// fake navigator
(function ( ) {
    Object.defineProperty(navigator, 'platform', {
        value: 'Unix',
        configurable: true // necessary to change value more than once
    });
    Object.defineProperty(navigator, 'appVersion', {
        value: 'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.8.1.12) Gecko/20080214 Firefox/2.0.0.12',
        configurable: true // necessary to change value more than once
    });
})();

app.initialize();
