var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var aws = require('aws-sdk');
var mysql = require('mysql');
var dateFormat = require('dateformat');

var tns = require('./tns-core');

var s3_bucket = process.env.S3_BUCKET;
var db_config = process.env.CLEARDB_DATABASE_URL;

// var db_config = {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'tns_adsurvey_2017'
// };

// for keep db connection alive
var connection;
function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.
    connection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();
//setInterval(function () { connection.query('SELECT 1'); }, 5000);

var app = express();
var upload = multer();

app.set('port', process.env.PORT);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/api/test', function (req, res) {
    res.json({ result: 'OK' });
});

app.get('/api/log', function (req, res) {
    connection.query('select id, addtime(datetime, "07:00:00") datetime, agency_id, filename, status from log order by id', function (err, rows) {
        if (err) res.write(err);
        rows.forEach(function (row) {
            res.write(row.id + ' ' + dateFormat(row.datetime, 'yyyy-mm-dd HH:MM:ss') + ' ' + row.agency_id + ' ' + row.filename + ' ' + row.status + '\n');
        });
        res.end();
    });
});

app.get('/api/checkstatus/:agencyId', function (req, res) {
    lastActivity(req.params.agencyId, function (err, rows) {
        if (err) res.json(err);
        res.json({ status: rows.length ? rows[0].status : 'no status found' });
    });
});

app.get('/api/setstatus/:agencyId/:status', function (req, res) {
    updateStatus(req.params.agencyId, req.params.status);
    res.send('log stattus to ' + req.params.status);
});

app.post('/api/upload/:agencyId', upload.any(), function (req, res) {
    var file = req.files[0];
    var filename = Date.now() + '_' + req.params.agencyId + '.xlsx';
    var s3 = new aws.S3();
    var param = {
        Bucket: s3_bucket + '/upload',
        Key: filename,
        Body: file.buffer
    };
    s3.putObject(param, function (err) {
        if (err) console.log(err);
        log(req.params.agencyId, filename, 'upload');
        var result = tns.xlsxToJson(req.files[0].buffer);
        res.json(result);
    });
});

app.post('/api/submit/:agencyId', function (req, res) {
    connection.query('delete from discipline where agency_id = ?', [req.params.agencyId], function (err, res) {
        if(err) {
            console.log(err);
            return;
        }
        genDisciplines(req.params.agencyId, 1, req.body[0]);
        genDisciplines(req.params.agencyId, 2, req.body[1]);
        updateStatus(req.params.agencyId, 'submit');
    });
    connection.query('select status from log where agency_id = ? and status = "back2"', [req.params.agencyId], function(err, rows) {
        if(err)
            res.json(err);
        res.json({ skipPart2: rows.length > 0 });
    });
});

app.post('/api/answer/:agencyId', function (req, res) {
    connection.query('insert into answer(datetime,qno,answer,optional,agency_id) values(NOW(),?,?,?,?) on duplicate key update answer=values(answer), optional=values(optional)',
        [req.body.qno, req.body.answer, req.body.optional, req.params.agencyId], function (err, r) {
            if (err) console.log(err);
            res.json(r);
        });
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

function updateStatus(agencyId, status) {
    lastActivity(agencyId, function (err, rows) {
        var filename = rows.length ? rows[0].filename : '';
        log(agencyId, filename, status);
    });
}

function lastActivity(agencyId, cb) {
    connection.query('select * from log where agency_id = ? order by id desc limit 1', [agencyId], cb);
}

function log(agencyId, fileName, status) {
    connection.query('insert into log(agency_id,datetime,filename,status) values (?,NOW(),?,?)',
        [agencyId, fileName, status], function (err, r) {
            if (err) console.log(err);
            if (status === 'upload') {
                connection.query('select id from log where agency_id = ? and status = "start" order by id desc limit 1', [agencyId], function (err, rows) {
                    if (err) console.log(err);
                    connection.query('update log set filename = ? where id = ?', [fileName, rows[0].id], function (err, r) {
                        if (err) console.log(err);
                    });
                });
            }
        });
}

function genDisciplines(agencyId, sheetNo, categories) {
    categories.forEach(function (category) {
        var categoryName = category.name;
        category.disciplines.forEach(function (discipline) {
            var disciplineName = discipline.name;
            var value = discipline.value;
            if (value) {
                connection.query('insert into discipline(agency_id,sheet,name,category_name,value) values (?,?,?,?,?)',
                    [agencyId, sheetNo, disciplineName, categoryName, value], function (err, r) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        var disciplineId = r.insertId;
                        discipline.subs.forEach(function (sub, i) {
                            if (sub) {
                                connection.query('insert into sub_discipline(discipline_id,name,percent) values (?,?,?)',
                                    [r.insertId, discipline.subheaders[i], sub], function (err, r) {
                                        if (err) console.log(err);
                                    });
                            }
                        });
                    });
            }
        });
    });
}
