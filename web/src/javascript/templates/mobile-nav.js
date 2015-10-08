jQuery(function($){
    var $window = $(window);
    var $navTrigger = $('<div class="mobile-nav-trigger"><div class="line" /><div class="line" /><div class="line" /></div>');
    var $shackTrigger = $('<div class="shack-nav-trigger" />');
    var $primaryMobileNav = $('<div class="mobile-main" />');
    var $loginMobileNav = $('<div class="login-main" />');

    var $header = $(".l-top-nav > .box-wc");
    var $loginMenuItems = $header.find(".menu-comp .menu-t1 > .mi").not('.shopping-bag');

    var $mainMenu = $(".main-nav > .menu");
    var $archetypeMenu = $(".archetype-menu > .menu");
    var $catalogMenu = $(".catalog > .menu");
    var $storeMenu = $(".store-menu-nav > .menu");

    var $mobileNav,
        $loginNav,
        $mainNav = $(".main-nav");

    var CSS_ACTIVE_CLASS = "active";
    var CSS_OPEN_CLASS = "open";
    var BREAKPOINT_WIDTH_TOUCH = 1023;
    var RESIZE_THROTTLE_TIME = 200;

    var resizeThrottleId;
    var windowWidth = 0;
    var pollCount = 0;

    var isTouch = (Modernizr && Modernizr.touch) || navigator.maxTouchPoints;



    /* Function to find logout component after it is loaded */
    function pollForLogin() {
        setTimeout(function(){
            if ($(".deferred-logout.loaded").length || pollCount > 101) {
                $loginMobileNav.find(".menu-t1").append($(".logout").clone());
                $loginMobileNav.find(".logout").wrap('<li class="mi"></li>')
            }
            else {
                pollForLogin();
            }
        },50);
        pollCount++;
    }

    /* Append new toggle elements to top header. Clone menus out of current location
    and into new menu in top header. Trigger toggle setup **/
    function setupMobileHeader() {

        if ($mainMenu.length) {
            var $newMenu = $('<ul class="menu menu-t1" />');
            $newMenu.append($mainMenu.find("> .mi").clone());
            $header.append($navTrigger);

            if ($archetypeMenu.length) {
                $newMenu.append($archetypeMenu.find("> .mi").clone());
            }
            if ($catalogMenu.length) {
                var $mobileCatalogMenu = $catalogMenu.find("> .mi").clone();
                $mobileCatalogMenu.each(function(idx, menuitem) {
                    var $mi = $(menuitem);
                    $mi.find("ul.menu-t2").addClass("menu-t3").removeClass("menu-t2");
                    $mi.find("ul.menu-t1").addClass("menu-t2").removeClass("menu-t1");
                });
                $newMenu.append($mobileCatalogMenu);
            }

            $primaryMobileNav.append($newMenu);
            $header.append($primaryMobileNav);
        }

        else if ($storeMenu.length) {
            var $newMenu = $('<ul class="menu menu-t1" />');
            $newMenu.append($storeMenu.find("> .mi").clone());
            $header.append($navTrigger);

            $primaryMobileNav.append($newMenu);
            $header.append($primaryMobileNav);
        }

        if ($loginMenuItems.length || $(".deferred-logout").length) {
            var $newMenu = $('<ul class="menu menu-t1" />');
            $newMenu.append($loginMenuItems.clone());
            $header.append($shackTrigger);

            $loginMobileNav.append($newMenu);
            $header.append($loginMobileNav);
        }


        pollForLogin();
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
        $mobileNav.add($loginNav).add($mainNav).each(function(idx, menu) {
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