Core.extend("pldata", function (core) {
    var getPlaylistItems = function (playListId, callback) {
        var videoURL= 'http://www.youtube.com/watch?v=';
        

        $.post('http://www.youtube.com/playlist?list='+playListId, 
        {}, {
            dataType: 'json',
            async: true,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                var list_data="";

                $.each(data.feed.entry, function(i, item) {
                    list_data.push({
                    'feedTitle' : item.title.$t,
                    'feedURL' : item.link[1].href,
                    'fragments' : feedURL.split("/"),
                    'videoID' : fragments[fragments.length - 2],
                    'url' : videoURL + videoID,
                    'thumb' : "http://img.youtube.com/vi/"+ videoID +"/hqdefault.jpg",
                    });
                });

                callback(list_data);
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