const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const bodyParser = require('body-parser');

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