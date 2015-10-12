/**
 * Created by webdev on 9/11/15.
 */
jQuery(function($) {
    var $forms = $("form");
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


    $forms.each(function() {
        if (!this.submit_options) {
            this.submit_options = {};
        }

        this.submit_options.postUpdate = function() {
            initScrollPage(this);
        };
    });

});