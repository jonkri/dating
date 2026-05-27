import type { Dog } from "common";
import { useEffect /*, useMemo*/, useState } from "react";

const user = 1;

function App() {
  const [candidates, setCandidates] = useState<Dog[] | null>(null);

  console.log("Test (Utanför useMemo)");

  // const mySpecialNumber = useMemo(() => {
  //   console.log("Test (Innanför useMemo)");
  //   return 5;
  // }, []);

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
          </li>
        ))}
    </ul>
  );
}

export default App;
