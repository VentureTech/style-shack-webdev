jQuery(function($){
    var $passwordResetUsername = $(".password-reset").find(".username.field");
    var $usernameLabel = $passwordResetUsername.find("label");

    $usernameLabel.empty().text("Email");
});