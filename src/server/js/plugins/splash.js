Core.extend("splash", function (core) {
    var context = $("#splash"),
        states = ["close", "open"],
        animDurMultiplier = core.DEBUG() ? 0 : 1;
    
    
    /*
     * CSS
     */
    $("<style>").html(`
        #splash {
            position: fixed; top: 0; bottom: 0; right: 0; left: 0; width: 100%;
            height: 100%;
            z-index: 999999;
            background-color: transparent;
            /* background-image: url('../img/logo.png'); */
            background-position: 40% center;
            background-size: 9em auto;
            background-repeat: no-repeat;
            
            transform: translate3d(0, 55%, 0) scale3d(.45, .45, 0);
            transition: transform 1s ease;
        }
        body.splash #splash .modal-backdrop {display:block;}
        body #splash .modal-backdrop {display: none;}
        #splash iframe {position: fixed; top: 50%; bottom: 50%; left:50%; right: 50%; border:0;
        margin: -60px 0 0 -35px; width: 125px; height: 80px;}


        body.splash #splash {
            transform:  translate3d(0, 0, 0) scale3d(1, 1, 1);
            transition: transform 1s ease;
        }
    `).appendTo("head");

    
    var generateElem = function (state) {
        return $("<iframe src='img/eye_"+states[state]+".html#"+Math.random()+"'></iframe>");
    };
    
    return {
        hide : function (callback) {
            context.find("iframe").remove();
            context.append(generateElem(1));
            
            setTimeout(function () {
                $("body").removeClass("splash");
            }, 4000 * animDurMultiplier);
            
            setTimeout(callback, 4000 * animDurMultiplier);

            try {
                navigator.splashscreen.hide();
            } catch (e) {
               // Core.log("splashscreen.err", e);
            }
        },
        
        show : function ( ) {
            $("body").addClass("splash");
            
            context.find("iframe").remove();
            context.append(generateElem(0));
        }
    }
});