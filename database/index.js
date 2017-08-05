var models = require('./models/index.js');
var Sequelize = require('sequelize');

module.exports.getMessages = (senderUsername, recipientUsername) => {
    var senderId;
    var receiverId;

    return getUserId(senderUsername).then((userId) => {
        senderId = userId;
        return getUserId(recipientUsername);
    }).then((userId) => {
        receiverId = userId;
        return {senderId, receiverId};
    }).then((userIds) => {
        return models.messages.findAll({
            where: {
                $or: [
                    {
                        sender_id: userIds.senderId,
                        recipient_id: userIds.receiverId
                    },
                    {
                        sender_id: userIds.receiverId,
                        recipient_id: userIds.senderId
                    }
                ]
            }
        });
    });
};

getUserId = (username) => {
    return models.users.findOne({
        where: {
            email: username
        }
    }).then((user) => {
        return user.id;
    });
};

module.exports.addMessage = (senderUsername, recipientUsername, text) => {
    var senderId;
    var receiverId;

    return getUserId(senderUsername).then((userId) => {
        senderId = userId;
        return getUserId(recipientUsername);
    }).then((userId) => {
        receiverId = userId;
        return {senderId, receiverId};
    }).then((userIds) => {
        return models.messages.create({
            text: text,
            sender_id: userIds.senderId,
            recipient_id: userIds.receiverId
        });
    });
};