const express           = require('express');
const mainController    = require('../controllers/main');
const router            = express.Router();

router.get('/', mainController.getMainPage);

router.get('/secrets', mainController.getSecretPage);

router.get('/register', mainController.getRegisterPage);
router.post('/register', mainController.postRegister);

router.get('/submit', mainController.getSubmitPage);
router.post('/submit', mainController.postSubmitPage);

router.get('/login', mainController.getLoginPage);
router.post('/login', mainController.postLogin);

router.get('/logout', mainController.getLogout);

module.exports = router;