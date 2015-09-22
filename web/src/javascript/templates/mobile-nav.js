jQuery(function($){
    var $window = $(window);
    var $navTrigger = $('<div class="mobile-nav-trigger"><div class="line" /><div class="line" /><div class="line" /></div>');
    var $shackTrigger = $('<div class="shack-nav-trigger" />');
    var $primaryMobileNav = $('<div class="mobile-main" />');
    var $loginMobileNav = $('<div class="login-main" />');

    var $header = $(".l-top-nav > .box-wc");
    var $loginMenuItems = $header.find(".menu-comp .mi").not('.shopping-bag');
    var $mobileLoginMenu = $('<ul class="menu-t1"/>').append($loginMenuItems.clone());
    var $mainMenu = $(".main-nav > .menu");
    var $userMenu = $(".user-profile > .menu");

    var CSS_ACTIVE_CLASS = "active";
    var CSS_OPEN_CLASS = "open";
    var BREAKPOINT_WIDTH_TOUCH = 767;
    var RESIZE_THROTTLE_TIME = 200;

    var resizeThrottleId;
    var windowWidth = 0;

    var isTouch = (Modernizr && Modernizr.touch) || navigator.maxTouchPoints;

    function setupNavToggles() {
        var $navToggle = $(".mobile-nav-trigger");
        var $shackToggle = $(".shack-nav-trigger");
        var $mobileNav = $(".mobile-main");
        var $loginNav = $(".login-main");

        $navToggle.on("click", function(e){
            if ($loginNav.hasClass(CSS_OPEN_CLASS)) {
                $loginNav.toggleClass(CSS_OPEN_CLASS);
                setTimeout(function(){
                    $mobileNav.toggleClass(CSS_OPEN_CLASS);
                },500);

            }
            else {
                $mobileNav.toggleClass(CSS_OPEN_CLASS);
            }
        });

        $shackToggle.on("click", function(e){
            if ($mobileNav.hasClass(CSS_OPEN_CLASS)) {
                $mobileNav.toggleClass(CSS_OPEN_CLASS);
                setTimeout(function(){
                    $loginNav.toggleClass(CSS_OPEN_CLASS);
                },500);

            }
            else {
                $loginNav.toggleClass(CSS_OPEN_CLASS);
            }
        });
    }

    function setupMobileHeader() {
        $header.append($navTrigger);
        $header.append($shackTrigger);
        $primaryMobileNav.append($mainMenu.clone());
        $primaryMobileNav.append($userMenu.clone());
        $loginMobileNav.append($mobileLoginMenu);
        $header.append($primaryMobileNav);
        $header.append($loginMobileNav);

        setupNavToggles();
    }


    function initNav() {
        setupMobileHeader();

        $header.find(".menu").each(function(idx, menu) {
            var $menu = $(menu);
            var $parentMenuItems = $menu.find(".mi-parent");

            $parentMenuItems.each(function(idx, item){
                var $mi = $(item);
                $mi.prepend('<div class="collapse"><span></span></div>');
            });

            function addHoverEvents() {
                $menu.on('mouseenter', '.mi-parent', function(evt) {
                    if (isTouch && windowWidth <= BREAKPOINT_WIDTH_TOUCH) {
                        return;
                    }

                    $(this).addClass(CSS_OPEN_CLASS).siblings().removeClass(CSS_ACTIVE_CLASS);
                });

                $menu.on('mouseleave', '.mi-parent', function(evt) {
                    var $mi = $(this);

                    if (isTouch && windowWidth <= BREAKPOINT_WIDTH_TOUCH) {
                        return;
                    }

                    $mi.removeClass(CSS_OPEN_CLASS);
                });
            }

            function addTouchEvents() {
                $menu.on('click', '.mi-parent', function(evt) {
                    var $mi = $(this);

                    if (isTouch && windowWidth > BREAKPOINT_WIDTH_TOUCH && !$mi.hasClass(CSS_OPEN_CLASS)) {
                        evt.preventDefault();
                        $mi.addClass(CSS_OPEN_CLASS).siblings().removeClass(CSS_ACTIVE_CLASS);

                    }

                    if (windowWidth > BREAKPOINT_WIDTH_TOUCH) {
                        return;
                    }

                    if (!$mi.hasClass(CSS_OPEN_CLASS)) {
                        evt.preventDefault();

                        $parentMenuItems.removeClass(CSS_OPEN_CLASS);
                        $mi.addClass(CSS_OPEN_CLASS);
                    }
                });

                $parentMenuItems.on("click", ".collapse", function(evt) {
                    var $toggle = $(this);
                    var $parent = $toggle.closest(".mi");
                    if ($parent.hasClass(CSS_OPEN_CLASS)) {
                        evt.stopPropagation();

                        if ($parent.hasClass(CSS_OPEN_CLASS)) {
                            evt.preventDefault();

                            $parentMenuItems.removeClass(CSS_OPEN_CLASS);
                            $parent.removeClass(CSS_OPEN_CLASS);
                        }
                    }

                });
            }

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

            updateWindowWidth();

            if (isTouch) {
                console.log("touch");
                addTouchEvents();
                addHoverEvents();
                addResizeWatcher();
            } else {
                addHoverEvents();
            }
        });
    }



    initNav();

});