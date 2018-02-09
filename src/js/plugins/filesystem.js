Core.extend("fs", function (core) {
    var basePath = './',
        defaultData = {};
    
    var filesystem = null,
        options = { create: true, exclusive: false };
    
    var init = function () {
        if (window.requestFileSystem && LocalFileSystem) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystem, onFileSystemError);
        }
    };
    
    /*
     * FILESYSTEM
     */
    var onFileSystem = function (fs) {
        Core.log('file system open: ' + fs.name);
        filesystem = fs;
        $(document).trigger("app:filesystem");
    }
    
    var onFileSystemError = function (filesystem) {
        
    }
    
    var getFileEntry = function (path, options, callback) {
        if (!filesystem) {
            return false;
        }
        
        filesystem.root.getFile(basePath+path, options, function (fileEntry) {
            callback(fileEntry);
        }, onError);
    }

    var writeFile = function (fileEntry, data, callback) {
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function() {
                if (typeof callback === "function") {
                    readFile(fileEntry, callback);
                }
            };

            fileWriter.onerror = function (e) {};

            fileWriter.write(JSON.stringify(data));
        });
    }

    var readFile = function (fileEntry, callback) {
        if (!fileEntry.isFile) {
            writeFile(fileEntry, defaultData);
        }
        
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
                if (typeof callback === "function") {
                    callback(JSON.parse(this.result));
                }
            };

            reader.readAsText(file);

        }, onError);
    }

    var onErrorReadFile = function () {}

    /*
     * FILE
     */
    var read = function (path, callback) {
        getFileEntry(path, options, function (fileEntry) {
            readFile(fileEntry, callback);
        });
    }
    
    var write = function (path, data, callback) {
        getFileEntry(path, options, function (fileEntry) {
            writeFile(fileEntry, data, null);
        }, onError);
    }
    
    var onError = function (fs) {
        Core.warn('file system problem!');
    }
    
    return {
        init : init,
        read : read,
        write : write,
    }
});