import type { Dog } from "common";
import { useEffect, useState } from "react";

const user = 2;

function App() {
  const [candidates, setCandidates] = useState<Dog[] | null>(null);

  console.log("Test (Utanför useMemo)");

  function getCandidates() {
    fetch(`http://localhost:3000/candidates/${user}`)
      .then((response) => response.json())
      .then((result) => {
        setCandidates(result);
      });
  }

  function likeOrDislike(like: boolean, candidateId: number) {
    fetch(
      `http://localhost:3000/${like ? "like" : "dislike"}/${user}/${candidateId}`,
      {
        method: "POST"
      }
    ).then(() => {
      getCandidates();
    });
  }

  useEffect(() => {
    getCandidates();
  }, []);

  return (
    <>
      <ul>
        {candidates &&
          candidates.map((candidate) => (
            <li key={candidate.id}>
              {candidate.name}
              <input
                onClick={() => {
                  likeOrDislike(true, candidate.id);
                }}
                type="button"
                value="Like"
              />
              <input
                onClick={() => {
                  likeOrDislike(false, candidate.id);
                }}
                type="button"
                value="Dislike"
              />
              <img
                alt=""
                src={`http://localhost:3000/photos/${candidate.id}.jpeg`}
                style={{ width: 50 }}
              />
            </li>
          ))}
      </ul>
      <form
        action={`http://localhost:3000/upload/${user}`}
        encType="multipart/form-data"
        method="POST"
      >
        <input name="photo" type="file" />
        <input type="submit" value="Ladda upp" />
      </form>
      <img
        alt=""
        src={`http://localhost:3000/photos/${user}.jpeg`}
        style={{ width: 300 }}
      />
    </>
  );
}

export default App;
