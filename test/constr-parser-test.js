var constrParser = require('../lib/constr-parser');


var db_config = constrParser('mysql://b6f538f445462f:88f21669@us-cdbr-iron-east-03.cleardb.net/heroku_bf72f73387aedbd?reconnect=true');


console.log(db_config);