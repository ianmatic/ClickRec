const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};

// encryption
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;


// Schema
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  wishListColor: {
    type: String,
    default: '#5C946F',
  },
  inProgressColor: {
    type: String,
    default: '#f79257',
  },
  completeColor: {
    type: String,
    default: '#AED9F4',
  },
  layout: {
    type: String,
    default: 'table',
  },
  sizingType: {
    type: String,
    default: 'auto',
  },
  sizingValue: {
    type: String,
    default: '300px',
  },
  theme: {
    type: String,
    default: 'light',
  },
  types: {
    type: Array,
    default: ['Film', 'TV', 'Game', 'Literature', 'Music'],
  },
});


// each account returns an id and username, and preferences
AccountSchema.statics.toAPI = doc => ({
  // _id is built into mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
  wishListColor: doc.wishListColor,
  inProgressColor: doc.inProgressColor,
  completeColor: doc.completeColor,
  layout: doc.layout,
  sizingType: doc.sizingType,
  sizingValue: doc.sizingValue,
  types: doc.types,
  theme: doc.theme,
});

// check if password is valid
const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  // encrypt the attempted password and check if that equals the already encrypted password
  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

// helper function to find by username
AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

// generate crypto hash for password encryption
AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) =>
    callback(salt, hash.toString('hex'))
  );
};

// checks username/password for login
AccountSchema.statics.authenticate = (username, password, callback) =>
AccountModel.findByUsername(username, (err, doc) => {
  if (err) {
    return callback(err);
  }

  if (!doc) {
    return callback();
  }

  return validatePassword(doc, password, (result) => {
    if (result === true) {
      return callback(null, doc);
    }

    return callback();
  });
});

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
