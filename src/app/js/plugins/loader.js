Core.extend("loader", function (core) {
    var id = 'modal-loading',
        container = $("#modals"),
        defaultText = "Loading...";

    /*
     * HTML
     */
    var context = $(`<div id="`+id+`" class="modal fade" role="dialog" data-backdrop="static">
                <div class="vertical-alignment-helper">
                    <div class="modal-dialog modal-sm vertical-align-center">
                        <!-- Modal content-->
                        <div class="_modal-content text-warning">
                            <div class="_modal-body content center-text">
                                <!-- <i class="loading-icon fa fa-bed"></i>
                                <i class="loading-icon fa fa-music"></i> -->
                                <i class="loading-icon fa fa-spinner"></i><br />
                                <span class="message">Loading...</span><br />
                                <span class="progress"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
    /*
     * CSS
     */
    $("<style>").html(`
        #modal-loading .content {font-size: 2em;}
        #modal-loading .loading-icon {font-size: 4em;}
        
        #modal-loading .loading-icon .message {}
        #modal-loading .loading-icon {
            font-size: 2em;
            display: inline-block; width: 1em; height: 1em;
            -webkit-animation: load-spin 3s infinite linear;
            animation: load-spin 3s infinite linear;
        }
        
        @-webkit-keyframes load-spin {
            100% { -webkit-transform: rotate(360deg); }
        }
        @-moz-keyframes load-spin {
            100% { -moz-transform: rotate(360deg); }
        }
        @keyframes load-spin {
            100% {
                -moz-transform:rotate(360deg);
                -o-transform:rotate(360deg);
                transform:rotate(360deg);
            }
        }
    `).appendTo("head");

    return {
        init : function () {
            container.append(context);

            //Core.loader.start("Please wait...");

            return true;
        },

        /*
         * Open modal loader (nopt context dependant) (with custom message)
         */
        start: function (info) {
            context = $("#"+id);
            context.find(".message").html(typeof info !== "undefined" ? info : defaultText);

            if (!context.hasClass('in')) {
                context.modal('show');
            }
        },

        /*
         * Close the modal loader
         */
        end : function (info) {
            context = $("#"+id);

            if (context.hasClass('in')) {
                context.modal('hide');
            }
        }
    }
});