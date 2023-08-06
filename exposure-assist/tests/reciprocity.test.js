const CurveDB = require('../data/CurveDB');

test('Test no reciprocity option', () => {  
  expect(CurveDB.default["none"](1)).toBe(1);
  expect(CurveDB.default["none"](3)).toBe(3);
});