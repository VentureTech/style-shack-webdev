/**
 * Created by webdev on 7/29/15.
 */
/*************
 * Puts the form labels into the input elements as placeholders and adds a class to show the labels
 * on browsers that do not support placeholders.
 *
 * @Require jquery
 * @Author Scott Benes (sbenes), Kaitlyn Noone (knoone)
 *************/
jQuery(function($){
    var SHOW_CLASS = "show";
    var HIDE_CLASS = "hide";

    var updateInputs = function(con){
        var $con = $(con);

        $('.label, label', con).each(function(idx, lab){
            var $l = $(lab);
            var $input = $l.siblings("input[type=text], input[type=email], textarea");

            if (Modernizr.input.placeholder) {
                $input.attr("placeholder", $l.text());
                $l.addClass(HIDE_CLASS);
            }

        });
        $con.addClass(SHOW_CLASS);
    };



    $('.blog-search form').each(function(){
        var $form = $(this);
        //run the form update at page load
        updateInputs($form);
    });


});