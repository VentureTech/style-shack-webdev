jQuery(function($){
    var $infoCon = $(".more-info > div");
    var $loadingDiv = $('<div class="loading" />');
    var $photoCon = $(".images");
    var $forms = $("form");

    var CSS_OPEN_CLASS = "open";
    var CSS_EMPTY_CLASS = "empty";
    var CSS_REMOVE_CLASS = "remove";
    var CSS_LOADED_CLASS = "loaded";
    var CSS_OLD_CLASS = "old";
    var CSS_NEW_CLASS = "new";

    function setupDescriptionToggle() {
        $infoCon.each(function (idx, con) {
            var $con = $(con);
            var $toggle = $con.find(".title");
            var $content = $con.find(".content");

            $toggle.on("click", function (e) {
                $toggle.toggleClass(CSS_OPEN_CLASS);
                $content.toggleClass(CSS_OPEN_CLASS);
            });
        });
    }

    function loadActivePictureInfo(thumb) {
        var $thumb = $(thumb);
        var largeUrl = $thumb.data("large");
        var xlUrl = $thumb.data("xl");

        var $con = $(".main > .image");
        var $img = $con.hasClass(CSS_EMPTY_CLASS) ? $([]) : $con.find('img');

        if (!$img.length) {
            $img = $('<img />').attr("src", largeUrl);
            $con.append($img);
        }
        else {
            updateImage($con, $img, largeUrl);
        }


        $img.one('load', function() {
            $con.removeClass(CSS_EMPTY_CLASS);

        }).each(function(){
            if (this.complete) $img.load();
        });
    }

    function updateImage(con, img, url) {
        var $con = $(con);
        var $img = $(img);
        var largeUrl = url;

        $img.removeClass(CSS_NEW_CLASS).addClass(CSS_OLD_CLASS);
        $con.append('<div class="loading" />');
        $img = $('<img />').attr("src", largeUrl).addClass(CSS_NEW_CLASS);
        $con.append($img);
        $con.find(".old").addClass(CSS_REMOVE_CLASS);
        setTimeout(function(){
            $con.find(".loading").remove();
            $img.addClass("loaded");
            $con.find(".old").remove();
        }, 500);
    }


    function setupProductPhotos() {
        $photoCon.each(function(idx, con) {
            var $con = $(con);
            var $thumbs = $con.find(".thumbs .image");

            $thumbs.each(function(idx, thumb){
                var $thumb = $(thumb);

                $thumb.on("click", function(e){
                    loadActivePictureInfo(this);
                });
            });

            $thumbs.first().trigger("click");
        });
    }

    function init() {
        setupDescriptionToggle();
        setupProductPhotos();

        $forms.each(function (idx, form) {
            var $form = $(form);

            function setupVariantSwitch() {
                console.log("switch");
            }

            if (!this.submit_options) {
                this.submit_options = {};
            }

            this.submit_options.postUpdate = function () {
                setupVariantSwitch();
            };
        });
    }

    init();
});