var express = require('express');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
var xlsx = require('node-xlsx');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/api/test', function (req, res) {
    res.json({ result: 'OK' }); 
});

app.post('/upload', upload.any(), function(req, res) {


    const workSheetsFromFile = xlsx.parse(__dirname + '\\' + req.files[0].path);

    res.send(workSheetsFromFile);
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});