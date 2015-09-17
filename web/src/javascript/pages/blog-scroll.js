/**
 * Created by webdev on 9/11/15.
 */
jQuery(function($) {
    var $forms = $("form");
    var CSS_CLASS_SELECT_INIT = "select2-offscreen";
    var DEFAULT_SELECT_OPTIONS = {
        placeholder: "Select",
        allowClear: true,
        minimumResultsForSearch: -1
    };
    var newErrorMessage = true;

    function destroySelectUpdates(context) {
        var $con = $(context || document);

        if (!$con.hasClass(CSS_CLASS_SELECT_INIT)) {
            $con = $con.find('select').filter('.' + CSS_CLASS_SELECT_INIT);
        }

        if ($con.length) {
            $con.removeClass(CSS_CLASS_SELECT_INIT).select2('destroy');
        }
    }


    function initSelectUpdates(context) {
        var $con = $(context || document);

        if (!$con.is('select')) {
            $con = $con.find('select');
        }

        if ($con.length) {
            $con.select2(DEFAULT_SELECT_OPTIONS);
            $con.addClass(CSS_CLASS_SELECT_INIT);
            $con.filter('[data-features~="watch"]');
            $con.on('change', miwt.observerFormSubmit);
        }
    }

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

        this.submit_options.preProcessNode = function(data) {
            destroySelectUpdates(document.getElementById(data.refid));
            return data.content;
        };

        this.submit_options.postProcessNode = function(data) {
            $.each(data, function(idx, d) {
                initSelectUpdates(d.node);
            });
        };

        initSelectUpdates(this);
    });

});