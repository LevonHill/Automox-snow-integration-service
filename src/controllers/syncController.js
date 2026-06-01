const automoxService = require('../services/automoxService');
const transformService = require('../services/transformService');
const serviceNowService = require('../services/serviceNowService');

exports.syncAssets = async (req, res) => {
  try {
    const assets = await automoxService.getAssets();

    const transformed =
      transformService.mapAutomoxAssets(assets);

    await serviceNowService.importAssets(transformed);

    res.status(200).json({
      success: true,
      count: transformed.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};