Core.extend("tmpl", function (core) {
    return {
        compile : function (html) {
            return Handlebars.compile(html);
        }
    }
});