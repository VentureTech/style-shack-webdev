jQuery(function($){
    var $userMenu = $(".menu.user-links");
    var $productCount = $('.product-count');
    var $storeCount = $('.store-count');

    $userMenu.each(function(idx, menu){
        var $menu = $(menu);
        var $myShackItem = $menu.find(".shack .menuitemlabel");
        var $followingItem = $menu.find(".following .menuitemlabel");
        $myShackItem.append("<span class='num'>(" + $productCount.text().trim() + ")</span>");
        $followingItem.append("<span class='num'>(" + $storeCount.text().trim() + ")</span>");
    });
});