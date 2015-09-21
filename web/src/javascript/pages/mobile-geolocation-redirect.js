/**
 * Created by webdev on 9/21/15.
 */

var isiPad = /ipad/i.test(navigator.userAgent.toLowerCase());
var isiPhone = /iphone/i.test(navigator.userAgent.toLowerCase());
var isiPod = /ipod/i.test(navigator.userAgent.toLowerCase());
var isiDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
var isBlackBerry = /blackberry/i.test(navigator.userAgent.toLowerCase());
var isWebOS = /webos/i.test(navigator.userAgent.toLowerCase());
var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());

var params = (window.location.search);

if ((isiPad || isiPhone || isiPod  || isiDevice || isAndroid || isBlackBerry || isWebOS || isWindowsPhone) && jQuery(window).width() < 1025 && params.length == 0) {
    window.location.href="/shop/stores/search";
}