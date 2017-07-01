var agencies = ["Adapter Digital Co., Ltd.", "ARC Worldwide", "Brilliant&Million Co,Ltd", "Carat (Thailand) Co.,Ltd", "Dentsu 360", "Digital Groove Co.,Ltd", "Egg Digital Co.,Ltd", "Ewit Co.,Ltd", "Flexmedia Iprospect Co.,Ltd", "Grey (Thailand) Co.,Ltd.", "Havas Worldwide Bangkok Ltd.", "IPG Advertising (Thailand) Limited , IPG Mediabrands Branch ", "Isobar (Thailand) Co.,Ltd", "J Connect, J Walter Thompson Bangkok Group", "360 Innovative Co.,Ltd", "MCFIVA (Thailand) Co.,Ltd", "mInteraction Co.,Ltd", "OgilvyOne", "Omnicom Media Group", "Rabbit's Tale Co.,Ltd", "Starcom MediaVest Group", "Syndacast Co.,Ltd", "Thaiconnexion Co.,Ltd", "Vizeum (Thailand) Vo. ltd", "Winter Egency Co.,Ltd", "Zenith Optimedia Co.,Ltd"];
var tests = ["TEST1","TEST2","TEST3","TEST4","TEST5","TEST6","TEST7","TEST8","TEST9"];

for (let i = 0; i < agencies.length; i++) {
    let running = 1 + i;
    console.log(`insert into agency set id = substring(MD5(${running}), 1, 4), name = "${agencies[i]}", seq = ${running};`);
}

for (let i = 0; i < tests.length; i++) {
    let running = 51 + i;
    console.log(`insert into agency set id = "T0${running}", name = "${tests[i]}", seq = ${running};`);
}

// select name, concat('http://tnsads.ml/#/landing/',id) link from agency where seq > 50 order by seqcls
