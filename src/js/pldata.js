Core.extend("pldata", function (core) {
    var getPlaylistItems = function (playListId, callback) {
        var videoURL= 'http://www.youtube.com/watch?v=';
        

        $.ajax({
            type: "GET",
            url:'https://www.youtube.com/playlist?list='+playListId,
            success: function( data ) {
                var dom = $(data);

                var listItems = dom.find(".ytd-playlist-video-renderer");
                console.log(listItems);
                var result = {
                    title : dom.find("#title").text(), 
                    list : dom.find("#title").text(), 
                };

                return result;
            }
        });
    }
    var resolveUrlData = function (url) {
        var regex = /(?:\?v=|\?list=|be\/)(\w*)/,
            result = regex.exec(url);

        return {
            type : result[1].substr(0, 2) == 'PL' ? 'playlist' : 'video',
            id : result[1]
        };
    }

    return {
        getPlaylistItems : getPlaylistItems,
        resolveUrlData: resolveUrlData
    };
});