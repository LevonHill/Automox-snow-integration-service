const axios = require('axios');

exports.importAssets = async (assets) => {

  const promises = assets.map(asset =>
    axios.post(
      `${process.env.SNOW_URL}/api/now/import/u_automox_assets`,
      asset,
      {
        auth: {
          username: process.env.SNOW_USER,
          password: process.env.SNOW_PASSWORD
        }
      }
    )
  );

  await Promise.all(promises);
};