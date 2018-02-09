Core.extend("file", function (core) {
    var file = 'temp.json',
        data = [];
          
    var init = function () {
        $(document).on("app:filesystem", function () {
            load(function (d) {
            });
        });
    };

    var load = function (callback) {
        Core.fs.read(file, function (d) {
            data = d;
            
            callback(d);
        });
    }

    var save = function () {
        Core.fs.write(file, data, function (d) {
            console.log("FILE WRITE CONTENT: ", d);
        });
    };
    
    var get = function (name, callback) {
        callback(data[name]);
    };
    
    var set = function (name, d) {
        data[name] = d;
        save();
    };
    
    return {
        init : init,
        get : get,
        set : set,
    }
});