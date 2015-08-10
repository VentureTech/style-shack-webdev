jQuery(function($){
   var $forms = $("form.miwt-form");

    function initSelector(input) {
        var $select = $(input);
        $select.select2({
            tags: true,
            maximumSelectionLength: 10,
            width: 360
        })
    }

    function createTagField(select) {
        var $select = $(select);

        $select.on("select2:change", function(e){

        });

    }

    function init() {
        $forms.each(function (idx, form) {
            var $form = $(form);
            var $tagSelect = $form.find(".post.tags > select");


            //initSelector($tagSelect);
            //createTagField($tagSelect);
        });
    }

    init();
});