/* istanbul ignore file */

export class LocalStorageHelper {

  static getObjectItem(key: string): null | { [key: string]: any } {

    try {
      const ls = localStorage.getItem(key);
      return ls ? JSON.parse(ls) : null;

    } catch (e) {
      return null;
    }

  }

  static setObjectItem(key: string, value: { [key: string]: any }): void {

    localStorage.setItem(key, JSON.stringify(value));

  }

  static removeItem(key: string): void {

    localStorage.removeItem(key);

  }

}
