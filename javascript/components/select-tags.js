jQuery(function($){
   var $forms = $("form.miwt-form");

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

            function getPreselectedValues() {
                var preloadValues = $con.find("input").val().split(",");
                var $selectOptions = $select.find("option");
                var optionValues = new Array;
                var options = new Array;
                $selectOptions.each(function (idx, val) {
                    var optVal = $(val).attr("value");
                    var name = $(val).html();
                    optionValues.push(optVal);
                    options.push({id: optVal, text: name});
                });

                return $.map(preloadValues, function (val) {
                    if ($.inArray(val, optionValues) > -1) {
                        return (options[$.inArray(val, optionValues)]);
                    }
                });
            }


            $select.select2($.extend({}, selectDefaults, opts, {data: getPreselectedValues}));
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
        }

        function init() {
            initSelector($tags, {tags: true, multiple: true});
            //initSelector($categories);
            //initSelector($status);
            createTagField($tags);
            //createTagField($categories);
        }

        init();
    });


});