//converts automox fields into servicenow feilds , This file becomes your "Transform Map before the Transform Map."

exports.mapAutomoxAssets = (assets) => {

  return assets.map(asset => ({
    hostname: asset.name,
    ip_address: asset.ip_addrs?.[0],
    os_name: asset.os_name,
    serial_number: asset.serial_number,
    last_seen: asset.last_refresh_time
  }));

};
