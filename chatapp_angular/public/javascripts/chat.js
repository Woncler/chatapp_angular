var i = 0;
var last_sender = "";
var last_sent = null;
var last_msg_body = "";

$('#m').focus();

if (roomname) {
    socket.emit('joinRoom', { rname: roomname, uname: u_name });
}

var updateTime = function (id, time) {
    var span = '<span class="glyphicon glyphicon-time"></span>';
    setTimeout(function () {
        $('#' + id).html(span + 'a few seconds ago');
        setTimeout(function () {
            $('#' + id).html(span + 'a minute ago');
            setTimeout(function () {
                $('#' + id).html(span + 'a few minutes ago');
                setTimeout(function () {
                    $('#' + id).html(span + time);
                }, 300000)
            }, 300000)
        }, 60000)
    }, 5000);
}

var getMessageHtml = function (user, time, i) {
    var msg_html = '<li class="left clearfix">' +
        '<div class="comment-avatar">' +
        '<img src="http://www.thewrap.com/wp-content/uploads/2016/09/1200.jpg" alt="avatar">' +
        '</div>' +
        '<div class="comment-box clearfix">' +
        '<div class="comment-header">' +
        '<strong class="primary-font">' + user + '</strong>' +
        '<a href="#" id="' + i + user + 't" class="header-time small" data-toggle="popover" data-trigger="focus" data-placement="bottom" data-content="' + time + '">' +
        '<span class="glyphicon glyphicon-time"></span>' +
        'just now' +
        '</a>' +        
        '</div>' +
        '<div id ="' + last_msg_body + '" class="comment-content">' +
        '<p id="' + i + user + '"></p>' +
        '</div>' +
        '</div>' +
        '</li>';

    return msg_html;
};

$('#snd-msg').click(function(e) {
    e.preventDefault();
    $('.emoji-menu').collapse("hide");
    if (!($('#m').text().trim() == "")) {
        var time = new Date();
        var time_tester = new Date();
        time_tester.setTime(time_tester.getTime() - 300000);        

        if ((last_sender == u_name) && (time_tester < last_sent)) {
            var msg_p = $('<p>');
            msg_p.text($('#m').text());

            $('#' + last_msg_body).append(msg_p);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);

            if (roomname) {
                socket.emit('chat message', { room: roomname, msg: $('#m').text(), sndr: u_name, timestamp: time });
            } else {
                socket.emit('chat message', { c_id: c_id, msg: $('#m').text(), sndr: u_name, timestamp: time });
            }
            $('#m').text("");
            i++;
        } else {
            last_sender = u_name;
            last_sent = time;
            last_msg_body = u_name + i + 'msg_body';

            var msg_p = $('<p>');
            msg_p.text($('#m').text());

            var formatted_month = time.getMonth() + 1;
            formatted_month = ('0' + formatted_month).slice(-2);
            var formatted_time = ('0' + time.getDate()).slice(-2) + "." + formatted_month + "." + time.getFullYear() + " " + ('0' + time.getHours()).slice(-2) + ":" + ('0' + time.getMinutes()).slice(-2) + ":" + ('0' + time.getSeconds()).slice(-2);
            var formatted_clocktime = ('0' + time.getHours()).slice(-2) + ":" + ('0' + time.getMinutes()).slice(-2);

            var msg_html = getMessageHtml(u_name, formatted_time, i);
                        
            $('#messages').append(msg_html);
            $('#' + i + u_name).text($('#m').text());
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
            if (roomname) {
                socket.emit('chat message', { room: roomname, msg: $('#m').text(), sndr: u_name, timestamp: time });
            } else {
                socket.emit('chat message', { c_id: c_id, msg: $('#m').text(), sndr: u_name, timestamp: time });
            }
            $('#m').text("");
            updateTime(i + u_name + 't', formatted_clocktime);
            i++;
            $(document).ready(function () {
                $('[data-toggle="popover"]').popover();
            });
        }        
    }
    $('#m').focus();
    return false;
});            
socket.on('chat message', function (msg) {
    var timestamp = new Date(msg.timestamp);
    var time_tester = new Date();
    time_tester.setTime(time_tester.getTime() - 300000);

    if ((last_sender == msg.sndr) && (time_tester < last_sent)) {
        var msg_p = $('<p>');
        msg_p.text(msg.msg);
        $('#' + last_msg_body).append(msg_p);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        i++;
    } else {
        last_sender = msg.sndr;
        last_sent = timestamp;
        last_msg_body = msg.sndr + i + 'msg_body';

        var formatted_month = timestamp.getMonth() + 1;
        formatted_month = ('0' + formatted_month).slice(-2);
        var formatted_time = ('0' + timestamp.getDate()).slice(-2) + "." + formatted_month + "." + timestamp.getFullYear() + " " + ('0' + timestamp.getHours()).slice(-2) + ":" + ('0' + timestamp.getMinutes()).slice(-2) + ":" + ('0' + timestamp.getSeconds()).slice(-2);
        var formatted_clocktime = ('0' + timestamp.getHours()).slice(-2) + ":" + ('0' + timestamp.getMinutes()).slice(-2);

        var msg_html = getMessageHtml(msg.sndr, formatted_time, i);

        $('#messages').append(msg_html);
        $('#' + i + msg.sndr).text(msg.msg);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        updateTime(i + msg.sndr + 't', formatted_clocktime);
        i++;
        $(document).ready(function () {
            $('[data-toggle="popover"]').popover();
        });
    }    
});

$('#m').keydown(function(e) {
    if (e.which == 13 && !e.shiftKey) {
        e.preventDefault();
        $('#snd-msg').click();
    }
});

//https://jsfiddle.net/Xeoncross/4tUDk/
function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

$('.emoji-span').click(function (e) {
    document.getElementById("m").focus();
    pasteHtmlAtCaret($(this).val());
});