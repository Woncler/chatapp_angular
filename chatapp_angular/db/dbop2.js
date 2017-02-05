var sql = require('mssql');
var datetime = require('node-datetime');
var auth = require('passport-local-authenticate');

var config = {
    user: 'admin_ile',
    password: 'Gen30136',
    server: 'ilechat.database.windows.net',
    database: 'chat',

    options: {
        encrypt: true
    }
}

sql.connect(config, function (err) {
    if (err) {
        console.log('MSSQL error: ' + err);
        return;
    }
});

var checkUser = function (name, cb) {
    var request = new sql.Request();
    console.log('checking user');
    request.query("select id from users where username = '" + name + "'", function (err, recordset) {
        if (err || !recordset.length) {
            cb('user does not exist')
        } else {
            cb(null, recordset[0].id);
        }
    });
}

exports.createUser = function (username, password, cb) {
    console.log('creating user');
    checkUser(username, function (err, id) {
        if (err) {
            console.log(err);
            console.log('getting through checkuser');
            auth.hash(password, function (err, hashed) {
                var dt = datetime.create();
                dt = dt.format('m/d/Y H:M:S');
                var request = new sql.Request();
                request.query("insert into users (username, salt, hash, created, last_login) values ('" + username + "', '" + hashed.salt + "', '" + hashed.hash + "', '" + dt + "', '" + dt + "') select scope_identity() as id", function (err, recordset) {
                    if (err) {
                        cb(err)
                    } else {
                        var user = {
                            id: recordset[0].id,
                            username: username,
                            registered: dt,
                            last_visit: dt
                        }
                        cb(null, user);
                    }
                });
            });            
        } else {
            cb('user already exists');
        }
    });
}

exports.getUsr = function (username, password, cb) {
    console.log('getting user');
    var request = new sql.Request();
    request.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, recordset) {
        if (err || !recordset.length) {
            cb('user not found');
        } else {
            var hashed = { salt: recordset[0].salt, hash: recordset[0].hash };
            auth.verify(password, hashed, function (err, verified) {
                if (verified) {
                    console.log('user verified');
                    var user = {
                        id: recordset[0].id,
                        username: recordset[0].username,
                        registered: recordset[0].created,
                        last_visit: recordset[0].last_login
                    };
                    var dt = datetime.create();
                    dt = dt.format('m/d/Y H:M:S');

                    var updateRequest = new sql.Request();

                    updateRequest.query("UPDATE users SET last_login='" + dt + "' WHERE username = '" + username + "'", function (err) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, user);
                        }
                    });
                } else {
                    cb('wrong password');
                }
            });
        }
    });
}

exports.getUsrData = function (id, cb) {
    var request = new sql.Request();
    request.query("SELECT * FROM users WHERE id = '" + id + "'", function (err, recordset) {
        if (err || !recordset.length) {
            cb(err + 'empty query');
        } else {
            var user = {
                id: recordset[0].id,
                username: recordset[0].username,
                registered: recordset[0].created,
                last_visit: recordset[0].last_login
            }
            cb(null, user);
        }
    });
}

exports.getRoom = function (id, cb) {
    var request = new sql.Request();
    request.query("SELECT * FROM rooms WHERE id ='" + id + "'", function (err, recordset) {
        if (err || !recordset.length) {
            cb(err + 'empty query');
        } else {
            var room = {
                id: recordset[0].id,
                name: recordset[0].name,
                desc: recordset[0].description,
                created: recordset[0].created
            }
            cb(null, room);
        }
    });
}

exports.getAllRooms = function (cb) {
    console.log('getting all rooms');
    var request = new sql.Request();
    request.query("SELECT * FROM rooms", function (err, recordset) {
        if (err || !recordset.length) {
            cb(err + 'empty query');
        } else {
            cb(null, recordset);
        }
    });
}

exports.createRoom = function (name, desc, privateR, cb) {
    console.log('creating room');
    console.log(name + desc);

    var request = new sql.Request();

    request.query("SELECT id FROM rooms WHERE name= '" + name + "'", function (err, recordset) {
        if (!recordset.length) {
            var createRequest = new sql.Request();
            var dt = datetime.create();
            dt = dt.format('m/d/Y H:M:S');
            createRequest.query("INSERT INTO rooms (name, description, created, private) VALUES ('" + name + "', '" + desc + "',  '" + dt + "', '" + privateR + "') SELECT SCOPE_IDENTITY() as id", function (err, recordset) {
                if (err || !recordset.length) {
                    console.log(err);
                    cb(err + 'empty query');
                } else {
                    var room = {
                        id: recordset[0].id,
                        name: name,
                        desc: desc,
                        created: dt
                    }
                    cb(null, room);
                }
            });
        } else {
            console.log(err + 'hmmh');
            cb('room exists');
        }
    });
}