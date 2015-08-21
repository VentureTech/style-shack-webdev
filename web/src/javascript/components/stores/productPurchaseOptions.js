var SERVICE_PARTIAL_URL = '/productPurchaseOptions';
var CONFIRM_RESERVATION_PARTIAL_URL = "/shop/product/reservation/confirm";
var ORDERITEMBUTTON_WRAPPER_SELECTOR = "div.orderitembutton";
var ADD_TO_ORDER_BUTTON_SELECTOR = ORDERITEMBUTTON_WRAPPER_SELECTOR + ' button.orderitembutton';

var PRODUCT_ID_FIELD_SELECTOR = "form input[name='product']";
var PRODUCT_OPTION_SIZE_FIELD_SELECTOR = "form select[name='productoption_0'] option[selected='selected']";
var PRODUCT_OPTION_COLOR_FIELD_SELECTOR = "form select[name='productoption_1'] option[selected='selected']";
var PRODUCT_QUANTITY_FIELD_SELECTOR = "form .productquantity input[name='quantity']";

var getFormDataJson = function() {
    var productID = $(PRODUCT_ID_FIELD_SELECTOR).attr('value');
    var productSize = $(PRODUCT_OPTION_SIZE_FIELD_SELECTOR).attr('value');
    var productColor = $(PRODUCT_OPTION_COLOR_FIELD_SELECTOR).attr('value');
    var productQuantity = $(PRODUCT_QUANTITY_FIELD_SELECTOR).attr('value');
    return {
        product: productID,
        size: productSize,
        color: productColor,
        quantity: productQuantity
    };
}

var handleAjaxResult = function (json) {
    var isExternalPurchase = json.isExternalPurchaseProduct;
    var externalPurchaseURL = json.externalPurchaseURL;
    var isReservable = json.isReservable;
    if(isExternalPurchase) {
        $(ADD_TO_ORDER_BUTTON_SELECTOR).replaceWith(
            "<input type='button' class='external-purchase btn' data-external-purchase-url='" + externalPurchaseURL + "' value='Purchase On External Site'/>");
        $('.external-purchase.button').click(function(event) {
            var externalPurchaseURL = $(event.target).data("external-purchase-url");
            if(externalPurchaseURL != undefined && externalPurchaseURL != null) {
                window.location = externalPurchaseURL;
            }
        });
    }
    if(isReservable) {
        $(ORDERITEMBUTTON_WRAPPER_SELECTOR).append("<span class='reserve-item-wrapper'></span>");
        $("span.reserve-item-wrapper").append("<input type='button' class='reserve-item btn' value='Reserve'/>");
        $(".reserve-item.btn").click(function(event) {
            var formData = getFormDataJson();
            var productParam = encodeURIComponent(formData.product);
            var sizeParam = encodeURIComponent(formData.size);
            var colorParam = encodeURIComponent(formData.color);
            var quantityParam = encodeURIComponent(formData.quantity);
            var returnPathParam = encodeURIComponent(window.location.href);
            window.location = CONFIRM_RESERVATION_PARTIAL_URL + "?product=" + productParam + "&size=" + sizeParam + "&color=" + colorParam + "&quantity=" + quantityParam + "&return-url=" + returnPathParam;
        });
    }
}

var loadingDialog = function (show) {
    if ( show ) {
        $(document.createElement("div")).addClass("miwt-ajax-progress").addClass("dashboard-ajax-loading").html('<div class="label">'
		+'Loading, Please Wait'
		+'</div>'
        +'<div id="miwt-loading-message-503" style="display: none;">' + '' + '</div>'
		+'<div class="progress-con"><span></span><progress></progress></div>')
        .css({
            position : 'fixed',
            display: 'block'
        }).appendTo("body");
    }
    else {
        $(".dashboard-ajax-loading").remove();
    }
}

var sendAjaxUpdatePurchaseOptions = function () {
    loadingDialog(true)
    
    var url = SERVICE_PARTIAL_URL + $(location).attr('search');
    $.ajax(
        {
            url: url,
            contentType: "application/json",
            success: function (result, status, xhr) {
                var json = JSON.parse(result);
                
                handleAjaxResult(json);
                
                loadingDialog(false)
            },
            error: function (xhr, status, error) {
                console.log( "Ajax request failed." );
                
                loadingDialog(false)
            }
        }
    );
};

$(function () {
    sendAjaxUpdatePurchaseOptions();
});