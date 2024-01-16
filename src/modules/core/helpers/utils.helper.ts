import { locale } from '@app/config/translations/en';
import { PhoneUserPreferenceEnum } from '@modules/stores/authentication/authentication.service';

export class UtilsHelper {
  static isEmpty(value: any) {
    switch (typeof value) {
      case 'number':
        return value < 0; // 0 is considered NOT empty.
      case 'string':
        return value === '';
      case 'boolean':
        return !value;
      default:
        return [Object, Array].includes((value ?? {}).constructor) && !Object.entries(value ?? {}).length;
    }
  }

  static arrayFullTextSearch(items: string[], searchText: string): string[] {
    const searchWords = searchText.trim().replace(/\s\s/g, ' ').toLowerCase().split(' '); // Removes more than on space to just one, and split by words.

    return items.filter(item => {
      const itemWords = item.trim().replace(/\s\s/g, ' ').toLowerCase().split(' ');

      // Return true if all the searchWords, have an equivalent that startsWith on the itemWords.
      return searchWords.every(el => itemWords.findIndex(f => f.startsWith(el)) > -1);
    });
  }

  static getContactPreferenceValue(
    contactByEmail: boolean = false,
    contactByPhone: boolean = false,
    contactByPhoneTimeframe: PhoneUserPreferenceEnum | null = null
  ): string {
    let value = '';
    let newLine = false;
    if (contactByPhone && contactByPhoneTimeframe) {
      value = `By phone, ${locale.data.shared.catalog.user.contact_user_preferences[contactByPhoneTimeframe].confirmation}`;
      newLine = true;
    }

    if (contactByEmail) {
      if (newLine) {
        value += '\n';
      }
      value += 'By email';
    }

    return value;
  }
}
