Core.extend("events", function (core) {
        var init = function () {
            // ESC KEY
            $(document).keyup(function(e) {
                if (e.keyCode == 27) { 
                   onBackbutton(e);
                }
            });
            // BACKBUTTON / menu button
            document.addEventListener('deviceready', function () {
                document.addEventListener('menubutton', onMenubutton, false);
                document.addEventListener('backbutton', onBackbutton, false);
            });
            
            $(document).on("click", "#fb-login", function (e) {
                core.fb.login();
            });
            

            return true;
        };

        var onBackbutton = function (e) {
            Core.log(e);
            var elems = $("body").find("*[data-backbutton]");
            
            for (var i = 0; i < elems.length; i++) {
                var elem = $(elems[i]),
                    data = elem.attr("data-backbutton");
                
                if (elem.hasClass(data)) {
                    elem.removeClass(data);
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    return false;
                }
            } 
            
            Core.end();
            
            return true;
        }

        var onMenubutton = function (e) {
            Core.log(e);
            var elems = $("body").find("*[data-menubutton]");
            
            for (var i = 0; i < elems.length; i++) {
                var elem = $(elems[i]),
                    data = elem.attr("data-menubutton");
                
                if (!elem.hasClass(data)) {
                    elem.addClass(data);
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    return false;
                }
            } 
            
            return true;
        }

	return {
            init : init,
        };
});