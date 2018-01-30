Core.extend("selector", function (core) {
    var init = function(){
        $("#video-selector").on("click", function (e) {
                        modal('Lisan nimekirja või alustan video mängimist kohe?', {
                                title : "Import",
                                content : '<iframe id="selector-frame" src="https://www.google.ee/search?q=embed+google+video+search&client=ubuntu&hs=hxU&source=lnms&tbm=vid&sa=X&ved=0ahUKEwivqd_MqpfYAhVMJlAKHeiDDCkQ_AUICigB&biw=1096&bih=644" sandbox></iframe>',
                                fullscreen : true,
                                footer : {
                                        "Katkesta" : function (modal) {
                                            return true;
                                        },
                                        "Lisa" : function ( ) {
                                            alert($("#selector-frame").attr("src"));
                                            return true;
                                        },
                                },
                                danger : false
                        });
        });
        
        return true;
    }

    return {
        init : init,
        destroy : function(){}
    };
});
