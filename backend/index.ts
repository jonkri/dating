import cors from "cors";
import express from "express";
import * as sqlite from "sqlite";
import type { Database } from "sqlite";
import sqlite3 from "sqlite3";

import type { Dog, LikeOrDislike } from "common";

export let database: Database;

database = await sqlite.open({
  driver: sqlite3.Database,
  filename: "database.sqlite"
});

await database.run("PRAGMA foreign_keys = ON");

const app = express();

app.use(cors());

app.get("/dogs", async (_request, response) => {
  const dogs: Dog[] = await database.all("SELECT * FROM dogs");

  response.send(dogs);
});

app.get("/candidates/:user", async (request, response) => {
  // Prepared statements - undvik SQL injections!
  const allDogsExceptUser: Dog[] = await database.all(
    "SELECT * FROM dogs WHERE id != ?",
    [request.params.user]
  );

  const allUserLikesAndDislikes: LikeOrDislike[] = await database.all(
    'SELECT "to" FROM likes_and_dislikes WHERE "from" = ?',
    [request.params.user]
  );

  const idsNotToBeConsidered = allUserLikesAndDislikes.map((value) => value.to);

  const filteredDogs = allDogsExceptUser.filter(
    (value) => idsNotToBeConsidered.indexOf(value.id) === -1
  );

  response.send(filteredDogs);
});

app.post("/:verb/:from/:to", async (request, response) => {
  const { from, verb, to } = request.params;

  if (verb !== "like" && verb !== "dislike") {
    response.status(400).send();
    return;
  }

  console.debug(`${from} ${verb === "like" ? "" : "o"}gillar ${to}`);

  await database.run(
    'INSERT INTO likes_and_dislikes ("like", "from", "to") VALUES (?, ?, ?)',
    [verb === "like", from, to]
  );

  response.send();
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});
