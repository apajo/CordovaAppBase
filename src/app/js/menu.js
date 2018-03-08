Core.extend("menu", function (core) {
	var baseUrl = 'html/pages/',
            context = null,
            container = null,
            lastHref = null;
        
        var init = function () {
            context = $(".sidebar");
            container = $("#content-container");
            
            context.on("click", "li a", function (e) {
                e.preventDefault();
                e.stopPropagation();

                select($(this));
            });
        };
        
        var select = function  (elem) {
            var href = elem.attr("href"),
                target = elem.attr("data-type");

            if (href) {
                activateLink(elem);
            }

            load(href, target, elem);

            return false;
        }
        
        var load = function (href, target, elem) {
            $(document).trigger("app:page:unload", lastHref);
            
            $.get(baseUrl + href, function (d) {
                switch (target) {
                    case 'layout':
                        $("#layout-container").html(d);
                        break;
                    default:
                        container.html(d);
                }
                
                $(document).trigger("app:page:load", {href:href, data:getAttributes(elem)});
                lastHref = href;
            });
        };
        
        var activateLink = function  (elem) {
            context.find("li").removeClass("active");
            elem.parent("li").addClass("active");
        }
        
        var getAttributes = function  ( $node ) {
            var attrs = {};
            $.each( $node[0].attributes, function ( index, attribute ) {
                attrs[attribute.name] = attribute.value;
            }
        );

    return attrs;
}
        
	return {
            init : init,
            select : select
        };
});

(function(old) {
  $.fn.attr = function() {
    if(arguments.length === 0) {
      if(this.length === 0) {
        return null;
      }

      var obj = {};
      $.each(this[0].attributes, function() {
        if(this.specified) {
          obj[this.name] = this.value;
        }
      });
      return obj;
    }

    return old.apply(this, arguments);
  };
})($.fn.attr);