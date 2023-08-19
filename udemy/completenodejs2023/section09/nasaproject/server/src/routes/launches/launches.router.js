const express = require('express')
const { httpGetAllLaunches, httpPostAddNewLaunch } = require('./launches.controller')

const launchesRouter = express.Router();
launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpPostAddNewLaunch)

module.exports = launchesRouter;

