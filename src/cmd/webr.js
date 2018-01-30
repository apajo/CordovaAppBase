var fs = require('fs');
var json = fs.readFileSync('resources.json', 'utf8');
var data = JSON.parse(json);
const path = require('path');

var from = "/home/andres/Desktop/cordova/YTRC/ytrc/src/";
var target = "/home/andres/Desktop/cordova/YTRC/ytrc/www/vendor/";

var getBasePath = function (name) {
    return ['src', 'core'].indexOf(name) >= 0 ?
        '/home/andres/Desktop/cordova/YTRC/ytrc/src/' :
                '/home/andres/Desktop/cordova/YTRC/ytrc/node_modules/'
}

var doCopy = function (from, to) {
    try {
        //mkdirp(to);
        ensureDirectoryExistence(to);
    } catch (e) {console.log(e);}
    console.log(from+"------->"+to);
    fs.createReadStream(from).pipe(to);
}

function mkdirp(filepath) {
    var dirname = path.dirname(filepath);

    if (!fs.existsSync(filepath)) {
        mkdirp(dirname);
    }

    fs.mkdirSync(filepath);
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

var tasks = {
    js : function (name, data, done) {
        data.map(function (a) {
            doCopy(getBasePath(name)+a,target+a);
        });
    },
    css : function (name, data, done) {
    },
}

var groups = Object.keys(data);
Object.keys(tasks).map(function (task) {
    groups.map(function (name) {
        console.log(name +'_'+task+':');
        console.log('-----------------');
        
        tasks[task](name, data[name][task]);
        //gulp.task(task+"_"+name, function (done) {
         //   return tasks[task](name, data[name][task], done);
        //});
    });
});