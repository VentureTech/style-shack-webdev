jQuery(function($){
    $('.filters').each(function() {
        var $con = $(this);
        var $trigger = $con.find('.filter_label');
        var $content = $con.find('.filter_controls');
        var $form = $con.find('form');

        var CSS_OPENED_CLASS = 'opened';

        $trigger.on('click', function(evt) {
            $con.toggleClass(CSS_OPENED_CLASS);
        });

        $content.on('change', 'input[type=checkbox]', function(evt) {
            $form.submit();
        });
    });
});