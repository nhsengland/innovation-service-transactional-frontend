import { DateTime } from 'luxon';

export class DatesHelper {

  // Returns the difference (in days) between 2 dates.
  static dateDiff(startDate: string, endDate: string): number {

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    return Math.floor((eDate.getTime() - sDate.getTime()) / 1000 / 60 / 60 / 24);

  }

  static addDaysToDate(startDate: string, days: number): string {
    let sDate = new Date(startDate);

    sDate.setDate(sDate.getDate() + days);

    return sDate.toString();
  }

  static parseIntoValidFormat(dateStr: string | null, format = "yyyy/MM/dd"): string | null {
    if (dateStr === null) {
      return null;
    }

    const validDateFormats = [
      "dd/MM/yyyy",
      "yyyy/MM/dd",
      "MM/dd/yyyy",
      "d/M/yyyy",
      "d/M",
      "M/d",
      "yyyy"
    ];

    for (const dateFormat of validDateFormats) {
      const date = DateTime.fromFormat(dateStr, dateFormat);

      if (date.isValid === true) {
        return date.toFormat(format);
      }
    }

    return null;
  }

}
