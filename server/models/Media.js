const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let MediaModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();


// Schema
const MediaSchema = new mongoose.Schema({
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

  notes: {
    type: String,
    trim: false,
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

// each media item contains a name, type, status, notes and image
MediaSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  type: doc.type,
  status: doc.status,
  notes: doc.notes,
  image: doc.image,
});

// find the media by its properties
MediaSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return MediaModel.find(search).select('name type status notes image').exec(callback);
};

// delete media by uniqueid
MediaSchema.statics.delete = (id, callback) => MediaModel.findByIdAndRemove(id).exec(callback);

// find by uniqueId and update with data
// d == data, c == callback, thank eslint 100 char limit for crappy names
MediaSchema.statics.update = (d, c) => MediaModel.findByIdAndUpdate(d.uniqueid, d).exec(c);

MediaModel = mongoose.model('Media', MediaSchema);

module.exports.MediaModel = MediaModel;
module.exports.MediaSchema = MediaSchema;
