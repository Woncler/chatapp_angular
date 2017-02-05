'use strict';
var express = require('express');
var router = express.Router();
var db = require('../db').connection;

router.get('/get-rooms', function (req, res, next) {
    if (req.user) {
        console.log(req.user);
        db.getAllRooms(function (err, rooms) {
            if (err) {
                res.send(err);
            } else {
                console.log(rooms);
                res.json(rooms);
            }
        });
    }
});

router.get('/get-user-details', function (req, res, next) {
    console.log('got user from angular request');
    res.json(req.user);
});

router.get('/get-room-details/:id', function (req, res, next) {
    console.log(req.params.id);

    db.getRoom(req.params.id, function (err, room) {
        if (err) {
            console.log('no such room');
            res.redirect('/new');
        } else {
            res.json(room);
        }
    });
});

router.get('/', function (req, res) {
    console.log('getting room root');
    var session = req.session;
    if (req.user) {
        db.getAllRooms(function (err, rooms) {
            if (err) {
                res.render('rooms', { user: req.user });
            } else {
                var users = app.getOnlineUsers();
                res.render('rooms', { user: req.user, rooms: rooms, users: users });
            }
        });
    } else {
        console.log("couldn't find session");
        res.redirect('/');
    }
});

router.get('/new', function (req, res) {
    if (req.user) {
        db.getAllRooms(function (err, rooms) {
            if (err) {
                res.render('rooms', { user: req.user });
            } else {
                var users = app.getOnlineUsers();
                res.render('rooms', { user: req.user, rooms: rooms, users: users, newroom: true });
            }
        });
    } else {
        console.log("couldn't find session");
        res.redirect('/');
    }
});

router.get('/u/:id', function (req, res) {
    console.log('connecting to user');
    if (req.user) {
        app.getSocket(req.params.id, function (err, usr) {
            if (!err) {
                db.getAllRooms(function (err, rooms) {
                    if (err) {
                        res.render('rooms', { user: req.user });
                    } else {
                        var users = app.getOnlineUsers();
                        res.render('rooms', { user: req.user, rooms: rooms, users: users, c_user: usr });
                    }
                });
            } else {
                res.redirect('/');
            };
        });
    } else {
        res.redirect('/');
    }
});



router.get('/:id', function (req, res) {
    console.log('getting specific room');
    if (req.user) {
        db.getRoom(req.params.id, function (err, room) {
            if (err) {
                console.log('no such room');
                res.redirect('/new');
            } else {
                db.getAllRooms(function (err, rooms) {
                    if (err) {
                        res.render('rooms', { user: req.user });
                    } else {
                        var users = app.getOnlineUsers();
                        res.render('rooms', { room: room, user: req.user, rooms: rooms, users: users });
                    }
                });                
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;