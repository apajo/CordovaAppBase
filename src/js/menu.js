Core.extend("menu", function (core) {
	var baseUrl = 'html/pages/',
            context = null,
            container = null,
            lastHref = null;
        
        var init = function () {
            context = $(".sidebar");
            container = $("#content-container");
            
            context.find("li a").on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                var href = $(this).attr("href"),
                    target = $(this).attr("data-type");
                
                if (href) {
                    activateLink($(this));
                }
                
                load(href, target);
                
                return false;
            });
        };
        
        var load = function (href, target) {
            $(document).trigger("app:page:unload", lastHref);
            
            $.get(baseUrl + href, function (d) {
                switch (target) {
                    case 'layout':
                        $("#layout-container").html(d);
                        break;
                    default:
                        container.html(d);
                }
                
                $(document).trigger("app:page:load", href);
                lastHref = href;
            });
        };
        
        var activateLink = function  (elem) {
            context.find("li").removeClass("active");
            elem.parent("li").addClass("active");
        }
        
	return {
            init : init,
            
        };
});