jQuery(function($) {
    var CSS_OPENED_CLASS = "opened";
    var CSS_ACTIVE_CLASS = "active";

    var $body = $('body');
    var $root = $('#e-content');
    var $productListingCon = $(".influencer-listing");

    var productsWsUrl = $productListingCon.find('.influencers').data("wsInfluencer");

    var isLoadingContent = false;


    function initFilterCon($context) {
        var $filterCon = $context;
        var $filterGroups = $context.find(".search-option");
        var $filterForm = $context.find('form');

        $root.on('ss:filter-groups-close', function() {
            $filterGroups.trigger('ss:filter-group-close');
        });

        $filterGroups.each(function(idx, filterGroup){
            var $filterGroup = $(filterGroup);
            var $filterGroupLabel = $filterGroup.find(".filter_label");
            var $filterEls = $filterGroup.find(".filter-option");
            var $activeFilterList = $('<div class="active-filters" />').appendTo($filterCon.find(".box"));

            var initialActiveFilters = $filterGroup.data("activeFilters") ? $filterGroup.data("activeFilters").split("|") : [];

            $filterGroup.on('ss:filter-group-open', function() {
                $filterGroup.addClass(CSS_OPENED_CLASS);
            });

            $filterGroup.on('ss:filter-group-close', function() {
                $filterGroup.removeClass(CSS_OPENED_CLASS);
            });

            $filterGroupLabel.on('click', function(evt) {
                evt.stopPropagation();

                if ($filterGroup.hasClass(CSS_OPENED_CLASS)) {
                    $filterGroup.trigger('ss:filter-group-close');
                } else {
                    $filterGroup.trigger('ss:filter-group-open').siblings().trigger('ss:filter-group-close');
                }
            });

            $activeFilterList.on("click", ".tag", function(e) {
                $filterGroup.find('[data-filter-id="' + $(this).data("filterId") + '"]').trigger("ss:filter-inactive");
            });


            $filterEls.each(function(idx, filterEl) {
                var $filterEl = $(filterEl);

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
                    $filterForm.trigger('ss:filter-update');
                }

                function setFilterInactive() {
                    $filterEl.removeClass(CSS_ACTIVE_CLASS);
                    $filterEl.find("input").prop('checked', false);
                    removeFromActiveFilterList();
                    $filterForm.trigger('ss:filter-update');
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
                    e.stopPropagation();

                    if (isLoadingContent) {
                        return;
                    }

                    toggleFilterState();
                });
            });
        });
    }

    function initSortCon($context) {
        var $sortItems = $context.find('.sort-option');
        var $sortInputs = $context.find('input');
        var $form = $context.closest('form');
        var $activeSortCon = $('<div class="active-sort" />').appendTo($context);

        var activeSortKey = '';

        $root.on('ss:sort-close', function() {
            $context.removeClass(CSS_OPENED_CLASS);
        });

        $root.on('ss:sort-open', function() {
            $context.addClass(CSS_OPENED_CLASS);
        });

        $context.on('click', '.label', function(evt) {
            evt.stopPropagation();

            if ($context.hasClass(CSS_OPENED_CLASS)) {
                $context.trigger('ss:sort-close');
            } else {
                $context.trigger('ss:sort-open');
            }
        });

        $context.on('click', '.sort-option', function() {
            var $sortItem = $(this);
            var $sortInput = $sortItem.find("input");
            var sortInputKey = $sortInput.val();

            if (sortInputKey == activeSortKey) {
                return;
            }

            $sortItems.removeClass(CSS_ACTIVE_CLASS);
            $sortInputs.prop('checked', false);

            $sortItem.addClass(CSS_ACTIVE_CLASS);
            $sortInput.prop('checked', true);

            $activeSortCon.empty().append($('<div class="sort-opt" />').text("Sorted by: " + $sortItem.find("label").text()));
            activeSortKey = sortInputKey;
            $form.trigger('ss:sort-update');
        });
    }

    function loadContent(url) {
        return $.get(url);
    }

    function renderContent(content) {
        $productListingCon.empty();
        $productListingCon.html($(content).html());
    }

    function getFilteredContentUrl($form) {
        return productsWsUrl + (productsWsUrl.indexOf('?') > -1 ? '&' : '?') + $form.serialize();
    }

    function init() {
        $root.find('.filter-con').each(function() {
            initFilterCon($(this));
        });

        $root.find('.sort-by').each(function() {
            initSortCon($(this));
        });

        $root.on('ss:content-load', function(evt, url) {
            $root.trigger('ss:content-loading');

            $.when(loadContent(url)).then(function(data) {
                $root.trigger('ss:content-loaded', $.parseHTML(data));
            });
        });

        $root.on('ss:content-loading', function() {
            isLoadingContent = true;
        });

        $root.on('ss:content-loaded', function(evt, content) {
            renderContent(content);
            $root.trigger("ss:order-influencers");
            isLoadingContent = false;
        });

        $root.on('ss:filter-update ss:sort-update', 'form', function() {
            $root.trigger('ss:content-load', getFilteredContentUrl($(this)));
        });

        $root.on('ss:filter-group-open', function() {
            $root.trigger('ss:sort-close');
        });

        $root.on('ss:sort-open', function() {
            $root.trigger('ss:filter-groups-close');
        });

        $body.on('click', function() {
            $root.trigger('ss:sort-close').trigger('ss:filter-groups-close');
        });
    }

    init();
});