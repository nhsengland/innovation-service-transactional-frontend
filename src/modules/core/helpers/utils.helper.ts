export class UtilsHelper {


  static isEmpty = (obj: any) => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;


  static arrayFullTextSearch(items: string[], searchText: string): string[] {

    const searchWords = searchText.trim().replace(/\s\s/g, ' ').toLowerCase().split(' '); // Removes more than on space to just one, and split by words.

    return items.filter(item => {

      const itemWords = item.trim().replace(/\s\s/g, ' ').toLowerCase().split(' ');

      // Return true if all the searchWords, have an equivalent that startsWith on the itemWords.
      return searchWords.every(el =>
        itemWords.findIndex(f => f.startsWith(el)) > -1
      );

    });
  }

}
