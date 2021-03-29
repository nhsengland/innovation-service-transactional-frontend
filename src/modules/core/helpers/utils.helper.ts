export class UtilsHelper {
  static isEmpty = (obj: any) => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
}
