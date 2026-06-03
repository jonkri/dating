import cors from "cors";
import express from "express";
import fs from "fs";
import multer from "multer";
import * as sqlite from "sqlite";
import type { Database } from "sqlite";
import sqlite3 from "sqlite3";

import type { Dog, LikeOrDislike } from "common";

const upload = multer({
  dest: "uploads"
});

export let database: Database;

database = await sqlite.open({
  driver: sqlite3.Database,
  filename: "database.sqlite"
});

await database.run("PRAGMA foreign_keys = ON");

const app = express();

app.use(cors());

app.use("/photos", express.static("photos"));

app.post("/upload/:user", upload.single("photo"), async (request, response) => {
  if (!request.file) {
    response.status(400).send({
      error: "No photo file found"
    });
    return;
  }

  if (request.file?.mimetype !== "image/jpeg") {
    response.status(400).send({
      error: "Photo is not a JPEG file"
    });
    return;
  }

  fs.renameSync(request.file.path, `photos/${request.params.user}.jpeg`);

  response.send();
});

app.get("/dogs", async (_request, response) => {
  const dogs: Dog[] = await database.all("SELECT * FROM dogs");

  response.send(dogs);
});

app.get("/candidates/:user", async (request, response) => {
  const candicates: Dog[] = await database.all(
    `
      SELECT
        *
      FROM
        dogs
      WHERE
        id != ?
        AND NOT EXISTS (
          SELECT
            "to"
          FROM
            likes_and_dislikes
          WHERE
            "from" = ?
            AND "to" = dogs.id)
      `,
    [request.params.user, request.params.user]
  );

  response.send(candicates);
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
