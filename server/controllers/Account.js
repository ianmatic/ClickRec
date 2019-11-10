const models = require('../models');
const Account = models.Account;
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const rq = req;
  const rs = res;

  const username = `${rq.body.username}`;
  const password = `${rq.body.pass}`;

  if (!username || !password) {
    return rs.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return rs.status(401).json({ error: 'Wrong username or password' });
    }

    rq.session.account = Account.AccountModel.toAPI(account);

    return rs.json({ redirect: '/maker' });
  });
};

const signup = (req, res) => {
  const rq = req;
  const rs = res;

    // cast to strings to cover up security flaws
  rq.body.username = `${rq.body.username}`;
  rq.body.pass = `${rq.body.pass}`;
  rq.body.pass2 = `${rq.body.pass2}`;

  if (!rq.body.username || !rq.body.pass || !rq.body.pass2) {
    return rs.status(400).json({ error: 'RAWR! All fields are required' });
  }
  if (rq.body.pass !== rq.body.pass2) {
    return rs.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(rq.body.pass, (salt, hash) => {
    const accountData = {
      username: rq.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      rq.session.account = Account.AccountModel.toAPI(newAccount);
      return rs.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return rs.status(400).json({ error: 'Username already in use.' });
      }

      return rs.status(400).json({ error: 'An error occurred' });
    });
  });
};
const getToken = (req, res) => {
  const rq = req;
  const rs = res;

  const csrfJSON = {
    csrfToken: rq.csrfToken(),
  };

  rs.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
