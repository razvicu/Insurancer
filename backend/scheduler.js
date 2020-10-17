var schedule = require('node-schedule');
var dbm = require('./dbmanager');
const nodemailer = require('nodemailer');
const moment = require('moment');

const {SENDER_EMAIL, DEST_EMAIL, DB_PWD} = require('./config');


module.exports = {
    runScheduler: async function() {
        schedule.scheduleJob('0 0 1 * * *', sendMail);
    }
};

async function sendMail() {
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let insurancesTable = await db.getTable('insurances');

    let currentDate = new Date().getTime();

    let insurances = await insurancesTable.select(['IID', 'insuredName', 'licensePlate', 'phoneNumber', 'expirationDate']).execute();
    insurances = insurances.fetchAll();
    session.close();

    let expiringIn3Days = [];
    let expiringIn7Days = [];

    insurances.forEach(insurance => {
        let insurance_ = 
            {
                id: insurance[0], 
                insuredName: insurance[1],
                licensePlate: insurance[2],
                phoneNumber: insurance[3],
                expirationDate: insurance[4]
            };
        let time = new Date(insurance[4]).getTime() - currentDate;
        if (time > 0 && time < 1000 * 3600 * 24 * 3) {
            expiringIn3Days.push(insurance_)
        } else if (time > 0 && time < 1000 * 3600 * 24 * 7) {
            expiringIn7Days.push(insurance_)
        }
    });
    let style = "<style>table, td, th { border: 1px solid; } </style>";
    let htmlFor3Days = "<table><thead><tr><th>Nume</th><th>Nr de inmatriculare</th><th>Telefon</th><th>Data expirarii</th></tr></thead>" + 
                "<tbody>";
    let htmlFor7Days = style + "<h2>Asigurari ce expira in 7 zile</h2>" + htmlFor3Days;

    htmlFor3Days = "<h2>Asigurari ce expira in 3 zile</h2>" + htmlFor3Days;

    expiringIn3Days.forEach(insurance => {
        htmlFor3Days += "<tr><td>" + insurance.insuredName + "</td><td>" + insurance.licensePlate + "</td><td>" + 
                insurance.phoneNumber + "</td><td>" + moment(new Date(insurance.expirationDate)).format('L') + "</td></tr>";
    });

    expiringIn7Days.forEach(insurance => {
        htmlFor7Days += "<tr><td>" + insurance.insuredName + "</td><td>" + insurance.licensePlate + "</td><td>" + 
                insurance.phoneNumber + "</td><td>" + moment(new Date(insurance.expirationDate)).format('L') + "</td></tr>";
    });

    htmlFor3Days += "</tbody></table>";
    htmlFor7Days += "</tbody></table>";

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: SENDER_EMAIL,
          pass: DB_PWD + 'Ax'
        }
      });

    let mailOptions = {
        from: SENDER_EMAIL,
        to: DEST_EMAIL,
        subject: 'Lista asigurarilor ce expira curand',
        html: htmlFor3Days + htmlFor7Days
    };

    let res = '';

    transporter.sendMail(mailOptions, async function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            session = await dbm.initSession();
            let db = await session.getSchema('insurances');
            let statusTable = await db.getTable('status');
            await statusTable.insert(['text']).values(info.response).execute().catch((err) => {
                console.log(err);
            })
        }
    });

    session.close();

    return res;
}