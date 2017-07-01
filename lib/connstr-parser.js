module.exports = function (constr) {
    constr = constr.substring(8, constr.length);
    var userAndPass = constr.split('@')[0].split(':');
    var hostAndDb = constr.split('@')[1].split('?')[0].split('/');
    return {
        connectionLimit: 10,
        host: hostAndDb[0],
        user: userAndPass[0],
        password: userAndPass[1],
        database: hostAndDb[1]
    };
};