$("#login-submit").click(function (e) {
    e.preventDefault();
    var $form = $(this);

    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {
            username: $("#username").val(),
            password: $("#password").val()
        },
        url: '/login',
        beforeSend: function () {

        }
    }).done(function (data) {
        console.log("done");
        console.log(data);
        window.location.replace("/rooms");
    }).fail(function () {
        if (!$('#login').has('.alert').length)
            $('#login').prepend("<div class='alert alert-danger alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Error!</strong> Wrong username or password.</div>");
        console.log("fail");
    }).always(function () {

    });
});

$("#register-submit").click(function (e) {
    e.preventDefault();
    var $form = $(this);

    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {
            username: $("#r_username").val(),
            password: $("#r_password").val()
        },
        url: '/register',
        beforeSend: function () {

        }
    }).done(function (data) {
        console.log("done");
        console.log(data);
        window.location.replace("/rooms");
    }).fail(function () {
        if (!$('#register').has('.alert').length)
            $('#register').prepend("<div class='alert alert-danger alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Error!</strong> Username is already taken.</div>");
        console.log("fail");
    }).always(function () {

    });
});