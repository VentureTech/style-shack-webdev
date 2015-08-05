jQuery(function($) {
    var $forms = $("form.miwt-form");

    $forms.each(function(idx, form){
        var $form = $(form);
        var $questions = $form.find(".question");

        $questions.each(function(idx, question){
            var $question = $(question);
            var $imageButtons = $question.find('.button-image-container');

            $imageButtons.each(function(idx, button) {
                var $imageButton = $(button);

                $imageButton.wrapInner('<div class="wrap" />')

                $imageButton.on('click', function(e) {
                    $(this).parents('.button_description_container').siblings().find('.button-image-container').removeClass("checked");
                    $(this).addClass("checked").siblings(".rtb").find("input[type=radio]").attr("checked", true);
                });
            });
        });
    });
});