jQuery(function($){
    var $root = $("#e-content");
    var $influencerListingCon = $(".influencer-listing");
    var $influencers = $influencerListingCon.find(".influencer");
    var MOBILE_BREAKPOINT = 480;
    var TABLET_BREAKPOINT = 768;
    var RESIZE_THROTTLE_TIME = 200;

    var resizeThrottleId;

    var $window = $(window);
    var windowWidth = $window.width();

    var COL_ONE_CLASS = "col1";
    var COL_TWO_CLASS = "col2";
    var COL_THREE_CLASS = "col3";


    function updateWindowWidth() {
        windowWidth = $window.width();
        orderInfluencers();
    }

    function addResizeWatcher() {
        $window.on('resize', function() {
            clearTimeout(resizeThrottleId);
            resizeThrottleId = setTimeout(function() {
                updateWindowWidth();
            }, RESIZE_THROTTLE_TIME);
        });
    }

    function orderInfluencers() {
        $influencers.each(function (idx, influencer) {
            var $influencer = $(influencer);
            $influencer.removeClass(COL_ONE_CLASS).removeClass(COL_TWO_CLASS).removeClass(COL_THREE_CLASS);

            /** HANDLE THREE COLS ABOVE TABLET PORTRAIT **/
            if (windowWidth > TABLET_BREAKPOINT) {
                if (idx % 3 == 2) {
                    $influencer.addClass(COL_THREE_CLASS);
                }
                else if (idx % 3 == 1) {
                    $influencer.addClass(COL_TWO_CLASS);
                }
                else {
                    $influencer.addClass(COL_ONE_CLASS);
                }
            }

            /** HANDLE TWO COLS BELOW TABLET PORTRAIT AND ABOVE MOBILE LANDSCAPE**/
            else if (windowWidth <= TABLET_BREAKPOINT && windowWidth > MOBILE_BREAKPOINT) {
                if (idx % 2 == 1) {
                    $influencer.addClass(COL_TWO_CLASS);
                }
                else {
                    $influencer.addClass(COL_ONE_CLASS);
                }
            }
        });
    }

    function init() {
        addResizeWatcher();
        orderInfluencers();
    }

    function reorderInfluencers() {
        $influencers = $influencerListingCon.find(".influencer");
        orderInfluencers();
    }

    $root.on('ss:order-influencers', function(evt, idx) {
        reorderInfluencers();
    });

    init();
});