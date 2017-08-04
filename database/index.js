const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher', {useMongoClient: true});

let repoSchema = mongoose.Schema({
  _id: Number,
  name: String,
  description: String,
  language: String,
  owner: String,
  userAvatar: String,
  url: String,
  creationDate: Number
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (data) => {
  var repoArray = [];
  if (data.constructor === Object) {
    repoArray.push(data);
  } else if (data.constructor === Array) {
    repoArray = data;
  }

  for (var i = 0; i < repoArray.length; i++) {
    var repo = new Repo({
      _id: repoArray[i].id,
      name: repoArray[i].name,
      description: repoArray[i].description,
      language: repoArray[i].language,
      owner: repoArray[i].owner.login,
      userAvatar: repoArray[i].owner.avatar_url,
      url: repoArray[i].html_url,
      creationDate: new Date(repoArray[i].created_at).getTime()
    });
    repo.save((err, repo) => {
      if (err) {
        // Simply means that one of the repos is already in the database
      }
    });
  }
};

let load = (callback, sortBy, order, limit) => {
  if (order) {
    if (order != 'descending' && order != 'ascending') {
      order = undefined;
    }
  }

  Repo.find()
  .sort([[sortBy || 'creationDate', order || 'descending']])
  .limit(limit || 10)
  .exec((err, repos) => {
    callback(repos);
  });
};

let clear = (callback) => {
  Repo.remove({}, (err) => {
    console.log('Collection removed');
    if (callback) {
      callback();
    }
  });
};

module.exports.save = save;
module.exports.load = load;
module.exports.clear = clear;