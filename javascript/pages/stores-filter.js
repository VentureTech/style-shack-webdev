jQuery(function($){
    $('.filters ul.filter_controls > .mi').each(function() {
        var $con = $(this);
        var $trigger = $con.find('.filter_label');
        var $content = $con.find('.t2_menu');
        var $form = $con.parents('form');

        var CSS_OPENED_CLASS = 'opened';

        $trigger.on('click', function(evt) {
            $content.toggleClass(CSS_OPENED_CLASS);
        });

        $content.on('change', 'input[type=checkbox]', function(evt) {
            $form.submit();
        });
    });
});