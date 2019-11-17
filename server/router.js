const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
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
  app.get('/getMedia', mid.requiresLogin, controllers.Media.getMedia);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/main', mid.requiresLogin, controllers.Media.mainPage);
  app.post('/main', mid.requiresLogin, controllers.Media.addMedia);
  app.delete('/main', mid.requiresLogin, controllers.Media.deleteMedia);
  app.put('/main', mid.requiresLogin, controllers.Media.updateMedia);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/settings', mid.requiresSecure, mid.requiresLogin, controllers.Account.settingsPage);
  app.all('*', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
