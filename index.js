var express = require('express');
var aws = require('aws-sdk');
var bodyParser = require('body-parser');
var multer = require('multer');
//var multerS3  = require('multer-s3');
var xlsx = require('node-xlsx');

aws.config.update({
    accessKeyId: 'AKIAILNLO4RXHZVIEEVQ',
    secretAccessKey: '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'
});

var app = express();
var s3 = new aws.S3();

var upload = multer();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/api/test', function (req, res) {
    res.json({ result: 'OK' });
});

app.post('/upload', upload.any(), function (req, res) {
    var param = {
        Bucket: 'tns-excel/complete',
        Key: Date.now() + '_' + req.files[0].originalname,
        Body: req.files[0].buffer
    };

    s3.putObject(param, function (err, data) {
        if (err) console.log(err);
    });

    var worksheets = xlsx.parse(req.files[0].buffer);
    res.send(worksheets);
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});