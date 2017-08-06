var models = require('./models/index.js');
var Sequelize = require('sequelize');

module.exports.getMessages = (senderId, recipientId) => {
    return models.messages.findAll({
        where: {
            $or: [
                {
                    sender_id: senderId,
                    recipient_id: recipientId
                },
                {
                    sender_id: recipientId,
                    recipient_id: senderId
                }
            ]
        }
    });
};

module.exports.getUser = (userInfoObj) => {
    return models.users.findOne({
        where: userInfoObj
    });
};

module.exports.addMessage = (senderId, recipientId, text) => {
    return models.messages.create({sender_id: senderId, recipient_id: recipientId, text: text});
};

// Adds a user-to-user friend relationship, automatically
// disallowing duplicate duplicate entries
module.exports.addFriend = (frienderUserId, friendeeUserId) => {
    if (frienderUserId != friendeeUserId) {
        return models.friends.findAll({
            where: {
                $or: [
                    {
                        friender_id: frienderUserId,
                        friendee_id: friendeeUserId
                    },
                    {
                        friender_id: friendeeUserId,
                        friendee_id: frienderUserId
                    }
                ]
            }
        }).then((data) => {
            if (data.length === 0) {
                return models.friends.create({
                    friender_id: frienderUserId,
                    friendee_id: friendeeUserId,
                    friender_accepted: true,
                    friendee_accepted: false
                });
            } else if (data.length === 1) {
                var friendeeHasAccepted = data[0].dataValues.friendee_accepted;
                if (!friendeeHasAccepted) {
                    models.friends.update({
                        friender_accepted: true,
                        friendee_accepted: true
                    }, {
                        where: {
                            $or: [
                                {
                                    friender_id: frienderUserId,
                                    friendee_id: friendeeUserId
                                },
                                {
                                    friender_id: friendeeUserId,
                                    friendee_id: frienderUserId
                                }
                            ]
                        }
                    });
                }
            }
            console.log(data);
        });
    }
};

// Returns a promise containing an object that has data about friends and open friend requests
// -------------------------------------------------------------------------------------------
// This is done all in one method because all friend data is searched through anyway, so if
// more than one data set is needed then only one search is performed
module.exports.getFriendData = (userId) => {
    return models.friends.findAll({
        where: {
            $or: [
                {
                    friender_id: userId
                },
                {
                    friendee_id: userId
                }
            ]
        }
    }).then((data) => {
        var friendLinks = [];
        for (var i = 0; i < data.length; i++) {
            friendLinks.push(data[i].dataValues);
        }
        return friendLinks;
    }).then((friendLinks) => {
        var friends = [];
        var friendRequestsSent = [];
        var friendRequestsReceived = [];
        for (var i = 0; i < friendLinks.length; i++) {
            if (friendLinks[i].friender_accepted || friendLinks[i].friendee_accepted) {
                if (!friendLinks[i].friender_accepted) {
                    friendRequestsReceived.push(friendLinks[i]);
                } else if (!friendLinks[i].friendee_accepted) {
                    friendRequestsSent.push(friendLinks[i]);
                } else {
                    friends.push(friendLinks[i]);
                }
            }
        }
        return {friends, friendRequestsSent, friendRequestsReceived};
    }).then((friendDataOld) => {
        var friendData = JSON.parse(JSON.stringify(friendDataOld));

        var getUserPromises = [];
        for (var i = 0; i < friendData.friends.length; i++) {
            delete friendData.friends[i].friender_accepted;
            delete friendData.friends[i].friendee_accepted;
            getUserPromises.push(
                models.users.findOne({
                    where: {
                        id: userId === friendData.friends[i].friender_id ? friendData.friends[i].friendee_id : friendData.friends[i].friender_id
                    }
                }).then((user) => {
                    friendData.friends[i].friend = user;
                })
            );
        }
        for (var i = 0; i < friendData.friendRequestsSent.length; i++) {
            delete friendData.friendRequestsSent[i].friender_accepted;
            delete friendData.friendRequestsSent[i].friendee_accepted;
            getUserPromises.push(
                models.users.findOne({
                    where: {
                        id: userId === friendData.friendRequestsSent[i].friender_id ? friendData.friendRequestsSent[i].friendee_id : friendData.friendRequestsSent[i].friender_id
                    }
                }).then((user) => {
                    friendData.friendRequestsSent[i].friend = user;
                })
            );
        }
        for (var i = 0; i < friendData.friendRequestsReceived.length; i++) {
            delete friendData.friendRequestsReceived[i].friender_accepted;
            delete friendData.friendRequestsReceived[i].friendee_accepted;
            getUserPromises.push(
                models.users.findOne({
                    where: {
                        id: userId === friendData.friendRequestsReceived[i].friender_id ? friendData.friendRequestsReceived[i].friendee_id : friendData.friendRequestsReceived[i].friender_id
                    }
                }).then((user) => {
                    friendData.friendRequestsReceived[i].friend = user;
                })
            );
        }
        return Promise.all(getUserPromises).then(() => {
            return friendData;
        });
    });
};

module.exports.createPost = (userId, text) => {
    return models.posts.create({
        user_id: userId,
        text: text
    });
};

// Gets all posts by the provided user ID
module.exports.getPostsBy = (userId) => {
    return models.posts.findAll({
        where: {
            user_id: userId
        }
    });
};

module.exports.addComment = (userId, postId, text) => {
    return models.comments.create({
        user_id: userId,
        post_id: postId,
        text: text
    });
};

// Gets all comments on a particular post
module.exports.getComments = (postId) => {
    return models.comments.findAll({
        where: {
            post_id: postId
        }
    });
};