import ignoreWords from "./ignoreWords.mjs";

function processSearchItems(items) {
    return items.map(i => (`${i.title} ${i.snippet}`)).join(' ');
}

function processSearchBlob(text) {

    const factors = [2, 3, 4];
    let results = {};

    for (let factor of factors) {
        const phrases = findPhrases(text, factor);
        const frequencies = countFrequencies(phrases);
        const sortedPhrases = Object.entries(frequencies).sort((a, b) => b[1] - a[1]).slice(0, 30);

        results[`factor${factor}`] = sortedPhrases.map(([phrase, frequency]) => ({phrase, frequency}));
    }
    return results;
}

function findPhrases(text, factor) {
    const words = text.match(/\b\w+\b/g).filter(word => !ignoreWords.includes(word.toLowerCase()) && word.length > 1);
    if (!words || words.length < factor) return [];
    const phrases = [];
    for (let i = 0; i < words.length - factor; i++) {
        const phrase = words.slice(i, i + factor).join(' ').toLowerCase();
        if (!/\d/.test(phrase)) { // Check for numbers in the phrase
            phrases.push(phrase);
        }
    }
    return phrases;
}

function countFrequencies(phrases) {
    const frequencies = {};
    for (const phrase of phrases) {
        frequencies[phrase] = (frequencies[phrase] || 0) + 1;
    }
    return frequencies;
}

export {
    processSearchItems,
    processSearchBlob
}