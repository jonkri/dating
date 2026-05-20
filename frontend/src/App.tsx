// import type { Test } from "common";
import type { Dog } from "common";
import { useEffect, useState } from "react";

function App() {
  // const [s, setS] = useState<Test>("Hello");
  const [dogs, setDogs] = useState<Dog[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/dogs")
      .then((response) => response.json())
      .then((result) => {
        setDogs(result);
      });
  }, []);

  return <ul>{dogs && dogs.map((dog) => <li key={dog.id}>{dog.name}</li>)}</ul>;
}

export default App;
