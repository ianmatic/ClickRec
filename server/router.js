const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // helper to get csrf
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  // preferences page
  app.get('/preferences', mid.requiresSecure, mid.requiresLogin, controllers.Account.prefPage);
  app.get('/getPreferences', mid.requiresSecure,
    mid.requiresLogin, controllers.Account.getPreferences);
  app.put('/changeColors', mid.requiresSecure, mid.requiresLogin, controllers.Account.changeColors);
  app.put('/changeLayout', mid.requiresSecure, mid.requiresLogin, controllers.Account.changeLayout);
  app.put('/changeTypes', mid.requiresSecure, mid.requiresLogin, controllers.Account.changeTypes);

  // settings page
  app.get('/settings', mid.requiresSecure, mid.requiresLogin, controllers.Account.settingsPage);
  app.get('/getCredentials',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Account.getCredentials);
  app.put('/changePassword',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Account.changePassword);
  app.put('/changeUsername',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Account.changeUsername);

  // landing page
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // main page and redirection
  app.get('/getMedia', mid.requiresLogin, controllers.Media.getMedia);
  app.get('/main', mid.requiresLogin, controllers.Media.mainPage);
  app.post('/main', mid.requiresLogin, controllers.Media.addMedia);
  app.delete('/main', mid.requiresLogin, controllers.Media.deleteMedia);
  app.put('/main', mid.requiresLogin, controllers.Media.updateMedia);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.all('*', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
