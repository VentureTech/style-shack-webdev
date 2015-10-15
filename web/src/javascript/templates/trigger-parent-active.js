/**
 * Created by webdev on 10/15/15.
 */
jQuery(function($){
    $(".main-nav").each(function(idx, menu){
        var $menu = $(menu);
        var $parentMenuItems = $menu.find(".mi-parent");

        /* Append collapse element to help handle 2-click submenu system **/
        $parentMenuItems.each(function(idx, item){
            var $mi = $(item);

            if ($mi.find('.mi-active').length) {
                $mi.addClass("mi-active").removeClass('mi-inactive');
            }
        });
    });
});
