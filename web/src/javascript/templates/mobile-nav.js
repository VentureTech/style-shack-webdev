jQuery(function($){
    var $window = $(window);
    var $navTrigger = $('<div class="mobile-nav-trigger"><div class="line" /><div class="line" /><div class="line" /></div>');
    var $shackTrigger = $('<div class="shack-nav-trigger" />');
    var $primaryMobileNav = $('<div class="mobile-main" />');
    var $loginMobileNav = $('<div class="login-main" />');

    var $header = $(".l-top-nav > .box-wc");
    var $loginMenuItems = $header.find(".menu-comp .mi").not('.shopping-bag');
    var $mobileLoginMenu = $('<ul class="menu-t1 menu"/>').append($loginMenuItems.clone());
    var $mainMenu = $(".main-nav > .menu");
    var $userMenu = $(".user-profile > .menu");

    var $mobileNav,
        $loginNav;

    var CSS_ACTIVE_CLASS = "active";
    var CSS_OPEN_CLASS = "open";
    var BREAKPOINT_WIDTH_TOUCH = 767;
    var RESIZE_THROTTLE_TIME = 200;

    var resizeThrottleId;
    var windowWidth = 0;

    var isTouch = (Modernizr && Modernizr.touch) || navigator.maxTouchPoints;

    /* Append new toggle elements to top header. Clone menus out of current location
    and into new menu in top header. Trigger toggle setup **/
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

    /* Create new object reference to toggle and new menus. Add click handler for toggles. **/
    function setupNavToggles() {
        var $navToggle = $(".mobile-nav-trigger");
        var $shackToggle = $(".shack-nav-trigger");
        $mobileNav = $(".mobile-main");
        $loginNav = $(".login-main");

        $navToggle.on("click", function(e){
            toggleClick($mobileNav, $loginNav)
        });

        $shackToggle.on("click", function(e){
            toggleClick($loginNav, $mobileNav)
        });
    }

    /* Check to see if other top menu is open on click. If so, close it and
    delay the animated opening of the target menu **/
    function toggleClick(targetMenu, otherMenu) {
        var $menu = $(targetMenu);
        var $otherMenu = $(otherMenu);


        if ($otherMenu.hasClass(CSS_OPEN_CLASS)) {
            $otherMenu.toggleClass(CSS_OPEN_CLASS);
            setTimeout(function(){
                $menu.toggleClass(CSS_OPEN_CLASS);
            },500);

        }
        else {
            $menu.toggleClass(CSS_OPEN_CLASS);
        }
    }


    function initNav() {
        setupMobileHeader();

        /* Find top level menus in top header and do work **/
        $mobileNav.add($loginNav).each(function(idx, menu) {
            var $menu = $(menu);
            var $parentMenuItems = $menu.find(".mi-parent");


            /* Append collapse element to help handle 2-click submenu system **/
            $parentMenuItems.each(function(idx, item){
                var $mi = $(item);
                $mi.prepend('<div class="collapse"><span></span></div>');
            });


            /* Add hover events for non-touch clients **/
            function addHoverEvents() {
                /* on hover */
                $menu.on('mouseenter', '.mi-parent', function(evt) {
                    if (isTouch && windowWidth <= BREAKPOINT_WIDTH_TOUCH) {
                        return;
                    }

                    $(this).addClass(CSS_OPEN_CLASS).siblings().removeClass(CSS_ACTIVE_CLASS);
                });

                /* on hover out */
                $menu.on('mouseleave', '.mi-parent', function(evt) {
                    var $mi = $(this);

                    if (isTouch && windowWidth <= BREAKPOINT_WIDTH_TOUCH) {
                        return;
                    }

                    $mi.removeClass(CSS_OPEN_CLASS);
                });
            }


            /* Add touch events for touch clients **/
            function addTouchEvents() {
                $menu.on('click', '.mi-parent', function(evt) {
                    var $mi = $(this);

                    /* if is touch and menu item isn't already open,
                    * don't go anywhere with the click and open the item and close the other opens siblings */
                    if (isTouch && !$mi.hasClass(CSS_OPEN_CLASS)) {
                        evt.preventDefault();
                        $mi.addClass(CSS_OPEN_CLASS).siblings().removeClass(CSS_ACTIVE_CLASS);
                    }
                });



                /* on click on the collapse div, find the containing menu item
                 * and do not execute the link, but open/close the menu item */
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