jQuery(function($){
    var $bodyCon = $("body");
    var $productVariantManager = $("#variant-mgr-id");
    var $infoCon = $(".more-info > div");
    var $loadingDiv = $('<div class="loading" />');
    var $photoCon = $(".images");
    var $forms = $("form");
    var $nav = $('<ul class="nav" />');
    var $prev = $('<div class="navi prev"><span></span></div>').appendTo($nav);
    var $next = $('<div class="navi next"><span></span></div>').appendTo($nav);

    var CSS_OPEN_CLASS = "open";
    var CSS_EMPTY_CLASS = "empty";
    var CSS_REMOVE_CLASS = "remove";
    var CSS_LOADED_CLASS = "loaded";
    var CSS_OLD_CLASS = "old";
    var CSS_NEW_CLASS = "new";
    var CSS_PREVIOUS_CLASS = "prev";
    var CSS_NEXT_CLASS = "next";
    var CSS_CURRENT_CLASS = "current";
    var transitionProperty = Modernizr.csstransforms ? "transform" : "left";
    var BREAKPOINT_TABLET_PORTRAIT = 767;
    var RESIZE_THROTTLE_TIME = 200;

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

    /*function loadActivePictureInfo(thumb) {
        var $thumb = $(thumb);
        var largeUrl = $thumb.data("large");
        var xlUrl = $thumb.data("xl");

        var $con = $(".main > .image");

        $con.css('background-image', largeUrl);
        updateImage(largeUrl);


        $img.one('load', function() {
            $con.removeClass(CSS_EMPTY_CLASS);

        }).each(function(){
            if (this.complete) $img.load();
        });
    }*/

    function updateImage(url) {
        var $image = $photoCon.find(".main .image");
        var largeUrl = url;

        //$img.removeClass(CSS_NEW_CLASS).addClass(CSS_OLD_CLASS);
        $image.append('<div class="loading" />');

        $image.css('background-image', largeUrl);


        //$img = $('<img />').attr("src", largeUrl).addClass(CSS_NEW_CLASS);
        //$con.append($img);
        //$con.find(".old").addClass(CSS_REMOVE_CLASS);

        setTimeout(function(){
            $image.find(".loading").remove();
            $image.addClass("loaded");
            //$con.find(".old").remove();
        }, 500);
    }


    function setupProductPhotos() {
        if (windowWidth < BREAKPOINT_TABLET_PORTRAIT) {
            $photoCon.find('.image').off();
            $photoCon.find('.main').empty();
            setupMobileSlides();
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

        $thumbCon.wrapInner('<div class="wrapper"></div>');
        var $wrapper = $(".wrapper");
        $wrapper.wrapInner('<div class="scrollpane"></div>');
        var $scrollPane = $(".scrollpane");

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
            $scrollPane.css(transitionProperty, transitionValue);
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