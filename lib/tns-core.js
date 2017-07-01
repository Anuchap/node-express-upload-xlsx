var _ = require('lodash');
var xlsx = require('node-xlsx');

exports.xlsxToJson = function (file) {
    var worksheets = xlsx.parse(file);
    return [convertSheetToJson(worksheets[1].data), convertSheetToJson(worksheets[2].data)];
    //return convertSheetToJson(worksheets[1].data);
};

function convertSheetToJson(sheet) {
    var x = sheet[0];
    var xx = _.map(x, function (name, i) { return { index: i, name: name == null ? null : name.split('\r')[0].trim() } });
    var headers = _.filter(xx, function (item) { return item.name !== null && item.name !== 'Industry'; });

    var categories = [];

    for (var i = 2; i < sheet.length; i = i + 6) {
        if (!sheet[i][0]) continue;

        var cat = { name: sheet[i][0].trim(), disciplines: [], total: 0 };

        for (var j = 0; j < headers.length; j++) {

            var discipline = { name: headers[j].name, value: Number(sheet[i][headers[j].index]), subs: [], subheaders: [], isvalid: true, type: null };

            if (discipline.value) {
                cat.total += discipline.value;
                switch (headers[j].name) {
                    case 'Instagram Ad':
                        discipline.type = 3;
                        discipline.subheaders = ['Display', 'Video'];
                        discipline.subs.push(Number(sheet[i + 2][headers[j].index]));
                        discipline.subs.push(Number(sheet[i + 2][headers[j].index + 1]));
                        discipline.isvalid = _.sum(_.compact(discipline.subs)) === 1;
                        break;
                    case 'Display':
                    case 'Online Video':
                    case 'Creative':
                        discipline.type = 1;
                        discipline.subheaders = ['Direct', 'Ad Network', 'Programmatic'];
                        if(headers[j].name === 'Creative') {
                            discipline.type = 4;
                            discipline.subheaders = ['Online Video', 'Web Banner', 'Social Media'];
                        }
                        discipline.subs.push(Number(sheet[i + 2][headers[j].index]));
                        discipline.subs.push(Number(sheet[i + 2][headers[j].index + 1]));
                        discipline.subs.push(Number(sheet[i + 2][headers[j].index + 2]));
                        discipline.isvalid = _.sum(_.compact(discipline.subs)) === 1;   
                        break;
                    case 'YouTube Ad':
                    case 'Facebook Ad':
                        discipline.type = 2;
                        discipline.subheaders = ['Display Desktop', 'Display Mobile', 'Video Desktop', 'Video Mobile'];
                        var display = sheet[i + 2][headers[j].index];
                        var video = sheet[i + 2][headers[j].index + 3];
                        discipline.subs.push(Number(sheet[i + 4][headers[j].index] * display));
                        discipline.subs.push(Number(sheet[i + 4][headers[j].index + 1] * display));
                        discipline.subs.push(Number(sheet[i + 4][headers[j].index + 3] * video));
                        discipline.subs.push(Number(sheet[i + 4][headers[j].index + 4] * video));
                        discipline.isvalid = _.sum(_.compact(discipline.subs)) > 0.99;
                        break;
                }
            }

            cat.disciplines.push(discipline);
        }

        categories.push(cat);
        //console.dir(cat, { depth: null });
        //break;
    }
    //console.dir(categories, { depth: null });
    return categories;
}