var mysqlx = require('@mysql/xdevapi');
const {DB_HOST, DB_PORT, DB_USER, DB_PWD} = require('./config');

async function initSession() {
    let session = await mysqlx.getSession( {
        host: DB_HOST, port: DB_PORT,
        user: DB_USER, password: DB_PWD 
    });    
    return session;
}

async function getInsurancesTable(db) {
    return db.getTable('insurances');
}

module.exports = {
    initSession: initSession,
    getInsurancesTable: getInsurancesTable
};