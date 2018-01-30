    /*
 * Makes an ajax query to a server
 */
Core.extend("query", function (core) {
	var server = "backtube.apajo.ee/public/app";//192.168.0.12/BackTube/laravel/public/app

	return function (object/* , action, data*/, success, failed) {
            var path = "http://"+server+
                            (typeof object === "string" ? object : "/" + object.join("/"));

            //if (true || navigator.onLine) {
                $.ajax({
                    "type": 'post',
                    "url"		: path,
                    dataType: 'jsonp',
                    async : true,
                    data : {},
                    xhrFields: {
                        //withCredentials: true
                        },
                    success: function(data, status, xhr){

                        try { success.apply(this, arguments); } catch (err) {}
                    },
                    error: failed
                });
            /* } else {
                console.log("No Connection!");
                failed(null, "Interneti ühendus puudub!");
            }*/
		};
});