jQuery(function($) {
    var $forms = $("form.miwt-form");
    var curStep = "";
    var lastStep = "";
    var newErrorMessage = true;

    function initScrollPage(context) {
        if (newErrorMessage) {
            $('html,body').scrollTop(100);
            newErrorMessage = false;
        }
    }

    $forms.each(function(){
        if (!this.submit_options) {
            this.submit_options = {};
        }

        this.submit_options.postUpdate = function() {
            initScrollPage(this);
        };

    });
});