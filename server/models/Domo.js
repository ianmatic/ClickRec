const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  type: {
    type: String,
    trim: true,
    required: true,
  },

  status: {
    type: String,
    trim: true,
    required: true,
  },

  year: {
    type: Number,
    min: 0,
    required: false,
  },

  image: {
    type: String,
    trim: true,
    required: false,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  type: doc.type,
  status: doc.status,
  year: doc.year,
  image: doc.image,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name type status year image').exec(callback);
};

DomoSchema.statics.delete = (id, callback) => {
  return DomoModel.findByIdAndRemove(id).exec(callback);
};

// find by uniqueId and update with data
DomoSchema.statics.update = (data, callback) => {
  return DomoModel.findByIdAndUpdate(data.uniqueid, data).exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
