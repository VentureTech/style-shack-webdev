jQuery(function($) {
    var $root = $('#e-content');

    var MY_SHACK_FORM_SELECTOR = '.my-shack form',
        MY_SHACK_IS_SHOPPER_SELECTOR = '[name="is-shopper"]',
        My_SHACK_OBJECT_TYPE_SELECTOR = '[name="object-type"]',
        MY_SHACK_REMOVE_SELECTOR = '[name="my-shack-remove"]',
        MY_SHACK_ADD_SELECTOR = '[name="my-shack-add"]',
        MY_SHACK_SUBMIT_SELECTOR = '[type="submit"]',
        MY_SHACK_ADD_INPUT = '<input type="hidden" name="my-shack-add" value="1">',
        MY_SHACK_REMOVE_INPUT = '<input type="hidden" name="my-shack-remove" value="1">',
        SERVICE_URL = "/my-shack-service/",
        MY_SHACK_PRODUCTS_SELECTOR = '.my-shack-products';


    var onMyShackSuccess = function (add, remove, $form) {
        if (add && remove) {
            console.log('My-Shack : Unable to determine what I should do.  I\'m returning nothing due to indecision.');
            return;
        }
        var $submit = $form.find(MY_SHACK_SUBMIT_SELECTOR),
            $add = $form.find(MY_SHACK_ADD_SELECTOR),
            $remove = $form.find(MY_SHACK_REMOVE_SELECTOR),
            $objectType = $form.find(My_SHACK_OBJECT_TYPE_SELECTOR),
            objectType = $objectType.attr('value');
        if ($(MY_SHACK_PRODUCTS_SELECTOR).length > 0) {
            console.log(window.location.href);
            window.location.reload(true);
        } else {
            if (add) {
                var buttonText = 'Remove From Shack';
                if (objectType === 'store') {
                    buttonText = 'Unfollow Store';
                }
                $submit.attr('value', buttonText);
                $submit.attr('title', buttonText);
                $remove.remove();
                $add.remove();
                $form.prepend(MY_SHACK_REMOVE_INPUT);
            }
            if (remove) {
                var buttonText = 'Add To Shack';
                if (objectType === 'store') {
                    buttonText = 'Follow Store';
                }
                $submit.attr('value', buttonText);
                $submit.attr('title', buttonText);
                $remove.remove();
                $add.remove();
                $form.prepend(MY_SHACK_ADD_INPUT);
            }
        }
        $root.trigger('ss:shack-product-count-update');
        $root.trigger('ss:shack-store-count-update');
    };

    var onMyShackSubmit = function (e) {
        var form = $(this);
        var isShopper = form.find(MY_SHACK_IS_SHOPPER_SELECTOR).attr('value') === 'true'
        var remove = form.find(MY_SHACK_REMOVE_SELECTOR).length > 0;
        var add = form.find(MY_SHACK_ADD_SELECTOR).length > 0;
        if (isShopper) {
            $.ajax({
                url: SERVICE_URL,
                type: form.attr('method'),
                data: form.serialize(),
                success: function (response) {
                    onMyShackSuccess(add, remove, form);
                }
            });
            return false;
        } else {
            return true;
        }
    };

    $(function () {
        var $myshackform = $(MY_SHACK_FORM_SELECTOR);
        $myshackform.unbind('submit', onMyShackSubmit);
        $myshackform.submit(onMyShackSubmit);
        if (typeof(MutationObserver) !== 'undefined') {
            $(document).each(function (index, element) {
                new MutationObserver(function (records, obs) {
                    $myshackform = $(MY_SHACK_FORM_SELECTOR);
                    $myshackform.unbind('submit', onMyShackSubmit);
                    $myshackform.submit(onMyShackSubmit);
                }).observe(element, {
                    childList: true,
                    subtree: true
                });
            });
        }
    });
});