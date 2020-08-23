'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3003;

const admin = require('./enrollAdmin.js');
const user = require('./registerUser.js');
const query = require('./query.js');

async function init() {
    app.use(cors());
    app.use(express.json());

    await connect();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/all', (req, res) => allRoute(req, res));

    app.get('/view', (req, res) => viewReportRoute(req, res));

    app.post('/add', (req, res) => addReportRoute(req, res));

    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
}

async function connect() {
    await admin.enroll();
    await user.register();
}

async function allRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.showAll();
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on allRoute: ${error}`);
    }
}

async function viewReportRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.viewReport(req.query.d_name, req.query.disease);
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on viewReportRoute: ${error}`);
    }
}

async function addReportRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.addReport(req.body.d_name, req.body.disease,req.body.medicine, req.body.newowner);
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on addReportRoute: ${error}`);
    }
}

init();
