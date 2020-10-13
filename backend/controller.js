const dbm = require('./dbmanager');
var validators = require('./validators');

validateInsurance = (request) => {
    if (request.id && validators.validateId(request.id)) {
        console.log("Id validation went wrong!");
        return false;
    }
    if (validators.validateInsuredName(request.insuredName) || 
    validators.validateLicensePlate(request.licensePlate) || 
    validators.validatePhoneNumber(request.phoneNumber) || 
    validators.validateExpirationDate(request.expirationDate)) {
        console.log("Validation went wrong!");
        return false;
    }
    return true;
}

createInsurance = async (req, res, _) => {
    console.log('POST request');
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let insurancesTable = await dbm.getInsurancesTable(db);

    let status = 200;

    if (!validateInsurance(req.body)) {
        status = 400;
        res.status(status).send("Eroare la validarea datelor!");
        return;
    }

    console.log(req.data);
    await insurancesTable.insert(['insuredName', 'licensePlate', 'phoneNumber', 'expirationDate'])
                .values(req.body.insuredName, req.body.licensePlate.toUpperCase(), req.body.phoneNumber, req.body.expirationDate)
                .execute().catch((err)  => {
        console.log(err);
        status = 400;
    });
    session.close();
    if (status == 200) {
        res.send(JSON.stringify('Asigurarea a fost adaugata cu succes!'));
    } else {
        res.status(400).send('A aparut o problema!');
    }
}

editInsurance = async (req, res, _) => {
    console.log('PUT request');
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let insurancesTable = await dbm.getInsurancesTable(db);

    let status = 200;

    if (!validateInsurance(req.body)) {
        status = 400;
        res.status(status).send("Eroare la validarea datelor!");
        return;
    }

    req.body.expirationDate = req.body.expirationDate.substring(0,10);

    console.log(req.body);
    await insurancesTable.update()
                .set('insuredName', req.body.insuredName)
                .set('licensePlate', req.body.licensePlate)
                .set('phoneNumber', req.body.phoneNumber)
                .set('expirationDate', req.body.expirationDate)
                .where("IID = :id").bind('id', req.body.id)
                .execute().catch((err)  => {
                    console.log(err);
                    status = 400;
    });
    session.close();
    if (status == 200) {
        res.send(JSON.stringify('Asigurarea a fost modificata cu succes!'));
    } else {
        res.status(400).send('A aparut o problema!');
    }
}

deleteInsurance = async (req, res, _) => {
    console.log('DELETE request');
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let insurancesTable = await dbm.getInsurancesTable(db);

    let status = 200;

    if (!validators.validateId(req.body)) {
        status = 400;
        res.status(status).send("Eroare la validarea datelor!");
        return;
    }

    await insurancesTable.delete().where("IID = :id")
                .bind('id', req.params.id).execute().catch((err) => {
                    console.log(err);
                    status = 400;
                });

    session.close();
    if (status == 200) {
        res.send(JSON.stringify('Asigurarea a fost stearsa!'));
    } else {
        res.status(400).send('A aparut o problema!');
    }
}

getAllInsurances = async (req, res, _) => {
    console.log('GET request');
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let insurancesTable = await dbm.getInsurancesTable(db);
    let insurances = await insurancesTable.select(['IID', 'insuredName', 'licensePlate', 'phoneNumber', 'expirationDate']).execute();
    insurances = insurances.fetchAll();
    session.close();
    let ans = [];
    insurances.forEach(insurance => {
        let insurance_ = 
            {
                id: insurance[0], 
                insuredName: insurance[1],
                licensePlate: insurance[2],
                phoneNumber: insurance[3],
                expirationDate: insurance[4]
            };
        ans.push(JSON.stringify(insurance_));
    });
    res.send(JSON.stringify(ans));
}

getStatus = async (_, res, __) => {
    console.log("GET request for status");
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let statusTable = await db.getTable('status');

    let status = await statusTable.select(['text']).orderBy("SID DESC").limit(1).execute();
    status = status.fetchOne();
    session.close();
    res.send(JSON.stringify(status[0]));

}

module.exports = {
    createInsurance: createInsurance,
    editInsurance: editInsurance,
    deleteInsurance: deleteInsurance, 
    getAllInsurances: getAllInsurances,
    getStatus: getStatus
}