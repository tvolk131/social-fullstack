// 'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '../../config/config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ------- //
// SCHEMAS //
// ------- //

// USERS SCHEMA
var Users = sequelize.define('users', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    firstname: {
        type: Sequelize.STRING,
        notEmpty: true
    },
    lastname: {
        type: Sequelize.STRING,
        notEmpty: true
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
db.users = Users;

// MESSAGES SCHEMA
var Messages = sequelize.define('messages', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
Messages.belongsTo(Users, {
    foreignKey: 'sender_id'
});
Messages.belongsTo(Users, {
    foreignKey: 'recipient_id'
});
db.messages = Messages;

// POSTS SCHEMA
var Posts = sequelize.define('posts', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
Posts.belongsTo(Users, {
    foreignKey: 'user_id'
});
db.posts = Posts;





module.exports = db;