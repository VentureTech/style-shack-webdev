jQuery(function($) {
    var CSS_ACTIVE_CLASS = "active";
    var $sectionNav = $(".mobile-section-nav");
    var $shopContent = $(".l-primary-content");
    var $storeInfo = $(".l-aside-content");

    $sectionNav.on('click', '.shop', function(e){
        $sectionNav.find("> div").removeClass(CSS_ACTIVE_CLASS);
        $(e.target).addClass(CSS_ACTIVE_CLASS);
        $storeInfo.removeClass(CSS_ACTIVE_CLASS);
        $shopContent.addClass(CSS_ACTIVE_CLASS);
    });

    $sectionNav.on('click', '.info', function(e){
        $sectionNav.find("> div").removeClass(CSS_ACTIVE_CLASS);
        $(e.target).addClass(CSS_ACTIVE_CLASS);
        $shopContent.removeClass(CSS_ACTIVE_CLASS);
        $storeInfo.addClass(CSS_ACTIVE_CLASS);
    });

    $sectionNav.find(".shop").trigger('click');
});