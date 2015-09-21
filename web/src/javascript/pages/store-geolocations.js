jQuery(function($){
    var $fail = $('.geo-fail');
    var $wait = $('.geo-wait');
    var $timedOut = $('.geo-timeout');
    var $success = $('.geo-results');
    var timeoutFail;
    var dataURL = $success.attr("data-url");

    var fail = function(timeout) {
        var timeout = timeout;
        $wait.hide();
        if (timeout) {
            $timedOut.show();
        }
        else {
            $fail.show();
        }
    };

    var waiting = function(){
        timeoutFail = setTimeout(function(){
            fail("timeout");
            clearTimeout(timeoutFail);
        },10000);

        $fail.hide();
        $timedOut.hide();
        $wait.show();
    };

    var success = function(position) {
        clearTimeout(timeoutFail);
        var params = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            distance: 50
        };

        $success
            .find('.listing')
            .load(dataURL, params, function(){
                $wait.hide();
                $timedOut.hide();
                $success.show();

            });
    };

    if (navigator.geolocation) {
        waiting();
        navigator.geolocation.getCurrentPosition(success, fail);
    } else {
        fail();
    }
});

