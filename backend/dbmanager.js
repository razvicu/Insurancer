var mysqlx = require('@mysql/xdevapi');

async function initSession() {
    let session = await mysqlx.getSession( {
        host: 'localhost', port: 33060,
        user: process.env.DB_USER, password: process.env.DB_PWD 
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