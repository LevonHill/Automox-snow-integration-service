const router = require('express').Router();
const syncController = require('../controllers/syncController');

router.post('/automox-assets', syncController.syncAssets);

module.exports = router;