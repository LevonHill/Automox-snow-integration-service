Node.js + Express is enough.

You don't need MongoDB because ServiceNow is effectively your data store.

You don't need React because ServiceNow already provides the UI, reporting, lists, forms, dashboards, etc.

Your architecture could be as simple as:

Automox API
    ↓
Node/Express Service
    ↓
ServiceNow Import Set API
    ↓
Import Set Table
    ↓
Transform Map
    ↓
Target Table

The libraries I'd use
npm install express axios node-cron dotenv

Possibly:
npm install winston

for logging.

That's really it.



//features


I'd build:

automox-servicenow-sync

Features:

Scheduled sync every 4 hours
Automox pagination handling
Import Set API integration
Logging
Error notifications
Delta updates
Asset reconciliation
Dry-run mode

//
Example flow
Pull assets from Automox
const response = await axios.get(
  'https://console.automox.com/api/servers',
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

//transform the data

const payload = response.data.map(device => ({
  hostname: device.name,
  ip_address: device.ip_addrs?.[0],
  os_name: device.os_name,
  last_seen: device.last_refresh_time
}));



//send to servicenow import set

await axios.post(
  `${snowUrl}/api/now/import/u_automox_assets`,
  payload,
  {
    auth: {
      username,
      password
    }
  }
);

A basic project structure might look like:
src/
├── routes/
│   └── sync.js
├── services/
│   ├── automox.js
│   └── servicenow.js
├── jobs/
│   └── assetSync.js
├── config/
│   └── config.js
└── app.js