//Automox APIs often paginate. Put that logic in one place.
const axios = require('axios');

async function getAllPages(url, headers) {

  let page = 0;
  let results = [];

  while (true) {

    const response = await axios.get(url, {
      headers,
      params: {
        page
      }
    });

    const data = response.data;

    if (!data.length) {
      break;
    }

    results.push(...data);
    page++;

  }

  return results;
}

module.exports = {
  getAllPages
};

//handle repeated API callsAutomox (and most APIs) don’t return everything at once.

//They do:

//page 0 → 50 records
//page 1 → next 50
//page 2 → next 50

//So instead of repeating this logic in every service:

//page 0
//page 1
//page 2

//you abstract it:

//getAllPages()

//Now any service can just do: const assets = await getAllPages(url, headers);

//Why this matters

//Without utils:

//every API integration re-implements pagination
//bugs get duplicated everywhere

//With utils:
//one correct implementation
//reused everywhere