Core.extend("alert", function (core) {
    var context = $(`<div id='alerts'>`).appendTo("body");
        defaults = {
            success : {
                title : "OK!",
                dismissable : true,
                type : "success",
                error : false,
                duration : 4
            },
            warning : {
                title : "HOIATUS!",
                dismissable : true,
                type : "warning",
                error : false,
                duration : 7
            },
            error : {
                title : "VIGA!",
                dismissable : true,
                type : "error",
                error : true,
                duration : 10
            }
        };
    
    /*
     * HTML
     */
    var baseElem = $(`
            <div class="float-alert alert alert-dismissable fade in"><a data-dismiss="alert">
                <!--<button type="button" class="close" data-dismiss="alert">×</button> -->
                <h4 class="title">Tähelepanu!</h4>
                <p class="message">...</p>
            <a></div>
        `);
            
    /*
     * CSS
     */
    $("<style>").html(`
        #alerts { position: fixed; top: .5em; right: .5em; width: 20em; max-width: 50%; z-index: 100;}
        #alerts .alert > a {text-decoration: none;}
        
        .float-alert {float: right; padding-top: .5em; margin-bottom: .5em; font-size: 1em;}
        .float-alert .message {margin:0;}
    `).appendTo("head");
    
    window.onerror = function(msg, url, line, column, errorObj) {
        var idx = url.lastIndexOf("/"),
            msg = "",
            suppressErrors = false;//Core.isApp();

        if(idx > -1) {url = url.substring(idx + 1);}
        
        msg = "<b>ERROR in " + (url !== "" ? url : "<anonymous>") + " @ " + line + ":"+column+"!</b><br />" +
                (msg.length == 0 ? errorObj : msg) + "</b>";
        
        // add stack data if there is any
        if (errorObj !== null){
            var stack = 'Stack:<br />' + errorObj;
        
            msg +='<a class="pull-right" href="#" onClick="this.nextSibling.style.display=\'initial\'; return false;"><i class="fa fa-angle-double-down"></i></a><div style="display: none;">'+
            stack+'</div>';
        }

        try {
            if (Core.DEBUG()) {
                //Core.alert(msg, {title:"JS ERROR", error:true});
            }
            
            return suppressErrors;
        } catch (e) {   }
        
        return suppressErrors; //suppress Error Alert;
    };
    
    return function (msg, params) {
        var type = params === true || $.extend(defaults[type], params)["error"] === true ? "error" : "success",
            params = $.extend(defaults[type], params),
            elem = baseElem.clone();
            
        if (type == "error") {navigator.vibrate(1000);}

        elem.addClass(
            type !== "error" ? "alert-success" : "alert-danger" 
        ).find(".title").html(params.title).siblings(".message").html(msg);
        
        if (params.duration > 0) {
            setTimeout(function ( ) {
                elem.alert("close")
            },params.duration * 1000);
        }
        
        context.append(elem);
    };
});