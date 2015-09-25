jQuery(function($){
    var CSS_OPEN_CLASS = "open";
    var CSS_PREVIOUS_CLASS = "prev";
    var CSS_NEXT_CLASS = "next";
    var CSS_CURRENT_CLASS = "current";
    var CSS_ACTIVE_CLASS = "active";
    var leftTransitionProperty = Modernizr.csstransforms ? "transform" : "left";
    var topTransitionProperty = Modernizr.csstransforms ? "transform" : "top";
    var BREAKPOINT_TABLET_PORTRAIT = 767;
    var RESIZE_THROTTLE_TIME = 200;
    var THUMB_PANE_HEIGHT = 360;
    var MAX_THUMBS_VISIBLE = 8;


    var $bodyCon = $("body");
    var $productVariantManager = $("#variant-mgr-id");
    var $infoCon = $(".more-info > div");
    var $loadingDiv = $('<div class="loading" />');
    var $photoCon = $(".images");
    var $forms = $("form");
    var $nav = $('<ul class="nav" />');
    var $prev = $('<div class="navi prev"><span></span></div>').addClass(CSS_ACTIVE_CLASS).appendTo($nav);
    var $next = $('<div class="navi next"><span></span></div>').addClass(CSS_ACTIVE_CLASS).appendTo($nav);
    var $wrapper = $('<div class="wrapper" />');
    var $hScrollpane = $('<div class="horizontal-scrollpane" />');
    var $vScrollpane = $('<div class="vertical-scrollpane" />');


    var resizeThrottleId;
    var slideWidth;

    var $window = $(window);
    var windowWidth = $window.width();

    var isTouch = (Modernizr && Modernizr.touch) || navigator.maxTouchPoints;

    function updateWindowWidth() {
        windowWidth = $window.width();
    }

    function addResizeWatcher() {
        $window.on('resize', function() {
            clearTimeout(resizeThrottleId);
            resizeThrottleId = setTimeout(function() {
                updateWindowWidth();
            }, RESIZE_THROTTLE_TIME);
        });
    }


    function createThumbFunctionality() {
        var $overallCon = $photoCon.find(".overall");
        var $overallWrapper,
            $overallScrollpane;
        var $nextBtn;
        var $prevBtn;
        var paneHeight = THUMB_PANE_HEIGHT;
        var thumbCount;
        var thumbPageCount = 0;
        var transitionValue = 0;
        var newTransitionValue;
        var thumbCount = $overallCon.find(".image").length;

        function setupThumbWrapper() {
            if (thumbCount > MAX_THUMBS_VISIBLE) {
                $overallCon.wrapInner($wrapper);
                $overallWrapper = $overallCon.find(".wrapper");
                $overallWrapper.wrapInner($vScrollpane);
                $overallScrollpane = $overallWrapper.find(".vertical-scrollpane");
                $overallCon.append($nav);
                $nextBtn = $overallCon.find(".next");
                $prevBtn = $overallCon.find(".prev");
            }
        }

        function scrollThumbs(dir) {
            if (dir == "up") {
                transitionValue = transitionValue + paneHeight;
                thumbPageCount--;
            }
            else {
                transitionValue = transitionValue - paneHeight;
                thumbPageCount++;
            }

            if (Modernizr.csstransforms) {
                newTransitionValue = "translateY(" + transitionValue + "px)";
            }
            else {
                newTransitionValue = transitionValue;
            }
            $overallScrollpane.css(topTransitionProperty, newTransitionValue);

            updateThumbPaging();
        }


        function updateThumbPaging() {

            $nextBtn.addClass(CSS_ACTIVE_CLASS);
            $prevBtn.addClass(CSS_ACTIVE_CLASS);

            if ((thumbCount - MAX_THUMBS_VISIBLE*thumbPageCount) < MAX_THUMBS_VISIBLE) {
                $nextBtn.removeClass(CSS_ACTIVE_CLASS);
            }
            if (thumbPageCount == 0) {
                $prevBtn.removeClass(CSS_ACTIVE_CLASS);
            }
        }


        setupThumbWrapper();


        $overallCon.on('click', '.next.active', function(e){
            scrollThumbs('down');
        });

        $overallCon.on('click', '.prev.active', function(e){
            scrollThumbs('up');
        });
    }


    function setupDescriptionToggle() {
        $infoCon.each(function (idx, con) {
            var $con = $(con);
            var $toggle = $con.find(".title");
            var $content = $con.find(".content");

            $toggle.on("click", function (e) {
                $toggle.toggleClass(CSS_OPEN_CLASS);
                $content.toggleClass(CSS_OPEN_CLASS);
            });
        });
    }

    function setupThumbs() {
        if (windowWidth > BREAKPOINT_TABLET_PORTRAIT) {
            createThumbFunctionality();
        }
        else {
            setupMobileSlides();
        }
    }

    function updateImage(url) {
        var $image = $photoCon.find(".main .image");
        var largeUrl = url;

        $image.css('background-image', 'url(' + largeUrl + ')');
    }

    function setupProductPhotos() {
        if (windowWidth < BREAKPOINT_TABLET_PORTRAIT) {
            $photoCon.find('.image').off();
            $photoCon.find('.main').empty();
            setupThumbs();
        }
        else {
            $photoCon.each(function (idx, con) {
                var $con = $(con);
                var $thumbs = $con.find(".thumbs .image");

                $thumbs.each(function (idx, thumb) {
                    var $thumb = $(thumb);
                    var largeUrl = $thumb.data("large");

                    $thumb.on("click", function(e) {
                        updateImage(largeUrl);
                    });
                });

                $thumbs.first().trigger("click");
            });
        }
    }


    function setupMobileSlides() {
        var $thumbCon = $photoCon.find(".thumbs");
        var $slides = $thumbCon.find(".image");

        $thumbCon.wrapInner($wrapper);
        var $mobileWrapper = $(".wrapper");
        $mobileWrapper.wrapInner($hScrollpane);
        var $mobileScrollpane = $mobileWrapper.find(".horizontal-scrollpane");

        $thumbCon.addClass('rotating-slider');

        if (isTouch) {
            $thumbCon.addClass("mobi");
        }

        $nav.prependTo($thumbCon);
        $nav.wrap('<div class="nav_con" />');

        var curSlideIdx = 0;
        $thumbCon.eq(curSlideIdx).addClass('current');
        slideWidth = $slides.width();


        $nav.on('click', '.navi.next', function(evt){
            nextSlide("left");
        });

        $nav.on('click', '.navi.prev', function(evt){
            nextSlide("right");
        });

        $thumbCon.on("swipeleft", function(event) {
            nextSlide("left");
        });

        $thumbCon.on("swiperight", function(event) {
            nextSlide("right");
        });

        $thumbCon.on("movestart", function(e) {
            // allows swipe up and down on mobile
            if ((e.distX > e.distY && e.distX < -e.distY) ||
                (e.distX < e.distY && e.distX > -e.distY)) {
                e.preventDefault();
            }
        });


        function nextSlide(direction) {
            if (direction == "left" && (curSlideIdx + 1) < $slides.length) {
                curSlideIdx++;
            }
            else if (direction == "right" && curSlideIdx > 0) {
                curSlideIdx--;
            }

            moveSlide();

            setOrderClasses();

        }

        function moveSlide() {
            var transitionValue = -(slideWidth*curSlideIdx);
            if (Modernizr.csstransforms) {
                transitionValue = "translateX(" + transitionValue + "px)";
            }
            $mobileScrollpane.css(leftTransitionProperty, transitionValue);
        }

        function setOrderClasses() {
            if ((curSlideIdx + 1) >= $slides.length) $thumbCon.removeClass(CSS_NEXT_CLASS);
            else $thumbCon.eq(curSlideIdx + 1).addClass(CSS_NEXT_CLASS).siblings().removeClass(CSS_NEXT_CLASS);

            if (curSlideIdx == 0) $thumbCon.removeClass(CSS_PREVIOUS_CLASS);
            else $thumbCon.eq(curSlideIdx - 1).addClass(CSS_PREVIOUS_CLASS).siblings().removeClass(CSS_PREVIOUS_CLASS);

            $thumbCon.eq(curSlideIdx).addClass(CSS_CURRENT_CLASS).siblings().removeClass(CSS_CURRENT_CLASS);
        }
    }


    function updateImageManager(variantID) {
        var updateURL = $(".image-manager").data('updateUrl');
        var productID = $(".image-manager").data('productId');
        var updateData = {
            product: productID,
            variant: variantID
        };

        $.get(updateURL, updateData, function(html){
            var $newNodes = $($.parseHTML(html));
            $('.image-manager').empty().append($newNodes.find(".image-manager").children());
            setupProductPhotos();
        });
    }



    function init() {
        setupDescriptionToggle();
        addResizeWatcher();
        setupProductPhotos();

        $bodyCon.on("ss:pvm-loading", function(e){
            $photoCon.find('.image').off();
            if ($photoCon.find(".loaded").length >= 0) {
                $photoCon.append($loadingDiv);
            }
            $photoCon.find(".main").empty();
            $photoCon.find(".thumbs").empty();
        });

        $bodyCon.on("ss:pvm-loaded", function(e){
            var productVariantID = $productVariantManager.find("> div").data("pvId");
            updateImageManager(productVariantID);
            $photoCon.find(".loading").remove();
        });
    }

    init();
});