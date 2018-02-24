    /*
 * Makes an ajax query to a server
 */
Core.extend("query", function (core) {
	var server = "ytrc.apajo.ee/app/user/?";

	return function (object, data, success, failed) {
            var path = "http://"+server+
                            (typeof object === "string" ? object : "/" + object.join("/"));

            //if (true || navigator.onLine) {
                $.ajax({
                    "type": 'post',
                    "url" : path,
                    dataType: 'jsonp',
                    async : true,
                    data : {},
                    xhrFields: {
                        //withCredentials: true
                        },
                    success: function(data, status, xhr){

                        try {
                            success.apply(this, arguments);
                        } catch (err) {
                            Core.error("ERROR: " + err.toString());
                        }
                    },
                    error: failed
                });
            /* } else {
                Core.log("No Connection!");
                failed(null, "Interneti ühendus puudub!");
            }*/
		};
});