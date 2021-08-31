import { DatesHelper } from './dates.helper';

describe('Core/Helpers/DatesHelper', () => {

  it(`should calculate the difference between 2 dates`, () => {
    expect(DatesHelper.dateDiff('2020-01-01T00:00:00.000Z', '2020-01-05T00:00:00.00Z')).toBe(4);
  });

});
