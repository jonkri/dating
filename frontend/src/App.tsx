import type { Dog } from "common";
import { useCallback, useEffect, useState } from "react";
import Card from "./Card";

function App() {
  const [candidates, setCandidates] = useState<Dog[] | null>(null),
    [user] = useState(3);

  console.log("Test (Utanför useMemo)");

  const getCandidates = useCallback(async () => {
    const response = await fetch(`http://localhost:3000/candidates/${user}`),
      result = await response.json();

    setCandidates(result);
  }, [user]);

  async function likeOrDislike(like: boolean, candidateId: number) {
    await fetch(
      `http://localhost:3000/${like ? "like" : "dislike"}/${user}/${candidateId}`,
      {
        method: "POST"
      }
    );

    getCandidates();
  }

  useEffect(() => {
    (async () => {
      getCandidates();
    })();
  }, [getCandidates]);

  return (
    <>
      <h1 className="sr-only">Hem</h1>
      {Array.isArray(candidates) ? (
        candidates.length > 0 ? (
          <Card candidate={candidates[0]} likeOrDislike={likeOrDislike} />
        ) : (
          <p>Det finns inga kandidater.</p>
        )
      ) : (
        <p>Laddar...</p>
      )}
      <section aria-labelledby="candidate-action-heading">
        <h2 id="candidate-action-heading">Ladda upp en bild</h2>
        <form
          action={`http://localhost:3000/upload/${user}`}
          encType="multipart/form-data"
          method="POST"
        >
          <input name="photo" type="file" />
          <input type="submit" value="Ladda upp" />
        </form>
        <h3>Nuvarande bild</h3>
        <img
          alt=""
          src={`http://localhost:3000/photos/${user}.jpeg`}
          style={{ width: 300 }}
        />
      </section>
    </>
  );
}

export default App;
