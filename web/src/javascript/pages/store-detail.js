jQuery(function($) {
    var $storeDesc = $(".store-description");
    var $moreLink = $storeDesc.next(".read-more");
    var height = 0;
    var TRUNC_CLASS = "trunc";

    function showStoreDesc() {
        $.fancybox($storeDesc.clone(), {
            type: "inline",
            padding: 10
        });
    }

    function init() {
        height = $storeDesc.height();
        $storeDesc.addClass(TRUNC_CLASS);

        $moreLink.on("click", function(e){
            showStoreDesc();
        });
    }

    init();
});