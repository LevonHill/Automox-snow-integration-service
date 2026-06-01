//only talks to automox api, 

const axios = require('axios');

exports.getAssets = async () => {

  const response = await axios.get(
    `${process.env.AUTOMOX_URL}/servers`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTOMOX_API_KEY}`
      }
    }
  );

  return response.data;
};