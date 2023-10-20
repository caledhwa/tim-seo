import express, { Router } from "express";
import serverless from "serverless-http";

// https://console.cloud.google.com/apis/
// https://programmablesearchengine.google.com/controlpanel/all

const apiKey = process.env.SEARCH_API_KEY;
const searchEngine = process.env.SEARCH_ENGINE_ID;

const api = express();

const router = Router();
router.get("hello", (req, res) => res.send("Hello"))
router.get("/gsearch", async (req, res) => {
    const query = req.query.q;
    const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngine}&q=${query}`
    const response = await fetch(url);
    const json = await response.json();
    res.send(json);
});

api.use("/api/", router);

export const handler = serverless(api);