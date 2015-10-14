jQuery(function($){
    var $userMenu = $(".menu.user-links");
    var $productCount;
    var $storeCount;
    var pollCount = 0;

    /* Function to find store/product count components after they are loaded */
    function pollForCounts() {
        setTimeout(function(){
            if (($(".product-count").length && $(".store-count").length) || pollCount > 101) {
                $productCount = $('.product-count');
                $storeCount = $('.store-count');
                appendCountsToNav();
            }
            else {
                pollForCounts();
            }
        },50);
        pollCount++;
    }

    function appendCountsToNav() {
        $userMenu.each(function (idx, menu) {
            var $menu = $(menu);
            var $myShackItem = $menu.find(".shack .menuitemlabel");
            var $followingItem = $menu.find(".following .menuitemlabel");
            if ($productCount.text().length) {
                $myShackItem.append("<span class='num'>(" + $productCount.text().trim() + ")</span>");
            }

            if ($storeCount.text().length) {
                $followingItem.append("<span class='num'>(" + $storeCount.text().trim() + ")</span>");
            }
        });
    }

    pollForCounts();
});