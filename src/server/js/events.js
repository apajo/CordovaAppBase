Core.extend("events", function (core) {
        var init = function () {
            $("form#settings").on("submit", function  (e) {
                // get all the inputs into an array.
                var $inputs = $('input', e.target);

                // not sure if you wanted this, but I thought I'd add it.
                // get an associative array of just the values.
                var values = {};
                $inputs.each(function() {
                    values[this.name] = $(this).val();
                });

                Core.server.start(values.address, function () {
                    Core.client.start(values, function (){
                        Core.menu.load('player.html', 'page');
                    });
                });
                
                
                e.stopPropagation();
                e.preventDefault();
                
                return false;
            });

            return true;
        };

	return {
            init : init
        };
});