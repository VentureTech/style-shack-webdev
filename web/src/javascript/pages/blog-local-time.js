/**
 * Created by webdev on 11/16/15.
 */
jQuery(function ($) {
    var $posts = $(".l-primary-content .post");

    $posts.each(function (idx, post) {
        var $post = $(post);

        var date = $post.find(".full-date").text();
        var $dateHolder = $post.find(".byline .date");
        var newDate = moment.utc(date).clone().toDate();
        var fmtNewDate = moment(newDate).format('MMM Do YYYY [at] h:mm a');
        $dateHolder.empty().append(fmtNewDate);
    });
});