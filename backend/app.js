const express = require('express');
const multer = require('multer');
const url = require('url');
const cors = require('cors');
const routes = require('./routes');

var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
})

var upload = multer({storage: fileStorage})
const app = express();
const bodyParser = require('body-parser');

const fs = require('fs');
const pdf = require('pdf-parse');

const scheduler = require('./scheduler');

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', express.static('../fe'));
app.use('/', routes);

const {SERVER_PORT} = require('./config');

app.listen(SERVER_PORT, () => {
    scheduler.runScheduler();
    console.log("Server running on port %s", SERVER_PORT);
});

app.post('/api/parsePdf', upload.single('insurance'), async (req, res, _) => {
    console.log(req.file);
    let ans = await parsePdf(req.file.path);
    res.redirect(url.format({
        pathname: "/",
        data: ans
    }));
});

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