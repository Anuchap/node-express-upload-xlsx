var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var aws = require('aws-sdk');
var mysql = require('mysql');
var dateFormat = require('dateformat');

var tnsCore = require('./lib/tns-core');
var constrParser = require('./lib/connstr-parser');

var s3bucket = process.env.S3_BUCKET;
var connstr = process.env.CLEARDB_DATABASE_URL;
// var s3bucket = 'tns-excel-dev';
// var connstr = 'mysql://root:@localhost/tns_adsurvey_2017?';

var db = mysql.createPool(constrParser(connstr));

db.query('select 1', function (err, rows) {
    if (err) throw err;
    console.log('database ok');
    app.listen(app.get('port'), function () {
        console.log('app is running on port', app.get('port'));
    });
});

var app = express();
var upload = multer();

app.set('port', process.env.PORT);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(function(err, req, res, next) {
    console.log(err);
    next(err);
})
app.use(express.static(__dirname + '/public'));

app.get('/api/test', function (req, res) {
    res.send("ok");
});

app.get('/api/log', function (req, res) {
    db.query('select id, addtime(datetime, "07:00:00") datetime, agency_id, filename, status from log order by id', function (err, rows) {
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
        Bucket: s3bucket + '/upload',
        Key: filename,
        Body: file.buffer
    };
    s3.putObject(param, function (err) {
        if (err) console.log(err);
        log(req.params.agencyId, filename, 'upload');
        var result = tnsCore.xlsxToJson(req.files[0].buffer);
        res.json(result);
    });
});

app.post('/api/submit/:agencyId', function (req, res) {
    db.query('delete from discipline where agency_id = ?', [req.params.agencyId], function (err, res) {
        if (err) {
            console.log(err);
            return;
        }
        genDisciplines(req.params.agencyId, 1, req.body[0]);
        genDisciplines(req.params.agencyId, 2, req.body[1]);
        updateStatus(req.params.agencyId, 'submit');
    });
    db.query('select status from log where agency_id = ? and status = "back2"', [req.params.agencyId], function (err, rows) {
        if (err)
            res.json(err);
        res.json({ skipPart2: rows.length > 0 });
    });
});

app.post('/api/answer/:agencyId', function (req, res) {
    db.query('insert into answer(datetime,qno,answer,optional,agency_id) values(NOW(),?,?,?,?) on duplicate key update answer=values(answer), optional=values(optional)',
        [req.body.qno, req.body.answer, req.body.optional, req.params.agencyId], function (err, r) {
            if (err) console.log(err);
            res.json(r);
        });
});

function updateStatus(agencyId, status) {
    lastActivity(agencyId, function (err, rows) {
        var filename = rows.length ? rows[0].filename : '';
        log(agencyId, filename, status);
    });
}

function lastActivity(agencyId, cb) {
    db.query('select * from log where agency_id = ? order by id desc limit 1', [agencyId], cb);
}

function log(agencyId, fileName, status) {
    db.query('insert into log(agency_id,datetime,filename,status) values (?,NOW(),?,?)',
        [agencyId, fileName, status], function (err, r) {
            if (err) console.log(err);
            if (status === 'upload') {
                db.query('select id from log where agency_id = ? and status = "start" order by id desc limit 1', [agencyId], function (err, rows) {
                    if (err) console.log(err);
                    db.query('update log set filename = ? where id = ?', [fileName, rows[0].id], function (err, r) {
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
                db.query('insert into discipline(agency_id,sheet,name,category_name,value) values (?,?,?,?,?)',
                    [agencyId, sheetNo, disciplineName, categoryName, value], function (err, r) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        var disciplineId = r.insertId;
                        discipline.subs.forEach(function (sub, i) {
                            if (sub) {
                                db.query('insert into sub_discipline(discipline_id,name,percent) values (?,?,?)',
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
