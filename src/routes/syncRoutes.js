const router = require('express').Router();
const syncController = require('../controllers/syncController');

router.post('/automox-assets', syncController.syncAssets);

//test api route via get request
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;