$(function(){
    function collectProductInfo(product){
        if(!product)
            return null;
        var info = {};
        var productID = product.find('[itemprop=productID]');
        var price = product.find('[itemprop=price]');
        var name = product.find('.name [itemprop=name]');
        var storeName = product.find('.store-name [itemprop=name]');
        info.id = productID.attr('content');
        info.name = name.text();
        info.price = price.attr('content');
        info.dimension1 = storeName.text();
        var productInfo = product.closest('.product-info') || product;
        var quantity = productInfo.find('.quantity');
        if(quantity)
            info.quantity = quantity.val();
        return info;
    }
    function detailClick(evt){
        var a = evt.target || evt.srcElement;
        if(!a || a.nodeName.toLowerCase() != 'a')
            return;
        var info = collectProductInfo($(this).closest('[itemtype="http://schema.org/Product"]'));
        if(info) {
            evt.preventDefault();
            ga('ec:addProduct', info);
            ga('ec:setAction', 'click', {list: 'catalog'});
            var destination = a.href;
            ga('send', 'event', 'UX', 'click', 'Results', {
                hitCallback: function () {
                    document.location = destination;
                }
            });
        }
    }
    ga('require','ec');
    $('.product-link').click(detailClick);
});