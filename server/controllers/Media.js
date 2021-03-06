const models = require('../models');
const Media = models.Media;

//
const mainPage = (req, res) => {
  Media.MediaModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), media: docs });
  });
};

// add a new media to the table
const addMedia = (req, res) => {
  // use placeholder (empty) image if none is provided
  const imageURL = req.body.image === '' ? '/assets/img/default.png' : req.body.image;

  // build the neccessary data
  const mediaData = {
    name: req.body.name,
    type: req.body.type,
    status: req.body.status,
    notes: req.body.notes,
    image: imageURL,
    owner: req.session.account._id,
  };

  const newMedia = new Media.MediaModel(mediaData);

  const mediaPromise = newMedia.save();
  mediaPromise.then(() => res.json({ redirect: '/main' }));
  mediaPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Media already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  return mediaPromise;
};

// get a media by the owner session account id
const getMedia = (req, res) => {
  const rq = req;
  const rs = res;

  return Media.MediaModel.findByOwner(rq.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return rs.status(400).json({ error: 'An error occurred' });
    }

    return rs.json({ media: docs });
  });
};

// remove a media element from the account
const deleteMedia = (req, res) => {
  const rq = req;
  const rs = res;

  // remove by unique id
  return Media.MediaModel.delete(rq.body.uniqueid, (err, docs) => {
    if (err) {
      console.log(err);
      return rs.status(400).json({ error: 'An error occurred' });
    }

    return rs.json({ media: docs });
  });
};

// change the contents of a media item
const updateMedia = (req, res) => {
  const rq = req;
  const rs = res;
  return Media.MediaModel.update(rq.body, (err, docs) => {
    if (err) {
      console.log(err);
      return rs.status(400).json({ error: 'An error occurred ' });
    }

    return rs.json({ media: docs });
  });
};
module.exports.mainPage = mainPage;
module.exports.getMedia = getMedia;
module.exports.addMedia = addMedia;
module.exports.deleteMedia = deleteMedia;
module.exports.updateMedia = updateMedia;
