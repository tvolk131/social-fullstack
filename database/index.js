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
// addType is a string containing either 'create' or 'accept'
module.exports.addFriend = (frienderUserId, friendeeUserId, addType) => {
    if (frienderUserId && friendeeUserId && frienderUserId != friendeeUserId && (addType == 'create' || addType === 'accept')) {
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
            if (data.length === 0 && addType === 'create') {
                return models.friends.create({
                    friender_id: frienderUserId,
                    friendee_id: friendeeUserId,
                    friender_accepted: true,
                    friendee_accepted: false
                });
            } else if (data.length === 1 && addType === 'accept') {
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
        });
    }
};

// Wipes any friend relationship between two users
// by removing either a friend request OR a friendship
module.exports.removeFriend = (frienderUserId, friendeeUserId) => {
    return models.friends.destroy({
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
                if (friendLinks[i].friender_accepted && friendLinks[i].friendee_accepted) {
                    friends.push(friendLinks[i]);
                } else if (friendLinks[i].friendee_id === userId) {
                    friendRequestsReceived.push(friendLinks[i]);
                } else if (friendLinks[i].friender_id === userId) {
                    friendRequestsSent.push(friendLinks[i]);
                } else {
                    console.error('Oh no! There was an error getting friend data!')
                }
            }
        }
        return {friends, friendRequestsSent, friendRequestsReceived};
    }).then((friendDataOld) => {
        var friendData = JSON.parse(JSON.stringify(friendDataOld));

        var getUserPromises = [];
        friendData.friends.forEach((friend) => {
            delete friend.friender_accepted;
            delete friend.friendee_accepted;
            getUserPromises.push(
                models.users.findOne({
                    where: {
                        id: userId === friend.friender_id ? friend.friendee_id : friend.friender_id
                    }
                }).then((user) => {
                    friend.friend = user;
                })
            );
        });
        friendData.friendRequestsSent.forEach((friendRequest) => {
            delete friendRequest.friender_accepted;
            delete friendRequest.friendee_accepted;
            getUserPromises.push(
                models.users.findOne({
                    where: {
                        id: friendRequest.friendee_id
                    }
                }).then((user) => {
                    friendRequest.friend = user;
                })
            );
        });
        friendData.friendRequestsReceived.forEach((friendRequest) => {
            delete friendRequest.friender_accepted;
            delete friendRequest.friendee_accepted;
            getUserPromises.push(
                models.users.findOne({
                    where: {
                        id: friendRequest.friender_id
                    }
                }).then((user) => {
                    friendRequest.friend = user;
                })
            );
        });
        return Promise.all(getUserPromises).then(() => {
            console.log('DONE!!!');
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