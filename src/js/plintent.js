Core.extend("plintent", function (core) {
        var init = function () {
            core.intent.addListener("text/plain", function (items, extras) {
                items = items.map(function (a) {
                    var data = resolveUrlData(a.text);
                    
                    data.title = a.text.substr(0, a.text.indexOf(":"));
                    
                    return data;
                });
                
                Core.log(items);
                
                items.map(function (a) {
                    Core.playlist.add(a);
                    //Core.player.load(data.id, data.type);
                });
            });
            
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