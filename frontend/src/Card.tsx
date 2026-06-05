import type { Dog } from "common";

interface CardProps {
  candidate: Dog;
  likeOrDislike: (like: boolean, candidateId: number) => Promise<void>;
}

function Card({ candidate, likeOrDislike }: CardProps) {
  return (
    <section aria-labelledby="candidate-heading">
      <h2 id="candidate-heading">{candidate.name}</h2>
      <img
        alt=""
        src={`http://localhost:3000/photos/${candidate.id}.jpeg`}
        style={{ width: 400 }}
      />
      <section aria-labelledby="candidate-action-heading">
        <h3 id="candidate-action-heading">Ta ställning till</h3>
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
      </section>
    </section>
  );
}

export default Card;
