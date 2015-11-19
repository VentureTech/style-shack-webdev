jQuery(function($){
    var $root = $("#e-content");
    var $userMenu = $(".menu.user-links").add($(".login-main > .menu"));
    var $productCount;
    var $storeCount;
    var pollCount = 0;
    var COUNT_CLASS = "count";
    var $userSideMenu = $(".menu.user-profile");

    var productCountWsUrl;
    var storeCountWsUrl;

    /* Function to find store/product count components after they are loaded */
    function pollForCounts() {
        setTimeout(function(){
            if (($(".product-count").length && $(".store-count").length) || pollCount > 101) {
                $productCount = $('.product-count');
                $storeCount = $('.store-count');
                productCountWsUrl = $productCount.find('.product-count-inner').data("wsProductCount")
                storeCountWsUrl = $storeCount.find('.store-count-inner').data("wsStoreCount");
                appendCountsToNav();
            }
            else {
                pollForCounts();
            }
        },50);
        pollCount++;
    }

    function loadContent(url) {
        return $.get(url);
    }

    function appendCountsToNav() {
        $userMenu.each(function (idx, menu) {
            var $menu = $(menu);
            var $myShackItem = $menu.find(".shack .menuitemlabel");
            var $followingItem = $menu.find(".following .menuitemlabel");
            var productCountNumber = $productCount.find(".inner-content").text().trim();
            var storeCountNumber = $storeCount.find(".inner-content").text().trim();

            if (productCountNumber !== "") {
                if ($myShackItem.find(".num").length) {
                    $myShackItem.find(".num").empty().append(productCountNumber);
                }
                else {
                    $myShackItem.addClass(COUNT_CLASS).append("<span class='num'>" + productCountNumber + "</span>");
                }
            }

            if (storeCountNumber !== "") {
                if ($followingItem.find(".num").length) {
                    $followingItem.find(".num").empty().append(storeCountNumber);
                }
                else {
                    $followingItem.addClass(COUNT_CLASS).append("<span class='num'>" + storeCountNumber + "</span>");
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

    $root.on("ss:shack-product-count-update", function(e){
        $.when(loadContent(productCountWsUrl)).then(function(data) {
            $productCount.empty().html($.parseHTML(data));
            appendCountsToNav();
        });
    });

    $root.on("ss:shack-store-count-update", function(e){
        $.when(loadContent(storeCountWsUrl)).then(function(data) {
            $storeCount.empty().html($.parseHTML(data));
            appendCountsToNav();
        });
    });

    pollForCounts();
});