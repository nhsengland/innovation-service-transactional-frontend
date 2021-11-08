import { UtilsHelper } from './utils.helper';


describe('Core/Helpers/UtilsHelper/isEmpty', () => {

  it(`should return 'true' when object is 'empty'`, () => {
    expect(UtilsHelper.isEmpty({})).toBe(true);
  });

  it(`should return 'false' when object has at least 'one attribute'`, () => {
    expect(UtilsHelper.isEmpty({ prop: 1 })).toBe(false);
  });

  it(`should return 'true when object is 'undefined'`, () => {
    expect(UtilsHelper.isEmpty(undefined)).toBe(true);
  });

  it(`should return 'true' when object is null`, () => {
    expect(UtilsHelper.isEmpty(null)).toBe(true);
  });

  it(`should return 'true' when an 'empty Array' is passed in`, () => {
    expect(UtilsHelper.isEmpty([])).toBe(true);
  });

  it(`should return 'false' when an 'Array with empty objects' is passed in`, () => {
    expect(UtilsHelper.isEmpty([{}])).toBe(false);
  });

  it(`should return 'false' when an 'Array with objects' is passed in`, () => {
    expect(UtilsHelper.isEmpty([{ prop: 1 }])).toBe(false);
  });

});


describe('Core/Helpers/UtilsHelper/arrayFullTextSearch', () => {

  const items = ['One cat', 'One dog', 'Two cats', 'Two dogs'];

  it(`should return 'true' when object is 'empty'`, () => {
    const search = 'One';
    const expected = ['One cat', 'One dog'];
    expect(UtilsHelper.arrayFullTextSearch(items, search)).toEqual(expected);
  });

});
