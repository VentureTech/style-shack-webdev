jQuery(function($){
   var $forms = $("form.miwt-form");
    var newErrorMessage = true;

    function initScrollPage(context) {
        var $con = $(context || document);

        if ($con.find(".message-container .message").length) {
            if (newErrorMessage == true) {
                newErrorMessage = false;
                $('html,body').scrollTop(100);
            }
        }
        else {
            newErrorMessage == true;
        }
    }

    $forms.each(function (idx, form) {
        var $form = $(form);
        var $tags = $form.find(".post.tags");
        var $categories = $form.find(".post.categories");
        var $status = $form.find(".post.status");
        var selectDefaults = {
            maximumSelectionLength: 10,
            width: 360
        };

        function initSelector(con, opts) {
            var $con = $(con);
            var $select = $con.find("select");
			var serializedPreloadValues = $con.find('input').val();

            $select.find("option.empty").attr("disabled", "true");

            if (serializedPreloadValues && serializedPreloadValues !== "") {
                preloadOpts($select, opts, serializedPreloadValues);
            }

            else if (serializedPreloadValues == null) {
                $select.select2($.extend({}, selectDefaults, opts));
            }

            else {
                $select.select2($.extend({}, selectDefaults, opts, {placeholder: 'Select an option'}));
                $select.find("option.empty").remove();
                $select.next(".select2-container").find('select2-selection__choice__remove[value="x"]').remove();
            }
        }

        function preloadOpts(select, opts, vals) {
            var $select = $(select);
            var serializedPreloadValues = vals;

            var preloadValues = serializedPreloadValues.length ? serializedPreloadValues.split(',') : null;

            $select.select2($.extend({}, selectDefaults, opts));

            if (preloadValues) {
                $select.select2('val', preloadValues);
                $select.trigger('change');
            }
        }

        function createTagField(con) {
            var $select = $(con).find("select");
            var $input = $(con).find("input[type=text]");
            var values = $select.select2("val");

            function updateTagFieldInput() {
                values = $select.select2("val");
                $input.val($.isArray(values) ? values.join(",") : values);
            }

            $select.on("select2:select", updateTagFieldInput);
            $select.on("select2:unselect", updateTagFieldInput);
          	$select.on("change", updateTagFieldInput);
        }

        function init() {
            initSelector($tags, {tags: true, multiple: true});
            initSelector($categories, {tags: false, multiple: true});
            initSelector($status, {minimumResultsForSearch: -1});
            createTagField($tags);
            createTagField($categories);
        }

        if (!this.submit_options) {
            this.submit_options = {};
        }

        this.submit_options.postUpdate = function() {
            initScrollPage(this);
        };

        init();
    });

});