var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/isAuth');

const adminController = require('../controller/admin');
const colonyController = require('../controller/colony');

/* GET home page. */
router.get('/', adminController.getLogin);

router.get('/signup', adminController.getSignup);

router.post('/signup', adminController.postSignup);

router.post('/', adminController.postLogin);

router.post('/logout', isAuth, adminController.postLogout);

router.get('/reset', adminController.getReset);

router.post('/reset', adminController.postReset);

router.get('/newPassword/:token', adminController.getNewPassword);

router.post('/newPassword', adminController.postNewPassword);

// colony routs....................
router.get('/colony', isAuth, colonyController.getColony);

router.get('/colonyList', isAuth, colonyController.getColonyList);

router.get('/editColony/:colonyId', isAuth, colonyController.getEditColony);

router.post('/colony', isAuth, colonyController.postColony);

router.post('/updateColony', isAuth, colonyController.updateColony);

router.post('/deleteColony', isAuth, colonyController.deleteColony);

module.exports = router;
