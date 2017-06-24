const _ = require('lodash');
const xlsx = require('node-xlsx');

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

    for (let i = 2; i < sheet.length; i = i + 6) {
        if (!sheet[i][0]) continue;

        var cat = { name: sheet[i][0].split('(')[0].trim(), disciplines: [] };

        for (let j = 0; j < headers.length; j++) {

            let discipline = { name: headers[j].name, value: sheet[i][headers[j].index], subs: [], subheaders: [], isvalid: true };

            if (discipline.value) {
                switch (headers[j].name) {
                    case 'Instagram Ad':
                        discipline.subheaders = ['Display', 'Video'];
                        discipline.subs.push(sheet[i + 2][headers[j].index]);
                        discipline.subs.push(sheet[i + 2][headers[j].index + 1]);
                        discipline.isvalid = _.sum(_.compact(discipline.sub)) === 1;
                        break;
                    case 'Display':
                    case 'Online Video':
                    case 'Creative':
                        discipline.subheaders = ['Direct', 'Ad Network', 'Programmatic'];
                        discipline.subs.push(sheet[i + 2][headers[j].index]);
                        discipline.subs.push(sheet[i + 2][headers[j].index + 1]);
                        discipline.subs.push(sheet[i + 2][headers[j].index + 2]);
                        discipline.isvalid = _.sum(_.compact(discipline.sub)) === 1;
                        break;
                    case 'YouTube Ad':
                    case 'Facebook Ad':
                        var display = sheet[i + 2][headers[j].index];
                        var video = sheet[i + 2][headers[j].index + 3];
                        discipline.subheaders = ['Display Desktop', 'Display Mobile', 'Video Desktop', 'Video Mobile'];
                        discipline.subs.push(sheet[i + 4][headers[j].index] * display);
                        discipline.subs.push(sheet[i + 4][headers[j].index + 1] * display);
                        discipline.subs.push(sheet[i + 4][headers[j].index + 3] * video);
                        discipline.subs.push(sheet[i + 4][headers[j].index + 4] * video);
                        discipline.isvalid = _.sum(_.compact(discipline.sub)) === 1;
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