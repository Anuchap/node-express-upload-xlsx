const mysql = require('mysql');

const fs = require('fs');

const jsonData = JSON.parse(fs.readFileSync('./jsondata.json'));

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tns_adsurvey_2017'
});

insertDiscipline('1', 1, jsonData[0]);
insertDiscipline('1', 2, jsonData[1]);

function insertDiscipline(agencyId, sheetNo, categories) {

    categories.forEach(function (category) {
        const categoryName = category.name;
        category.disciplines.forEach(function (discipline) {
            const disciplineName = discipline.name;
            const value = discipline.value;
            if (value) {
                conn.query('insert into discipline(agency_id,sheet,name,category_name,value) values (?,?,?,?,?)',
                    [agencyId, sheetNo, disciplineName, categoryName, value], function (err, r) {
                        if (err) throw err;
                        const disciplineId = r.insertId;
                        discipline.subs.forEach(function (sub, i) {
                            if (sub) {
                                conn.query('insert into sub_discipline(discipline_id,name,percent) values (?,?,?)',
                                    [r.insertId, discipline.subheaders[i], sub], function (err, r) {
                                        if (err) throw err;
                                    });
                            }
                        });
                    });
            }
        });
    });
}

