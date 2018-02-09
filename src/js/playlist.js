Core.extend("playlist", function (core) {
    var list = [];
          
    var init = function () {
        $(document).on("app:filesystem", function () {
            Core.fs.get("list");
            console.log("LIST", list);
        });
    };

    var uninit = function () {
        Core.file.set("list", list);
    };

    var add = function (data) {
        list.push(data);
        Core.file.set("list", list);
    }
    
    return {
        init : init,
        uninit : uninit,
        add : add
    }
});