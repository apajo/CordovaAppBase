Core.extend ("modal", function (core) {
    var context = null;

    var createAlert = function (msg) {
        createModal("Tähelepanu!", msg, {
            "Ok" : function (modal) {
                return true;
            }
        });
    };

    var createModal = function (title, content, buttons) {
        var id = context.find('> .modal').length,
            html = `<div class="modal fade"  tabindex="-1" role="dialog" id="modal-`+id+`">
                <div class="modal-dialog  modal-sm">
                    <div class="modal-content"> 
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 class="modal-title"></h4></div>
                        <div class="modal-body"></div>
                        <div class="modal-footer"></div>
                    </div>
                </div>
            </div>`;

        var elem = context.append(html);
        
       var elem = context.find('> .modal').last();
            elem.find(".modal-title").append(title);
            elem.find(".modal-body").append(content);
            //elem.find(".modal-footer").append(footer.join(""));

        setTimeout(function () {
            elem.modal("show");
        }, 100);
        
        var footer = elem.find(".modal-footer");
        for (var i in buttons) {
            //  data-dismiss="modal"
            var btn = $(`<button type="button" class="btn" name="`+i+`">`+i+`</button>`);
            footer.append(btn);

            (function (i) {
                footer.find("button[name='"+i+"']").on("click", function () {
                    if (typeof buttons[i] === "function") {
                        if (buttons[i](elem[0])) {
                            elem.modal("hide");
                        }
                    }
                });
            })(i);
        }

        return elem;
    }

    var modal = function (content, params) {       
        params = Object.assign({
            title : 'Tähelepanu',
            content : content,// || 'Tähelepanu soisukeks lorem ipsum dolor sitt amet!',
            type : "success",
            fullscreen : false,
            danger : false,
            footer : {
                "OK" : function () {
                    return false;
                }
            }
        }, params || {}); 

        var elem = createModal(
            params.title,
            params.content,
            params.footer
        );

        elem.modal({
            backdrop : true,
            keyboard : true,
            show : true
            // remote : true
        });

        elem.find(".modal-title").addClass(params.danger ? " text-danger" : "");

        elem.find(".modal-dialog").addClass(params.fullscreen ? "modal-lg modal-full" : "modal-sm");

        elem.find(".modal-footer .btn:last").addClass(params.danger ? "btn-danger" : '');

        setTimeout(function () {
            elem.modal("show");
        }, 100);
        

       return elem; 
    };


    
    var dialogs = {
        init : function () {
            context = $(`<div id='modals'>`).appendTo("body");
            return true;
        },
        open : createModal,
        alert : createAlert,
    };
    
    return dialogs;
});