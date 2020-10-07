var express = require('express');
var multer = require('multer');
var url = require('url');
var cors = require('cors');
var validators = require('./validators');

var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
})

var upload = multer({storage: fileStorage})
var app = express();
const bodyParser = require('body-parser');

const fs = require('fs');
const pdf = require('pdf-parse');

const dbm = require('./dbmanager');
const scheduler = require('./scheduler');

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', express.static('../fe'));
  
app.listen(9000, () => {
    scheduler.runScheduler();
    console.log("Server running on port 9000");
});

app.post('/api/parsePdf', upload.single('insurance'), async (req, res, _) => {
    console.log(req.file);
    let ans = await parsePdf(req.file.path);
    res.redirect(url.format({
        pathname: "/",
        data: ans
    }));
});

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

app.post('/api/createInsurance', async (req, res, _) => {
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let insurancesTable = await dbm.getInsurancesTable(db);

    let status = 200;

    if (!validateInsurance(req.body)) {
        status = 400;
        res.status(status).send("Error validating the input!");
    }

    console.log(req.data);
    await insurancesTable.insert(['insuredName', 'licensePlate', 'phoneNumber', 'expirationDate'])
                .values(req.body.insuredName, req.body.licensePlate, req.body.phoneNumber, req.body.expirationDate)
                .execute().catch((err)  => {
        console.log(err);
        status = 400;
    });
    session.close();
    if (status == 200) {
        res.send(JSON.stringify('Insurance added succesfully!'));
    } else {
        res.status(400).send('There was a problem!');
    }
});

app.put('/api/editInsurance', async (req, res, _) => {
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let insurancesTable = await dbm.getInsurancesTable(db);

    let status = 200;

    if (!validateInsurance(req.body)) {
        status = 400;
        res.status(status).send("Error validating the input!");
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
        res.send(JSON.stringify('Insurance edited succesfully!'));
    } else {
        res.status(400).send('There was a problem!');
    }
});

app.delete('/api/deleteInsurance/:id', async (req, res, _) => {
    let session = await dbm.initSession();
    let db = await session.getSchema('insurances');
    let insurancesTable = await dbm.getInsurancesTable(db);

    let status = 200;

    if (!validators.validateId(req.body)) {
        status = 400;
        res.status(status).send("Error validating the id!");
    }

    await insurancesTable.delete().where("IID = :id")
                .bind('id', req.params.id).execute().catch((err) => {
                    console.log(err);
                    status = 400;
                });

    session.close();
    if (status == 200) {
        res.send(JSON.stringify('Insurance deleted succesfully!'));
    } else {
        res.status(400).send('There was a problem!');
    }
});

app.get('/api/insurances', async (req, res, _) => {
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
})

async function parsePdf(file) {
    let dataBuffer = fs.readFileSync(file);
    let ans = Object();

    await pdf(dataBuffer).then((data) => {
        data = data.text;

        // Parsing telephone number
        var phoneIdx = data.indexOf("Tel:");
        var phoneNumber = data.substring(phoneIdx, phoneIdx + 14).split("\n");
        phoneNumber = phoneNumber[1];

        // Parsing owner's name
        var nameIdx = data.indexOf("R1=");
        nameIdx = data.indexOf("R1=", nameIdx + 1);
        var ownerName = data.substring(nameIdx, nameIdx + 100).split("\n");
        ownerName = ownerName[2];

        // Parsing owner's license number
        var licenseIdx = data.indexOf("R1=");
        var licenseNumber = data.substring(licenseIdx - 1, licenseIdx - 15).split("\n");
        licenseNumber = licenseNumber[licenseNumber.length - 1];

        // Parsing expiration date
        var expirationIdx = data.indexOf("servicii suplimentare:");
        var expirationDate = data.substring(expirationIdx, expirationIdx + 101).split("\n");
        expirationDate = expirationDate[6];

        console.log("Phone: " + phoneNumber + " , ownerName: " + ownerName + " , licenseNumber: " + licenseNumber + 
                    ", exp date: " + expirationDate);

        ans = JSON.stringify({name: ownerName, licenseNumber: licenseNumber, phoneNumber: phoneNumber, expDate: expirationDate});
    }).catch((err) => console.log(err));

    console.log(ans);

    return ans;
}