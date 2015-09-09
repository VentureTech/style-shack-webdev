/**
 * Created by webdev on 8/7/15.
 */
jQuery(function($){
    var $mainNav = $(".main-nav");
    var $spotlightCon =  $('.spotlights');
    var $trendsCon =  $('.trends');
    var $shackCon =  $('.lifeshack');

    $mainNav.find(".mi.spotlight").append($spotlightCon);
    $mainNav.find(".mi.trends").append($trendsCon);
    $mainNav.find(".mi.lifeshack").append($shackCon);
});
