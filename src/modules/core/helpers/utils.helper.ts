import { locale } from "@app/config/translations/en";
import { PhoneUserPreferenceEnum } from "@modules/stores/authentication/authentication.service";

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

  static getContactPreferenceValue(contactByEmail: boolean = false, contactByPhone: boolean = false, contactByPhoneTimeframe: PhoneUserPreferenceEnum | null = null): string {
    let value = '';
    if (contactByPhone && contactByPhoneTimeframe) {
      value = `By phone, ${locale.data.shared.catalog.user.contact_user_preferences[contactByPhoneTimeframe].confirmation}. `;
    }
    
    if (contactByEmail) {
      value += 'By email.';
    }
  
    return value;
  }

  static indefiniteArticle(word: string): string {
    const regex = new RegExp('^[aeiou].*', 'i');
    const startWithVowel = regex.test(word);

   return startWithVowel ? `an ${word}` : `a ${word}`;

  }
}
