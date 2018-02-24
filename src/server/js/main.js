Core.extend("main", function (core) {
        var data = {};
        
        var init = function () {
            
        };

        var setInterfaces = function (ints, port) {
            var container = $("#network-interfaces");
            
            container.empty();
            ints.map(function (a) {
                var addr = a.address + (port ? ':'+port : '');
                
                container.append('<li><a href="#" data-value="'+addr+'">'+addr+'</a></li>');
            });
            
            $('input[name="name"]').val(ints[0].address);
            $('input[name="address"]').val(container.find("li a").first().attr("data-value"));
        }
        
        return {
            init : init,
            setInterfaces : setInterfaces
        };
});