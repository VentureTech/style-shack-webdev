jQuery(function($){
    var $navTrigger = $('<div class="mobile-nav-trigger"><div class="line" /><div class="line" /><div class="line" /></div>');
    var $shackTrigger = $('<div class="shack-nav-trigger" />');
    var $primaryMobileNav = $('<div class="mobile-main" />');
    var $loginMobileNav = $('<div class="login-main" />');

    var $header = $(".l-top-nav > .box-wc");
    var $loginMenuItems = $header.find(".menu-comp .mi").not('.shopping-bag');
    var $mobileLoginMenu = $('<ul class="menu"/>').append($loginMenuItems.clone());
    var $mainMenu = $(".main-nav > .menu");
    var $userMenu = $(".user-profile > .menu");
    var CSS_OPEN_CLASS = "open";



    function setupMobileNav() {
        $header.append($navTrigger);
        $header.append($shackTrigger);
        $primaryMobileNav.append($mainMenu.clone());
        $primaryMobileNav.append($userMenu.clone());
        $loginMobileNav.append($mobileLoginMenu);
        $header.append($primaryMobileNav);
        $header.append($loginMobileNav);

        setupNavToggles();
    }



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

    setupMobileNav();

});