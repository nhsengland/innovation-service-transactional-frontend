import { DatesHelper } from './dates.helper';

describe('Core/Helpers/DatesHelper', () => {

  it(`should calculate the difference between 2 dates`, () => {
    expect(DatesHelper.dateDiff('2020-01-01T00:00:00.000Z', '2020-01-05T00:00:00.00Z')).toBe(4);
  });

  describe('DatesHelper.parseIntoValidFormat', () => {
    it(`should return YYYY/MM/DD when input is DD/MM`, () => {
      expect(DatesHelper.parseIntoValidFormat('24/09')).toBe('2022/09/24');
    });

    it(`should return YYYY/MM/DD when input is MM/DD`, () => {
      expect(DatesHelper.parseIntoValidFormat('09/12')).toBe('2022/12/09');
    });

    it(`should return YYYY-MM-DD when input is DD-MM-YYYY`, () => {
      expect(DatesHelper.parseIntoValidFormat('12/01/2012')).toBe('2012/01/12');
    });

    it(`should return YYYY-MM-DD when input is YYYY-MM-DD`, () => {
      expect(DatesHelper.parseIntoValidFormat('2012/01/12')).toBe('2012/01/12');
    });

    it(`should return YYYY-MM-DD when input is MM-DD-YYYY`, () => {
      expect(DatesHelper.parseIntoValidFormat('02/20/2021')).toBe('2021/02/20');
    });

    it(`should return YYYY-MM-DD (first day of the given year) when input is YYYY`, () => {
      expect(DatesHelper.parseIntoValidFormat('2020')).toBe('2020/01/01');
    });
  });

});
