jQuery(function($){
   var $forms = $("form.miwt-form");

    $forms.each(function (idx, form) {
        var $form = $(form);
        var $tags = $form.find(".post.tags");
        var $categories = $form.find(".post.categories");
        var selectDefaults = {
            maximumSelectionLength: 10,
            width: 360
        };

        function initSelector(con, opts) {
            var $select = $(con).find("select");

            $select.select2($.extend({}, selectDefaults, opts));
        }

        function createTagField(con) {
            var $select = $(con).find("select");
            var $input = $(con).find("input[type=text]");
            var values = $select.select2("val");

            function updateTagFieldInput() {
                values = $select.select2("val");
                $input.val(values ? values.join(" ") : "");
            }


            $select.on("select2:select", updateTagFieldInput);
            $select.on("select2:unselect", updateTagFieldInput);

        }


        function init() {
            initSelector($tags, {tags: true, multiple: true});
            initSelector($categories);
            createTagField($tags);
            createTagField($tags);
        }

        init();
    });


});