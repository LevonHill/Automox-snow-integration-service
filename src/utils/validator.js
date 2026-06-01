//“clean + protect your data” This is your safety layer.

function validateAsset(asset) {

  if (!asset.name) {
    return false;
  }

  return true;
}

module.exports = {
  validateAsset
};

//later would be used in syncService.js like this:
// assets.filter(validateAsset);

//“clean + protect your data” This is your safety layer.

//Automox data is not always perfect.

//You might get:

//{
//  "name": null,
//  "ip": "",
//  "os": undefined
//}

//Without validation:

//you push bad data into ServiceNow
//your CMDB gets messy
//transforms fail
//duplicates appear

//assets.filter(validateAsset);