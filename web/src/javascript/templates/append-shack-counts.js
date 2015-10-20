jQuery(function($){
    var $userMenu = $(".menu.user-links");
    var $productCount;
    var $storeCount;
    var pollCount = 0;
    var COUNT_CLASS = "count";
    var $userSideMenu = $(".menu.user-profile");

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
                if ($productCount.find(".num").length) {
                    $productCount.find(".num").empty().append($productCount.text().trim());
                }
                else {
                    $myShackItem.addClass(COUNT_CLASS).append("<span class='num'>" + $productCount.text().trim() + "</span>");
                }
            }

            if ($storeCount.text().length) {
                if ($followingItem.find(".num").length) {
                    $followingItem.find(".num").empty().append($productCount.text().trim());
                }
                else {
                    $followingItem.addClass(COUNT_CLASS).append("<span class='num'>" + $storeCount.text().trim() + "</span>");
                }
            }
        });

        if ($userSideMenu.length) {
            $userSideMenu.each(function (idx, menu) {
                var $menu = $(menu);
                var $myShackItem = $menu.find(".mystyleshack .menuitemlabel");
                var $followingItem = $menu.find(".following .menuitemlabel");

                if ($productCount.text().length) {
                    $myShackItem.addClass(COUNT_CLASS).append(" (" + $productCount.text().trim() + ")");
                }

                if ($storeCount.text().length) {
                    $followingItem.addClass(COUNT_CLASS).append(" (" + $storeCount.text().trim() + ")");
                }
            });
        }
    }

    pollForCounts();
});