import cors from "cors";
import express from "express";
import * as sqlite from "sqlite";
import type { Database } from "sqlite";
import sqlite3 from "sqlite3";

import type { Dog } from "common";

export let database: Database;

database = await sqlite.open({
  driver: sqlite3.Database,
  filename: "database.sqlite"
});

await database.run("PRAGMA foreign_keys = ON");

const app = express();

app.use(cors());

app.get("/dogs", async (_request, response) => {
  // let s: Test = "Hello";

  const dogs: Dog[] = await database.all("SELECT * FROM dogs");

  response.send(dogs);
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});
