jQuery(function($) {
    var $forms = $("form.miwt-form");
    var CHECKED_CLASS = "checked";
    var SELECTED_CLASS = "selected";
    var UNSELECTED_CLASS = "unselected";
    var FOCUSED_CLASS = "focused";
    var curStep = "";
    var lastStep = "";
    var newErrorMessage;

    function initScrollPage(context) {
        var $con = $(context || document);

        if (newErrorMessage == null && $con.find(".message-container .message").length) {
            newErrorMessage = true;
        }

        if (newErrorMessage) {
            $('html,body').scrollTop(400);
            newErrorMessage = false;
        }
    }

    $forms.each(function(idx, form){
        if (!this.submit_options) {
            this.submit_options = {};
        }

        this.submit_options.postUpdate = function() {
            initScrollPage(this);
        };
    });
});