//Handles automated execution.

const cron = require('node-cron');
const syncController =
  require('../controllers/syncController');

cron.schedule('0 */4 * * *', async () => {

  console.log('Running Automox sync');

  await syncController.syncAssets(
    {},
    {
      status: () => ({
        json: console.log
      })
    }
  );

});