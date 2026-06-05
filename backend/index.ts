import cors from "cors";
import express from "express";
import fs from "fs";
import multer from "multer";
import dotenv from "dotenv";
import { Client } from "pg";

import type { Dog, LikeOrDislike } from "common";

const upload = multer({
  dest: "uploads"
});

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI
});

client.connect();

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
  response.send((await client.query<Dog[]>("SELECT * FROM dogs")).rows);
});

app.get("/candidates/:user", async (request, response) => {
  response.send(
    (
      await client.query<Dog[]>(
        `
          SELECT
            *
          FROM
            dogs
          WHERE
            id != $1
            AND NOT EXISTS (
              SELECT
                "to"
              FROM
                likes_and_dislikes
              WHERE
                "from" = $1
                AND "to" = dogs.id)
      `,
        [request.params.user]
      )
    ).rows
  );
});

app.post("/:verb/:from/:to", async (request, response) => {
  const { from, verb, to } = request.params;

  if (verb !== "like" && verb !== "dislike") {
    response.status(400).send();
    return;
  }

  console.debug(`${from} ${verb === "like" ? "" : "o"}gillar ${to}`);

  await client.query(
    'INSERT INTO likes_and_dislikes ("like", "from", "to") VALUES ($1, $2, $3)',
    [verb === "like", from, to]
  );

  response.send();
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});
