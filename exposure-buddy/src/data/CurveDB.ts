import Reciprocity from "./Reciprocity";

// https://www.magnaimages.com/post/foma-fomapan-100-reciprocity-failure-charts
// https://www.flickr.com/photos/janokelly/6804638225/
type ReciprocityFunction = (n: number) => number;

export const sub1SecondFix = (f: ReciprocityFunction): ReciprocityFunction => {
  return (n: number) => {
    if (n <= 1) {
      return n;
    } else {
      return f(n);
    }
  };
};

const CurveDb: {
  [key in Reciprocity]: { name: string; curve: ReciprocityFunction };
} = {
  foma100: {
    name: "Foma 100",
    curve: (n: number): number =>
      n * (Math.pow(Math.log10(n), 2) + 5 * Math.log10(n) + 2),
  },
  foma200: {
    name: "Foma 200",
    curve: (n: number): number =>
      n * (1.5 * Math.pow(Math.log10(n), 2) + 4.5 * Math.log10(n) + 3),
  },
  tmax100: {
    name: "Tmax 100",
    curve: (n: number): number =>
      n * ((1 / 6) * Math.pow(Math.log10(n), 2) + 4 / 3),
  },
  tmax400: {
    name: "Tmax 400",
    curve: (n: number): number =>
      n * ((2 / 3) * Math.pow(Math.log10(n), 2) - 0.5 * Math.log10(n) + 4 / 3),
  },
  fujicolor100: {
    name: "Fuji Color 100",
    curve: (n: number): number => n * (0.5537 * Math.log10(n) + 1),
  },
  trix: {
    name: "Tri-X 320/400",
    curve: (n: number): number =>
      n * (2 * Math.pow(Math.log10(n), 2) + Math.log10(n) + 2),
  },
  tmax3200: {
    name: "Tmax 3200",
    curve: (n: number): number =>
      n * ((7 / 6) * Math.pow(Math.log10(n), 2) - Math.log10(n) + 4 / 3),
  },
  none: { name: "None", curve: (n: number): number => n },
};

export const calculateReciprocity = (
  r: Reciprocity,
  seconds: number
): number => {
  if (seconds <= 1.0) return seconds;
  else return CurveDb[r].curve(seconds);
};

// const CurveDb = Reciprocity.reduce((result, key) => {
//   const fn = BaseCurveDb[key];
//   result[key] = sub1Fix(fn);
//   return result;
// }, {});

// });
export default CurveDb;
