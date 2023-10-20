import express, { Router } from "express";
import serverless from "serverless-http";

const apiKey = "AIzaSyCKH-2ww3Jo7vfBQBTB_TYlGqEgwMdlYok";
const searchEngine = "45c251cb35f0e4e74";

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));
router.get("/gsearch", async (req, res) => {
    const query = req.query.q;
    const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngine}&q=${query}`
    const response = await fetch(url);
    const json = await response.json();
    res.send(json);
});

api.use("/api/", router);

export const handler = serverless(api);