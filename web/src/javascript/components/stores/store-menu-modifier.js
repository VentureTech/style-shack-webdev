/** author aholt **/
/** mod by knoone **/
var MENU_SELECTOR = ".store-nav";
var INVENTORY_MGT_SELECTOR = ".inventory-mgt";
var PROMOTIONS_MGT_SELECTOR = ".promotions-mgt";
var MENU_DATA_SELECTOR = ".store-menu-data";

var updateMenu = function() {
    var data = $(MENU_DATA_SELECTOR).data('json');
    if(!data.show_inventory_mgt) {
        $(MENU_SELECTOR + ' ' + INVENTORY_MGT_SELECTOR).remove();
    }
    if(!data.show_promotion_mgt) {
        $(MENU_SELECTOR + ' ' + PROMOTIONS_MGT_SELECTOR).remove();
    }
};

$(document).ready(function() {
    updateMenu();
});