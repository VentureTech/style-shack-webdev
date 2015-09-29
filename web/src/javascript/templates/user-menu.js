jQuery(function($){
    var $userMenu = $(".menu.user-profile");
    var $productCount = $('.product-count');
    var $storeCount = $('.store-count');

    $userMenu.each(function(idx, menu){
        var $menu = $(menu);
        var $myShackItem = $menu.find(".mystyleshack .menuitemlabel");
        var $followingItem = $menu.find(".following .menuitemlabel");
        $myShackItem.append(" (" + $productCount.text().trim() + ")");
        $followingItem.append(" (" + $storeCount.text().trim() + ")");
    });
});