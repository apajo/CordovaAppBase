Core.extend("plintent", function (core) {
        var init = function () {
            /*core.intent.addListener("text/plain", function (items, extras) {
                Core.log(items);
                
                items = items.map(function (a) {
                    return resolveUrlData(a.text);
                });
                
                Core.log(items);
            });
            */
            return true;
        };
        
        var resolveUrlData = function (url) {
            var regex = /(?:\?v=|\?list=|be\/)(\w*)/,
                result = regex.exec(url);

            return {
                type : result[1].substr(0, 2) == 'PL' ? 'playlist' : 'video',
                id : result[1]
            };
        }

	return {
            init : init
        };
});