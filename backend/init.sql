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
