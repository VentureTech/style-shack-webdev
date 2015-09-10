/**
 * Created by webdev on 8/7/15.
 */
jQuery(function($){
    var $mainNav = $(".main-nav");
    var blogCats = [".spotlights", ".trends", ".lifeshack"];


    for (var i = 0; i < blogCats.length; i++) {
        var $con = $(blogCats[i]+".render");
        if ($con.length) {
            appendBlogCatsToMenu($con, blogCats[i]);
        }
    }

    function appendBlogCatsToMenu($con, classname) {
        $mainNav.find(classname).append($con);
    }
});


