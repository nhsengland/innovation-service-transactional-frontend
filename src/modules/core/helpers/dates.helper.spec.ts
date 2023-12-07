import { DatesHelper } from './dates.helper';

describe('Core/Helpers/DatesHelper', () => {
  it(`should calculate the difference between 2 dates`, () => {
    expect(DatesHelper.dateDiff('2020-01-01T00:00:00.000Z', '2020-01-05T00:00:00.00Z')).toBe(4);
  });

  describe('DatesHelper.parseIntoValidFormat', () => {
    const year = new Date().getFullYear();

    it(`should return YYYY/MM/DD when input is DD/MM`, () => {
      expect(DatesHelper.parseIntoValidFormat('24/09')).toBe(`${year}/09/24`);
    });

    it(`should return YYYY/MM/DD when input is MM/DD`, () => {
      expect(DatesHelper.parseIntoValidFormat('09/12')).toBe(`${year}/12/09`);
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

    it(`should return YYYY-MM-DD when input is D/MM/YYYY`, () => {
      expect(DatesHelper.parseIntoValidFormat('4/11/2022')).toBe('2022/11/04');
    });

    it(`should return date in given format`, () => {
      expect(DatesHelper.parseIntoValidFormat('14/09/2020', 'MM/dd/yyyy')).toBe('09/14/2020');
    });

    it(`should return null if input is empty`, () => {
      expect(DatesHelper.parseIntoValidFormat('')).toBeNull();
    });

    it(`should return null if input is null`, () => {
      expect(DatesHelper.parseIntoValidFormat(null)).toBeNull();
    });

    it(`should return null if input is invalid (MM//DD)`, () => {
      expect(DatesHelper.parseIntoValidFormat('09//12')).toBeNull();
    });

    it(`should return null if input is invalid (DD)`, () => {
      expect(DatesHelper.parseIntoValidFormat('00')).toBeNull();
    });
  });
});
