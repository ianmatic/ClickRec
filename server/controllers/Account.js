const models = require('../models');
const https = require('https');
const Account = models.Account;

// render login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// destroy current session
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// login the user on server side
const login = (req, res) => {
  const rq = req;
  const rs = res;

  const username = `${rq.body.username}`;
  const password = `${rq.body.pass}`;

  if (!username || !password) {
    return rs.status(400).json({ error: 'All fields are required' });
  }


  // authenticate the user
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return rs.status(401).json({ error: 'Wrong username or password' });
    }

    rq.session.account = Account.AccountModel.toAPI(account);
    console.log(rq.session.account);

    return rs.json({ redirect: '/main' });
  });
};

// signup the user server side
const signup = (req, res) => {
  const rq = req;
  const rs = res;

  // cast to strings to cover up security flaws
  rq.body.username = `${rq.body.username}`;
  rq.body.pass = `${rq.body.pass}`;
  rq.body.pass2 = `${rq.body.pass2}`;

  if (!rq.body.username || !rq.body.pass || !rq.body.pass2) {
    return rs.status(400).json({ error: 'All fields are required' });
  }
  if (rq.body.pass !== rq.body.pass2) {
    return rs.status(400).json({ error: 'Passwords do not match' });
  }

  // captcha
  // check for captcha completion
  if (rq.body['g-recaptcha-response'] === undefined ||
    rq.body['g-recaptcha-response'] === null ||
    rq.body['g-recaptcha-response'] === '') {
    return rs.status(400).json({ error: 'Please complete the reCaptcha' });
  }
  // build verification url
  const secretKey = '6Lc1lsIUAAAAAHVOrR-bYioIyL_NPBpNpL7hQVCs';
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${
    rq.body['g-recaptcha-response']}&remoteip=${rq.connection.remoteAddress}`;

  // check validation
  https.request(verificationUrl, (error, response, bdy) => {
    const body = JSON.parse(bdy);
    // failed to validate
    if (body.success !== undefined && !body.success) {
      return rs.status(400).json({ error: 'Failed to verify the Captcha' });
    }
    return false;
    // validated, no reason to return
  });

  // generate an encrypted password hash
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
      return rs.json({ redirect: '/main' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return rs.status(400).json({ error: 'Username already in use' });
      }

      return rs.status(400).json({ error: 'An error occurred' });
    });
  });
};

// render the settings page
const settingsPage = (req, res) => {
  res.render('settings', { csrfToken: req.csrfToken() });
};

// render the preferences page
const prefPage = (req, res) => {
  res.render('preferences', { csrfToken: req.csrfToken() });
};

// get the csrf token
const getToken = (req, res) => {
  const rq = req;
  const rs = res;

  const csrfJSON = {
    csrfToken: rq.csrfToken(),
  };

  rs.json(csrfJSON);
};

// get username (not password bc you can't decrypt a hash)
const getCredentials = (req, res) => {
  const rq = req;
  const rs = res;
  const credentials = {
    username: rq.session.account.username,
    password: '',
  };
  return rs.json(credentials);
};

// change username
const changeUsername = (req, res) => {
  const rq = req;
  const rs = res;


  // first check if the username is already taken
  return Account.AccountModel.findOne({ username: rq.body.username }).then((result) => {
    if (result !== null) { // username already taken
      return rs.status(400).json({ error: 'Username already in use' });
    }

    const updatePromise = Account.AccountModel.update({ _id: rq.session.account._id },
      { $set: { username: rq.body.username } });
    updatePromise.then(() => {
      // update current
      rq.session.account.username = rq.body.username;
      rs.json({ username: rq.body.username });
    });
    updatePromise.catch((err) => {
      console.log(err);

      return rs.status(400).json({ error: 'An error occurred' });
    });
    return false;
  });
};

// change password
const changePassword = (req, res) => {
  const rq = req;
  const rs = res;

  // generate a new hash and set that as the new password
  return Account.AccountModel.generateHash(rq.body.pass, (salt, hash) => {
    const updatePromise = Account.AccountModel.update({ _id: rq.session.account._id },
      { $set: { password: hash, salt } });
    updatePromise.then(() => {
      rs.json({ username: '/settings' });
    });
    updatePromise.catch((err) => {
      console.log(err);

      return rs.status(400).json({ error: 'An error occurred' });
    });
  });
};

// get preferences
const getPreferences = (req, res) => {
  const rq = req;
  const rs = res;
  const preferences = {
    wishListColor: rq.session.account.wishListColor,
    inProgressColor: rq.session.account.inProgressColor,
    completeColor: rq.session.account.completeColor,
    layout: rq.session.account.layout,
    theme: rq.session.account.theme,
    sizingType: rq.session.account.sizingType,
    sizingValue: rq.session.account.sizingValue,
    types: rq.session.account.types,
  };
  return rs.json(preferences);
};

// change colors
const changeColors = (req, res) => {
  const rq = req;
  const rs = res;

  // update colors
  const updatePromise = Account.AccountModel.update({ _id: rq.session.account._id },
    {
      $set: {
        wishListColor: rq.body.wishList,
        inProgressColor: rq.body.inProgress,
        completeColor: rq.body.complete,
        theme: rq.body.theme,
      },
    });
  updatePromise.then(() => {
    // update current
    rq.session.account.wishListColor = rq.body.wishList;
    rq.session.account.inProgressColor = rq.body.inProgress;
    rq.session.account.completeColor = rq.body.complete;
    rq.session.account.theme = rq.body.theme;
    rs.json({ colors: '/preferences' });
  });
  updatePromise.catch((err) => {
    console.log(err);

    return rs.status(400).json({ error: 'An error occurred' });
  });
};

// change layout
const changeLayout = (req, res) => {
  const rq = req;
  const rs = res;

  // update layout
  const updatePromise = Account.AccountModel.update({ _id: rq.session.account._id },
    {
      $set: {
        layout: rq.body.layout,
        sizingType: rq.body.sizingType,
        sizingValue: `${rq.body.sizingValue}px`,
      },
    });
  updatePromise.then(() => {
    // update current
    rq.session.account.layout = rq.body.layout;
    rq.session.account.sizingType = rq.body.sizingType;
    rq.session.account.sizingValue = `${rq.body.sizingValue}px`;
    rs.json({ layout: '/preferences' });
  });
  updatePromise.catch((err) => {
    console.log(err);
    return rs.status(400).json({ error: 'An error occurred' });
  });
};

// change types
const changeTypes = (req, res) => {
  console.log('changing types...');
  const rq = req;
  const rs = res;

  const newData = JSON.parse(rq.body.data);
  // update types
  const updatePromise = Account.AccountModel.update({ _id: rq.session.account._id },
    {
      $set: {
        types: newData,
      },
    });
  updatePromise.then(() => {
    // update current
    rq.session.account.types = newData;
    rs.json({ types: '/preferences' });
  });
  updatePromise.catch((err) => {
    console.log(err);
    return rs.status(400).json({ error: 'An error occurred' });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.settingsPage = settingsPage;
module.exports.prefPage = prefPage;
module.exports.getToken = getToken;
module.exports.getCredentials = getCredentials;
module.exports.changePassword = changePassword;
module.exports.changeUsername = changeUsername;
module.exports.changeColors = changeColors;
module.exports.changeLayout = changeLayout;
module.exports.changeTypes = changeTypes;
module.exports.getPreferences = getPreferences;
