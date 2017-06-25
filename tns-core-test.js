var core = require('./tns-core');
var fs = require('fs');


var result = core.xlsxToJson('./871A_1.xlsx');


//console.dir(result, { depth: null });

fs.writeFileSync('dataxxx.json', JSON.stringify(result));