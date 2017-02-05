var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var datetime = require('node-datetime');
var auth = require('passport-local-authenticate');

var setConnection = function () {
    var dbconfig = {
        userName: 'admin_ile',
        password: 'Gen30136',
        server: 'ilechat.database.windows.net',
        options: {
            encrypt: true,
            database: 'chat'
        }
    }
    var dbconnection = new Connection(dbconfig);
    return dbconnection;
}

var requestHandler = function (req, cb) {
    var connection = setConnection();
    console.log('handling request');
    connection.on('connect', function (err) {
        if (err) {
            console.log(err + 'err');
        } else {
            console.log('Connected to db');
        }

        var request = new Request(req, function (err, rowCount) {
            if (rowCount == 0) {
                console.log(err);
                cb('no user found');
            }
        });

        request.on('row', function (columns) {
            cb(null, columns);
        });

        connection.execSql(request);
    });

    // hack for azure load balancing https://github.com/tediousjs/tedious/issues/300#issuecomment-216603746
    connection.on('error', function (err) {
        console.log(err);
        console.log('The app is still running as this error is recoverable');
    });
}

var requestHandlerAll = function (req, cb) {
    var result = [];
    var i = 0, j = 0;
    var connection = setConnection();
    connection.on('connect', function (err) {
        if (err) {
            console.log(err);
        } else {
            var request = new Request(req, function (err, rowCount, rows) {
                console.log('requesting all');
                if (err) {
                    console.log(err);
                }
            });

            request.on('row', function (columns) {
                result[i] = {};
                for (j = 0; j < columns.length; j++) {
                    var columnname = columns[j].metadata.colName;
                    result[i][columnname] = columns[j].value;
                }
                i++;
            });

            request.on('doneInProc', function (rowCount) {
                if (rowCount == 0) {
                    cb('no rows');
                } else {
                    cb(null, result);
                }
            });
            connection.execSql(request);
        }
    });

    // hack for azure load balancing https://github.com/tediousjs/tedious/issues/300#issuecomment-216603746
    connection.on('error', function (err) {
        console.log(err);
        console.log('The app is still running as this error is recoverable');
    }); 
}

exports.checkUser = function (name, cb) {
    var request = "SELECT username FROM users WHERE username = '" + name + "'";

    requestHandler(request, function (err, columns) {
        if (err) {
            cb(err);
        } else {
            cb(null, columns[0].value);
        }
    });
}

exports.createUser = function (username, password, cb) {
    var request1 = "SELECT id FROM users WHERE username = '" + username + "'";
    auth.hash(password, function (err, hashed) {
        requestHandler(request1, function (err, columns) {
            if (!err) {
                cb('user already exists');
            } else {
                var dt = datetime.create();
                dt = dt.format('m/d/Y H:M:S');
                var request2 = "INSERT INTO users (username, salt, hash, created, last_login) VALUES ('" + username + "', '" + hashed.salt + "', '" + hashed.hash + "', '" + dt + "', '" + dt + "') SELECT SCOPE_IDENTITY()";
                requestHandler(request2, function (err, columns) {
                    if (err) {
                        cb('db error');
                    } else {
                        var user = {
                            id: columns[0].value,
                            username: username,
                            registered: dt,
                            last_visit: dt
                        }
                        cb(null, user);
                    }
                });
            }
        });
    });
}

exports.getUsr = function (username, password, cb) {
    console.log('getting user');
    var request1 = "SELECT * FROM users WHERE username = '" + username + "'";

    requestHandler(request1, function (err, columns) {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            var hashed = { salt: columns[2].value, hash: columns[3].value };
            auth.verify(password, hashed, function (err, verified) {
                if (verified) {
                    console.log('usr verified');
                    var user = {
                        id: columns[0].value,
                        username: columns[1].value,
                        registered: columns[4].value,
                        last_visit: columns[5].value
                    };
                    var dt = datetime.create();
                    dt = dt.format('m/d/Y H:M:S');
                    var request2 = "UPDATE users SET last_login='" + dt + "' WHERE username = '" + username + "' SELECT SCOPE_IDENTITY()";
                    requestHandler(request2, function (err, columns) {
                        if (err) {
                            console.log(err);
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
    var request = "SELECT * FROM users WHERE id = '" + id + "'";

    requestHandler(request, function (err, columns) {
        if (err) {
            cb(err);
        } else {
            var user = {
                id: columns[0].value,
                username: columns[1].value,
                registered: columns[4].value,
                last_visit: columns[5].value
            };
            cb(null, user);
        }
    });
}

exports.getRoom = function (id, cb) {
    var request = "SELECT * FROM rooms WHERE id ='" + id + "'";

    requestHandler(request, function (err, columns) {
        if (err) {
            cb(err);
        } else {
            var room = {
                id: columns[0].value,
                name: columns[1].value,
                desc: columns[2].value,
                created: columns[4].value
            };
            cb(null, room);
        }
    });
}

exports.getAllRooms = function (cb) {
    console.log('getting all rooms');
    var request = "SELECT * FROM rooms";

    requestHandlerAll(request, function (err, result) {
        if (err) {
            cb(err);
        } else {
            cb(null, result);
        }
    });
}

exports.createRoom = function (name, desc, icon, privateR, cb) {
    console.log('creating room');
    console.log(name + desc);

    var request1 = "SELECT id FROM rooms WHERE name= '" + name + "'";

    requestHandler(request1, function (err, columns) {
        if (err) {
            if (privateR) 
                privateR = 1;
            else
                privateR = 0;
            var dt = datetime.create();
            dt = dt.format('m/d/Y H:M:S');
            var request2 = "INSERT INTO rooms (name, description, icon, created, private) VALUES ('" + name + "', '" + desc + "', '" + icon + "', '" + dt + "', " + privateR + ") SELECT SCOPE_IDENTITY()";
            console.log('starting room creation');
            requestHandler(request2, function (err, columns) {
                if (err) {
                    console.log(err + 'error rc');
                    cb('error in room creation');
                } else {
                    console.log(err + 'success rc');
                    cb(null, columns[0].value);
                }
            });
        } else {
            cb('room exists');
        }
    });
}