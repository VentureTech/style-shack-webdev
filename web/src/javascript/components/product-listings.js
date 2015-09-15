jQuery(function($){
    var $root = $("#e-content");
    var $productsListingCon = $(".product-listing");
    var $products = $productsListingCon.find(".product");
    var MOBILE_BREAKPOINT = 480;
    var TABLET_BREAKPOINT = 1024;
    var RESIZE_THROTTLE_TIME = 200;

    var resizeThrottleId;

    var $window = $(window);
    var windowWidth = $window.width();

    var COL_ONE_CLASS = "col1";
    var COL_TWO_CLASS = "col2";
    var COL_THREE_CLASS = "col3";
    var COL_FOUR_CLASS = "col4";


    function updateWindowWidth() {
        windowWidth = $window.width();
        orderProducts();
    }

    function addResizeWatcher() {
        $window.on('resize', function() {
            clearTimeout(resizeThrottleId);
            resizeThrottleId = setTimeout(function() {
                updateWindowWidth();
            }, RESIZE_THROTTLE_TIME);
        });
    }

    function orderProducts() {
        $products.each(function (idx, product) {
            var $product = $(product);
            $product.removeClass(COL_ONE_CLASS).removeClass(COL_TWO_CLASS).removeClass(COL_THREE_CLASS).removeClass(COL_FOUR_CLASS);

            /** HANDLE FOUR COLS ABOVE TABLET LANDSCAPE **/
            if (windowWidth > TABLET_BREAKPOINT) {
                if (idx % 4 == 3) {
                    $product.addClass(COL_FOUR_CLASS);
                }
                else if (idx % 4 == 2) {
                    $product.addClass(COL_THREE_CLASS);
                }
                else if (idx % 4 == 1) {
                    $product.addClass(COL_TWO_CLASS);
                }
                else {
                    $product.addClass(COL_ONE_CLASS);
                }
            }

            /** HANDLE THREE COLS BELOW TABLET LANDSCAPE AND ABOVE TABLET PORTRAIT **/
            else if (windowWidth <= TABLET_BREAKPOINT && windowWidth > MOBILE_BREAKPOINT) {
                if (idx % 3 == 2) {
                    $product.addClass(COL_THREE_CLASS);
                }
                else if (idx % 3 == 1) {
                    $product.addClass(COL_TWO_CLASS);
                }
                else {
                    $product.addClass(COL_ONE_CLASS);
                }
            }

            /** HANDLE TWO COLS BELOW TABLET PORTRAIT AND ABOVE MOBILE LANDSCAPE **/
            else if (windowWidth <= TABLET_BREAKPOINT && windowWidth > MOBILE_BREAKPOINT) {
                if (idx % 2 == 1) {
                    $product.addClass(COL_TWO_CLASS);
                }
                else {
                    $product.addClass(COL_ONE_CLASS);
                }
            }
        });
    }

    function init() {
        addResizeWatcher();
        orderProducts();
    }

    function reorderProducts() {
        $products = $productsListingCon.find(".product");
        orderProducts();
    }

    $root.on('ss:order-products', function(evt, idx) {
        reorderProducts();
    });

    init();
});