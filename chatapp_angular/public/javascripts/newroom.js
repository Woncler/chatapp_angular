$("#room-submit").click(function (e) {
    e.preventDefault();
    var $form = $(this);

    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {
            roomname: $("#roomname").val(),
            desc: $("#description").val(),
            icon: $("#icon").val(),
            private: $("#private").is(":checked")
        },
        url: '/rooms/newroom',
        beforeSend: function () {

        }
    }).done(function (data) {
        console.log("done");
        console.log(data);
        window.location.replace("/rooms/" + data.id);
    }).fail(function () {
        if (!$('#create-room').has('.alert').length)
            $('#create-room').prepend("<div class='alert alert-danger alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Error!</strong> Room already exists.</div>");
        console.log("fail");
    }).always(function () {

    });
});