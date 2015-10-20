jQuery(function($){
    function collectProductInfo($product){
        if($product.length == 0)
            return null;
        var info = {};
        var productID = $product.find('[itemprop=productID]');
        var price = $product.find('[itemprop=price]');
        var name = $product.find('.name [itemprop=name]');
        var storeName = $product.find('.store-name [itemprop=name]');
        info.id = productID.attr('content');
        info.name = name.text();
        info.price = price.attr('content');
        info.dimension1 = storeName.text();
        var $productInfo = $product.closest('.product-info');
        var $quantity = $productInfo.find('.quantity');
        if($quantity.length)
            info.quantity = $quantity.val();
        return info;
    }
    function detailClick(evt){
        if(this._skip) return;
        var info = collectProductInfo($('.product-info [itemtype="http://schema.org/Product"]'));
        if(info) {
            evt.preventDefault();
            ga('ec:addProduct', info);
            ga('ec:setAction', 'click', {list: 'catalog'});
            var button = this;
            ga('send', 'event', 'UX', 'click', 'Results', {
                hitCallback: function () {
                    button._skip = true;
                    button.click();
                }
            });
        }
    }
    ga('require','ec');
    $('.e-content').on('click', 'button.purchase-option', detailClick);
});