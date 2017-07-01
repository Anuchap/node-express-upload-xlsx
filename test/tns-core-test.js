var core = require('../lib/tns-core');
var fs = require('fs');


var result = core.xlsxToJson('../sample/871A_1.xlsx');


//console.dir(result, { depth: null });

fs.writeFileSync('../sample/dataxxx.json', JSON.stringify(result));