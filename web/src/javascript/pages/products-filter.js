jQuery(function($){
    var CSS_OPENED_CLASS = ("opened");
    var CSS_ACTIVE_CLASS = "active";
    var $productsCon = $(".products");
    var $filterCon = $(".filter-con");
    var $form = $filterCon.find("form");
    var isFiltering = false;

    var productsWsUrl = $productsCon.data("wsProduct");
    if (productsWsUrl.indexOf("?") > 0) {
        productsWsUrl = productsWsUrl + "&";
    }
    else {
        productsWsUrl = productsWsUrl + "?";
    }
    var $productListingCon = $(".product-listing");


    function buildUpdater($context) {
        var $filterGroups = $context.find(".search-option");

        $filterGroups.each(function(idx, filterGroup){
            var $filterGroup = $(filterGroup);
            var $trigger = $filterGroup.find(".filter_label");
            var $filterEls = $filterGroup.find(".mi");
            var $activeFilterList = $('<div class="active-filters" />').appendTo($filterCon.find(".box"));

            var initialActiveFilters = $filterGroup.data("activeFilters") ? $filterGroup.data("activeFilters").split("|") : [];


            $trigger.on('click', function(evt) {
                $filterGroup.siblings("." + CSS_OPENED_CLASS).removeClass(CSS_OPENED_CLASS).find("." + CSS_OPENED_CLASS).removeClass(CSS_OPENED_CLASS);
                $filterGroup.toggleClass(CSS_OPENED_CLASS);
            });

            $activeFilterList.on("click", ".tag", function(e){
                var $tag = $(this);
                $filterGroup.find('.mi[data-filter-id="' + $tag.data("filterId") + '"]').trigger("ss:filter-inactive");
            });


            $filterEls.each(function(idx, filterEl) {
                var $filterEl = $(filterEl);

                function getFilterElById(id) {
                    return $filterGroup.find('.mi[data-filter-id="' + $filterEl.find("input").val() + '"]')
                }

                function addToActiveFilterList() {
                    $('<span class="tag"/>').text($filterEl.find("label").text()).attr("data-filter-id", $filterEl.find("input").val()).appendTo($activeFilterList);
                }

                function removeFromActiveFilterList() {
                    $activeFilterList.find('[data-filter-id="' + $filterEl.find("input").val() + '"]').remove();
                }

                function setFilterActive() {
                    $filterEl.addClass(CSS_ACTIVE_CLASS);
                    $filterEl.find("input").prop('checked', true);
                    addToActiveFilterList();
                }

                function setFilterInactive() {
                    $filterEl.removeClass(CSS_ACTIVE_CLASS);
                    $filterEl.find("input").prop('checked', false);
                    removeFromActiveFilterList();
                }

                function toggleFilterState() {
                    if ($filterEl.hasClass(CSS_ACTIVE_CLASS)) {
                        setFilterInactive();
                    }
                    else {
                        setFilterActive();
                    }
                }

                if ($.inArray($filterEl.data("filterId"), initialActiveFilters) > -1) {
                    setFilterActive();
                }

                $filterEl.on("ss:filter-inactive", function(e){
                    setFilterInactive();
                });

                $filterEl.on('click', 'label', function(e) {
                    e.preventDefault();

                    if (isFiltering) {
                        return;
                    }
                    toggleFilterState();
                    isFiltering = true;

                    loadContent(productsWsUrl + $context.serialize(), function(data) {
                        renderContent(data);
                        isFiltering = false;
                    });
                });
            });
        });
    }



    function loadContent(url, callback) {
        $.get(url, callback);
    }

    function renderContent(content) {
        $productListingCon.empty();
        $productListingCon.html($($.parseHTML(content)).html());
        $productListingCon.trigger("ss:order-stores");
    }


    $form.each(function(){
        var $form = $(this);

        buildUpdater($form);

        /*$sortMenu.each(function(){
            var $trigger = $(this);
            var $content = $trigger.find(".t2_menu");

            buildUpdater($form, $trigger, $filterMenuItems);
        });*/

        //$filterTags.click(".tag", function(e){
        //    var $tag = $(e.currentTarget);
        //    $form.find('#'+$tag.attr("id")).click();
        //
        //    $.get(productsWsUrl + "?" + $form.serialize(), function(data){
        //        $productListingCon.empty();
        //        $productListingCon.html($($.parseHTML(data)).html());
        //    });
        //});
    });
});