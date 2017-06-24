const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const aws = require('aws-sdk');
const xlsx = require('node-xlsx');

// user from .env
// aws.config.update({
//     accessKeyId: 'AKIAI6KSDHONSPLFKQTA',
//     secretAccessKey: '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'
// });

const S3_BUCKET = process.env.S3_BUCKET;

const app = express();
const upload = multer();

app.set('port', process.env.PORT);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/api/test', function (req, res) {
    res.json({ result: 'OK' });
});

app.post('/upload', upload.any(), function (req, res) {
    uploadToS3('upload', req.files[0], function(err) {
        if (err)  {
            console.log(err);
            res.send(err);
        }

        var worksheets = xlsx.parse(req.files[0].buffer);
        res.send(worksheets);
    });
});

function uploadToS3(folder, file, cb) {
    const s3 = new aws.S3();
    var param = {
        Bucket: S3_BUCKET + '/' + folder,
        Key: Date.now() + '_' + file.originalname,
        Body: file.buffer
    };
    s3.putObject(param, cb);
}

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});