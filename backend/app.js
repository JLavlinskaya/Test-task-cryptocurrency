import express from "express";
import fetch from "node-fetch";
import mongoose from "mongoose";
import cors from "cors";

import {DB_ADRESS, PORT} from "./consts.js";

const app = express();

mongoose.connect(DB_ADRESS);
mongoose.Promise = global.Promise;

const schema = new mongoose.Schema({
  _id: String,
  value: String,
});

const Money = mongoose.model("Money", schema);

mongoose.set("useFindAndModify", false);

app.use(cors());

app.get("/", function (req, res) {
  res.send("It's API");
});

app.get("/loaddata", async function (req, res) {
  let response = null;

  try {
    response = await fetch("https://api.coingecko.com/api/v3/global");
    response = await response.json();
  } catch (err) {
    res
      .status(500)
      .json({
        result: "error",
        details: "Can't fetch data from remote server",
      });
    return;
  }
  let btcValue = response.data.market_cap_percentage;

  const bulk = Money.collection.initializeOrderedBulkOp();

  Object.entries(btcValue).map(([key, value]) => {
    bulk
      .find({ _id: key })
      .upsert()
      .update({ $set: { value: value } });
  });
  bulk.execute(function (err) {
    if (err == null) {
      res.json({ result: "ok" });
    } else {
      res.json({ result: "err", details: err });
    }
  });
});

app.get("/showdata", function (req, res) {
  Money.find().exec(function (err, moneys) {
    if (err) {
      res.status(500).json({ result: "err", details: err });
    } else {
      res.json(moneys);
    }
  });
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}...`);
});
