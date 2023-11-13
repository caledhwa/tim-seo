import express from "express";
import serverless from "serverless-http";
import {processSearchItems, processSearchBlob } from "./utilities/processSearchItems.mjs";
import search from "./utilities/search.mjs";

const api = express();
const router = express.Router();

router.get("/gsearch", async (req, res) => {
    const query = req.query.q;
    const items = await search(query);
    const blob = processSearchItems(items);
    const output = processSearchBlob(blob);
    res.set("Access-Control-Allow-Origin", "*");
    res.send(output);
});

api.use("/api/", router);
export const handler = serverless(api);