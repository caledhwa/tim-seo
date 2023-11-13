const apiKey = process.env.SEARCH_API_KEY;
const searchEngine = process.env.SEARCH_ENGINE_ID;

// https://console.cloud.google.com/apis/
// https://programmablesearchengine.google.com/controlpanel/all

async function search(query) {
    let allItems = [];
    let limit = 11;
    let promises = [];
    
    for (let page = 1; page < limit; page++) {
        const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngine}&q=${query}&start=${page}`;
        promises.push(fetch(url));
    }
    
    const responses = await Promise.all(promises);
    for (let response of responses) {
        const json = await response.json();
        if (json.items) {
            allItems = allItems.concat(json.items);
        }
    }
    return allItems;
}

export default search;