jQuery(function($){
    var $infoCon = $(".info");
    var $photoCon = $(".photos");
    var OPEN_CLASS = "open";

    function setupDescriptionToggle() {
        $infoCon.each(function (idx, con) {
            var $con = $(con);
            var $proseDesc = $con.find(".prosedescription");
            var $toggle = $proseDesc.find(".label");
            var $content = $proseDesc.find(".content");

            $toggle.on("click", function (e) {
                $toggle.toggleClass(OPEN_CLASS);
                $content.toggleClass(OPEN_CLASS);
            });
        });
    }

    function setupProductPhotos() {
        $photoCon.each(function(idx, con) {
            var $con = $(con);

        });
    }

    function init() {
        setupDescriptionToggle();
    }

    init();
});