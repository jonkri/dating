// const a = require('b')
// import a from b

// module.exports = {}
// export default {}

// export type Test = "Hello" | "World";

export interface Dog {
  id: number;
  name: string;
  birth_date: string;
}

export interface LikeOrDislike {
  id: number;
  like: boolean;
  from: number;
  to: number;
}
