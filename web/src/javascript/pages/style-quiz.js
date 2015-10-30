jQuery(function($) {
    var $forms = $("form.miwt-form");
    var CHECKED_CLASS = "checked";
    var SELECTED_CLASS = "selected";
    var UNSELECTED_CLASS = "unselected";
    var curStep = "";
    var lastStep = "";

    function initScrollPage(context) {
        var $con = $(context || document);
        var needToScroll = false;
        var curStep = getCurStepKey($con);

        $con.find(".message-container .message").each(function(idx, message) {
            if (!$(this).data('processed')) {
                needToScroll = true;
                $(this).data('processed', true);
            }
        });

        if (lastStep != curStep) {
            lastStep = curStep;
            needToScroll = true;
        }

        if (needToScroll) {
            $('html,body').scrollTop(100);
        }
    }

    function getCurStepKey(con) {
        return $(con).find(".wizard_procedure_step").attr("class").replace("wizard_procedure_step", "").trim();
    }

    $forms.each(function(idx, form) {
        function initButtonSetup() {
            var $form = $(form);
            var $questions = $form.find(".question");
            var $colorQuestion = $(".question > .fav-color");
            var $colorButtons = $colorQuestion.find(".button_description_container");
            var $imageButtons = $questions.find('.button-image-container');

            curStep = getCurStepKey($form);


            $colorButtons.off("click").on("click", function (e) {
                $(this)
                    .addClass(SELECTED_CLASS)
                    .removeClass(UNSELECTED_CLASS)
                    .find("input[type=radio]")
                    .click();
                $(this)
                    .siblings()
                    .removeClass(SELECTED_CLASS)
                    .addClass(UNSELECTED_CLASS);
            });

            $colorButtons.find('input[type=radio]').off('click').on('click', function(e){
                e.stopPropagation();
            });


            $imageButtons.each(function (idx, button) {
                var $imageButton = $(button);


                if (($imageButton).find(".wrap").length == 0) {
                    $imageButton.wrapInner('<div class="wrap" />');

                    $imageButton.off("click").on('click', function (e) {
                        $(this).parents('.button_description_container')
                            .addClass(SELECTED_CLASS)
                            .removeClass(UNSELECTED_CLASS)
                            .siblings().removeClass(SELECTED_CLASS)
                            .addClass(UNSELECTED_CLASS)
                            .find('.button-image-container')
                            .removeClass(CHECKED_CLASS);
                        $(this)
                            .addClass(CHECKED_CLASS)
                            .siblings(".rtb")
                            .find("input[type=radio]")
                            .prop('checked', true).click();
                    });
                }
            });
        }

        if (!this.submit_options) {
            this.submit_options = {};
        }

        this.submit_options.postUpdate = function() {
            initScrollPage(this);
            initButtonSetup();
        };

        lastStep = getCurStepKey(form);

        initButtonSetup();
    });
});