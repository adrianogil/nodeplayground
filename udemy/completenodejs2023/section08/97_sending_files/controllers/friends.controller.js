const friendsModel = require('../models/friends.model');

function getAllFriends(req, res) {
    console.log(`Get all friends - ${friendsModel.friends}`)
    return res.json(friendsModel.friends);
}

function getFriends(req, res) {
    const friendId = req.params.friendId;
    const friend = friendsModel.friends[Number(friendId)];

    if (friend) {
        res.json(friend);
    } else {
        res.status(404).json({
            error: 'Friend does not exist'
        })
    };
}

function postFriends(req, res) {

    if (!req.body.name) {
        return res.status(400).json({
            error: 'Missing friend name'
        })
    }

    const newFriend = {
        name: req.body.name,
        id: friendsModel.friends.length
    };
    friendsModel.friends.push(newFriend);

    res.json(newFriend);
}

module.exports = {
    getFriends,
    postFriends,
    getAllFriends
}
