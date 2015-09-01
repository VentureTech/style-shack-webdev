jQuery(function($){
    var CSS_OPENED_CLASS = ("opened");
    var $productsCon = $(".products");
    var $filterCon = $(".filter-con");
    var $form = $filterCon.find("form");
    var productsWsUrl = $productsCon.data("wsProduct");
    var filtersWsUrl = $filterCon.data("wsFilters");
    var $productListingCon = $(".product-listing");
    var $filterListingCon = $(".filter-listing");


    function buildUpdater(form, trigger, content, item) {
        var $form = $(form);
        var $trigger = $(trigger);
        var $content = $(content);
        var $item = $(item) ? $(item) : null;

        $trigger.on('click', function(evt) {
            if ($item.length) {
                $item.siblings("." + CSS_OPENED_CLASS).removeClass(CSS_OPENED_CLASS).find("." + CSS_OPENED_CLASS).removeClass(CSS_OPENED_CLASS);
                $item.toggleClass(CSS_OPENED_CLASS);
            }
            else {
                $form.find(".search-option").removeClass(CSS_OPENED_CLASS).find("." + CSS_OPENED_CLASS).removeClass(CSS_OPENED_CLASS);
            }
            $content.toggleClass(CSS_OPENED_CLASS);
        });

        $content.on('change', 'input', function(e) {
            var paramMap = $form.serialize();

            $.get(productsWsUrl + "?" + paramMap, function(data){
                $productListingCon.empty();
                $productListingCon.html($($.parseHTML(data)).html());
            });

            //$form.submit();
        });

    }

    $form.each(function(){
        var $form = $(this);
        var $filterMenus = $form.find("ul.filter_controls");
        var $filterMenuItems = $filterMenus.find("> .mi");
        var $sortMenu = $(".sort-by");
        var $filterTags = $(".active-filters");

        $filterMenuItems.each(function() {
            var $item = $(this);
            var $trigger = $item.find('.filter_label');
            var $content = $item.find('.t2_menu');

            buildUpdater($form, $trigger, $content, $item);
        });

        $sortMenu.each(function(){
            var $trigger = $(this);
            var $content = $trigger.find(".t2_menu");

            buildUpdater($form, $trigger, $content);
        });

        $filterTags.click(".tag", function(e){
            var $tag = $(e.currentTarget);
            $form.find('#'+$tag.attr("id")).click();

            $.get(productsWsUrl + "?" + $form.serialize(), function(data){
                $productListingCon.empty();
                $productListingCon.html($($.parseHTML(data)).html());
            });
        });
    });
});