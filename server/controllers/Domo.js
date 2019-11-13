const models = require('../models');
const Domo = models.Domo;
const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  // missing neccessary parameters
  console.log(req.body);
  if (!req.body.name || !req.body.type || !req.body.status) {
    return res.status(400).json({ error: 'RAWR! Name, Type, and Status are required' });
  }

  const domoData = {
    name: req.body.name,
    type: req.body.type,
    status: req.body.status,
    year: req.body.year,
    image: req.body.image,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);
  console.log(`newDomo:${newDomo}`);

  const domoPromise = newDomo.save();
  domoPromise.then(() => res.json({ redirect: '/maker' }));
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Content already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  return domoPromise;
};

const getDomos = (req, res) => {
  const rq = req;
  const rs = res;

  return Domo.DomoModel.findByOwner(rq.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return rs.status(400).json({ error: 'An error occurred' });
    }
    console.log(`Docs: ${docs}`);

    return rs.json({ domos: docs });
  });
};

const deleteDomo = (req, res) => {
  const rq = req;
  const rs = res;
  return Domo.DomoModel.delete(rq.body.uniqueid, (err, docs) => {
    if (err) {
      console.log(err);
      return rs.status(400).json({ error: 'An error occurred' });
    }

    return rs.json({ domo: docs });
  });
};

const updateDomo = (req, res) => {
  const rq = req;
  const rs = res;
  console.log(`Params: ${rq.params.name}`);
  console.log(`Body: ${rq.body.name}`);
  return Domo.DomoModel.update(rq.body, (err, docs) => {
    if (err) {
      console.log(err);
      return rs.status(400).json({ error: 'An error occurred ' });
    }

    return rs.json({ domo: docs });
  });
};
module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.makeDomo = makeDomo;
module.exports.deleteDomo = deleteDomo;
module.exports.updateDomo = updateDomo;
