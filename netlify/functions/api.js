import express, { Router } from "express";
import serverless from "serverless-http";

// https://console.cloud.google.com/apis/
// https://programmablesearchengine.google.com/controlpanel/all

const apiKey = process.env.SEARCH_API_KEY;
const searchEngine = process.env.SEARCH_ENGINE_ID;

const api = express();

const router = Router();
router.get("hello", (req, res) => res.send("Hello"))


function findTwoWordPhrases(text) {
    const ignoreWords = ["want","a", "the", "in", "ve", "re", "an", "as", "can", "and", "is", "what", "need", "of", "with", "to", "who", "do", "it", "if", "you", "for", "i", "your", "not", "only", "been", "com", "dc"];
    const words = text.match(/\b\w+\b/g).filter(word => !ignoreWords.includes(word.toLowerCase()) && word.length > 1);
    if (!words || words.length < 2) return [];
    const phrases = [];
    for (let i = 0; i < words.length - 1; i++) {
        const phrase = (words[i] + ' ' + words[i + 1]).toLowerCase(); // Convert to lowercase here
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

function displayPhrases(items) {
    
    // reduce to text blob
    const text = items.map(i => {
        (`${i.title} ${i.snippet}`)
    }).join(' ');

    // Find two-word phrases and count their frequencies
    const phrases = findTwoWordPhrases(text);
    const frequencies = countFrequencies(phrases);

    // Sort phrases by frequency and take the top 30 results
    const sortedPhrases = Object.entries(frequencies).sort((a, b) => b[1] - a[1]).slice(0, 30);
    return sortedPhrases;
}

// title field, snippet field

router.get("/gsearch", async (req, res) => {
    const query = req.query.q;
    const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngine}&q=${query}`
    const response = await fetch(url);
    const json = await response.json();
    const output = displayPhrases(json.items)
    res.send(output);
});

api.use("/api/", router);

export const handler = serverless(api);