var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tns_adsurvey_2017'
});

exports.getLastActivity = function (agencyId, cb) {
    connection.query('select * from log where agency_id = ? order by id desc limit 1', [agencyId], function (err, rows) {
        cb(rows);
    });
};

exports.log = function (agencyId, fileName, status) {
    connection.query('insert into log(agency_id,datetime,filename,status) values (?,NOW(),?,?)',
        [agencyId, fileName, status], function (err, r) {
            if (err) console.log(err);
            if (status === 'uploaded') {
                connection.query('select id from log where agency_id = ? and status = "started" order by id desc limit 1', [agencyId], function (err, rows) {
                    if (err) console.log(err);
                    console.log(rows)
                    connection.query('update log set filename = ? where id = ?', [fileName, rows[0].id], function (err, r) {
                        if (err) console.log(err);
                    });
                });
            }
        });
};

exports.saveAnswer = function (agencyId, questNo, answer, optional) {
    connection.query('insert into answer (agency_id,datetime,qno,answer,optional) values (?,NOW(),?,?,?) on duplicate key update answer=values(answer), optional=values(optional)',
        [agencyId, questNo, answer, optional], function (err, r) {
            if (err) console.log(err);
        });
};

exports.saveMasterData = function (agencyId, data) {
    data.forEach(function (d, i) { genDisciplines(agencyId, i + 1, d); });
};

function genDisciplines(agencyId, sheetNo, categories) {
    categories.forEach(function (category) {
        var categoryName = category.name;
        category.disciplines.forEach(function (discipline) {
            var disciplineName = discipline.name;
            var value = discipline.value;
            if (value) {
                connection.query('insert into discipline(agency_id,sheet,name,category_name,value) values (?,?,?,?,?)',
                    [agencyId, sheetNo, disciplineName, categoryName, value], function (err, r) {
                        if (err) console.log(err);
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

