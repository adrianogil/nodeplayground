const launchesModel = require('../../models/launches.model');


function httpGetAllLaunches(req, res) {
    return res.status(200).json(launchesModel.getAllLaunches());
}

function httpPostAddNewLaunch(req, res) {
    const launch = req.body;

    launch.launchDate = new Date(launch.launchDate);

    launchesModel.addNewLaunch(launch);

    return res.status(201).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpPostAddNewLaunch
}