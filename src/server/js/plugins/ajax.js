    /*
 * Makes an ajax query to a server
 */
Core.extend("query", function (core) {
	var server = "http://ytrc.apajo.ee/app/room/?";

	return function (object, data, success, failed) {
            var path = server+
                            (typeof object === "string" ? object : "/" + object.join("/"));

            //if (true || navigator.onLine) {
                _$.ajax({
                    "type": 'post',
                    "url" : path,
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
                Core.log("No Connection!");
                failed(null, "Interneti ühendus puudub!");
            }*/
		};
});