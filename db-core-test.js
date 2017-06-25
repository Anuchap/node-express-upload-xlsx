var fs = require('fs');
var db = require('./db-core');

// 1. Test save master data 
//var data = JSON.parse(fs.readFileSync('./jsondata.json'));

//db.saveMasterData('XX01', data);



// 2. Test get last activity

db.getLastActivity('XX01', function(rows) { 
    console.log(rows[0].status);
});

// 3. Test update status 

db.log('XX01', 'newfile', 'uploaded');

console.log('ok');


