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
    }).catch((err) => {
        return {senderId: -1, receiverId: -1};
    }).then((userIds) => {
        if (userIds.senderId === -1 || userIds.receiverId === -1) {
            return [];
        } else {
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
        }
    }).then((messageArray) => {
        var newMessageArray = JSON.parse(JSON.stringify(messageArray));
        for (var i = 0; i < newMessageArray.length; i++) {
            if (newMessageArray[i].sender_id === senderId) {
                newMessageArray[i].sender = senderUsername;
                newMessageArray[i].recipient = recipientUsername;
            } else if (newMessageArray[i].sender_id === receiverId) {
                newMessageArray[i].sender = recipientUsername;
                newMessageArray[i].recipient = senderUsername;
            } else {
                throw 'ERROR!!!';
            }
        }
        return newMessageArray;
    });
};

getUserId = (username) => {
    return models.users.findOne({
        where: {
            email: username
        }
    }).then((user) => {
        return user.id;
    }).catch((err) => {
        return -1;
    });
};
getUser = (userId) => {
    return models.users.findOne({
        where: {
            id: userId
        }
    });
};

module.exports.saveMessage = (senderUsername, recipientUsername, text) => {
    var senderId;
    var receiverId;

    return getUserId(senderUsername).then((userId) => {
        senderId = userId;
        return getUserId(recipientUsername);
    }).then((userId) => {
        receiverId = userId;
        return {sender_id: senderId, recipient_id: receiverId, text: text};
    }).then((messageData) => {
        return models.messages.create(messageData);
    }).then((message) => {
        var newMessage = JSON.parse(JSON.stringify(message))
        newMessage.sender = senderUsername;
        newMessage.recipient = recipientUsername;
        return newMessage;
    }).catch((err) => {
        //Do nothing
    });
};

// Adds a user-to-user friend relationship, automatically
// disallowing duplicate duplicate entries
// ------------------------------------------------------
// Node: This user-to-user relationship is one-way
// A friendship is only formed when both users are
// friended to each other, otherwise it is considered
// a one-way request
//
// IE. a friendship is essentially a two-way friend request
module.exports.addFriend = (frienderUserId, friendeeUserId) => {
    if (frienderUserId != friendeeUserId) {
        models.friends.findAll({
            where: {
                friender_id: frienderUserId,
                friendee_id: friendeeUserId
            }
        }).then((data) => {
            return data.length === 0;
        }).then((isUnique) => {
            if (isUnique) {
                return models.friends.create({friender_id: frienderUserId, friendee_id: friendeeUserId});
            }
        });
    }
};

// Returns a promise containing an object that has data about friends and open friend requests
// -------------------------------------------------------------------------------------------
// This is done all in one method because all friend data is searched through anyway, so if
// more than one data set is needed then only one search is performed
module.exports.getFriendData = (username) => {
};

module.exports.createPost = (username, text) => {
};

// Gets all posts by the provided user's friends
module.exports.getPosts = (username) => {

};

// Gets all comments on a particular post
module.exports.addComment = (username, commentId) => {
};