PRAGMA foreign_keys = ON;

CREATE TABLE dogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  birth_date DATE NOT NULL
);

CREATE TABLE likes_and_dislikes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "like" BOOLEAN NOT NULL,
  "from" INTEGER,
  "to" INTEGER,
  FOREIGN KEY("from") REFERENCES dogs(id),
  FOREIGN KEY("to") REFERENCES dogs(id)
);

INSERT INTO dogs ("name", birth_date) VALUES ('Sinta', '2020-01-01');
INSERT INTO dogs ("name", birth_date) VALUES ('Tintin', '2021-01-01');
INSERT INTO dogs ("name", birth_date) VALUES ('Kicki', '2022-01-01');

INSERT INTO likes_and_dislikes ("like", "from", "to") VALUES (TRUE, 1, 2);

CREATE TABLE dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "date" DATE,
  "start" TIME,
  "end" TIME,
  confirmed BOOLEAN DEFAULT FALSE,
  dog_1 INTEGER,
  dog_2 INTEGER,
  FOREIGN KEY("dog_1") REFERENCES dogs(id),
  FOREIGN KEY("dog_2") REFERENCES dogs(id)
);

INSERT INTO dates ("date", "start", "end", dog_1, dog_2) VALUES ('2026-06-03', '10:00', '11:00', 2, 3);

SELECT
  dates.id,
  "date",
  "start",
  "end",
  confirmed,
  d1.id AS dog_1_id,
  d1.name AS dog_1_name,
  d1.birth_date AS dog_1_birth_date,
  d2.id AS dog_2_id,
  d2.name AS dog_2_name,
  d2.birth_date AS dog_2_birth_date
FROM
  dates
  JOIN dogs d1 ON dog_1 = d1.id
  JOIN dogs d2 ON dog_2 = d2.id
WHERE
  d1.id = 2
  OR d2.id = 2;
