import Reciprocity from "./Reciprocity";

// https://www.magnaimages.com/post/foma-fomapan-100-reciprocity-failure-charts
// https://www.flickr.com/photos/janokelly/6804638225/
type ReciprocityFunction = (n: number) => number;

const sub1Fix = (f: ReciprocityFunction): ReciprocityFunction => {
  return (n:number) =>
  {if (n <= 1) {
    return n;
  } else {
    return f(n);
  }}
};

const CurveDb: { [key in Reciprocity]: ReciprocityFunction } = {
  foma100: (n: number): number =>
    n * (Math.pow(Math.log10(n), 2) + 5 * Math.log10(n) + 2),
  foma200: (n: number): number =>
    n * (1.5 * Math.pow(Math.log10(n), 2) + 4.5 * Math.log10(n) + 3),
  tmax100: (n: number): number =>
    n * ((1 / 6) * Math.pow(Math.log10(n), 2) + 4 / 3),
  tmax400: (n: number): number =>
    n * ((2 / 3) * Math.pow(Math.log10(n), 2) - 0.5 * Math.log10(n) + 4 / 3),
  fujicolor100: (n: number): number => n * (0.5537 * Math.log10(n) + 1),
  none: (n: number): number => n,
};

// const CurveDb = Reciprocity.reduce((result, key) => {
//   const fn = BaseCurveDb[key];
//   result[key] = sub1Fix(fn);
//   return result;
// }, {});
  
// });
export default CurveDb;
