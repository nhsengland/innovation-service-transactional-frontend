import { locale } from '@app/config/translations/en';
import { GetNotifyMeInnovationSubscription } from '@modules/feature-modules/accessor/services/accessor.service';
import { OrganisationsListDTO } from '@modules/shared/services/organisations.service';
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

  static getAvailableOrganisationsToSuggest(
    innovationId: string,
    userUnitId: string,
    organisationsList: OrganisationsListDTO[],
    engagingUnitsIds: string[],
    previousOrganisationsSuggestions?: { [key: string]: string[] }
  ): (OrganisationsListDTO & { description: string | undefined })[] {
    const organisationsSuggestions =
      previousOrganisationsSuggestions ?? JSON.parse(sessionStorage.getItem('organisationsSuggestions') ?? '{}');

    const organisationsToSuggest = organisationsList
      .map(org => {
        const newOrg = {
          ...org,
          organisationUnits: org.organisationUnits.filter(
            unit =>
              ![...(organisationsSuggestions[innovationId] || []), ...engagingUnitsIds, userUnitId].includes(unit.id)
          )
        };

        let description = undefined;
        if (org.organisationUnits.length > 1) {
          const totalUnits = newOrg.organisationUnits.length;
          description = `${totalUnits} ${totalUnits > 1 ? 'units' : 'unit'} in this organisation`;
        }

        return { ...newOrg, description };
      })
      .filter(org => org.organisationUnits.length > 0);

    return organisationsToSuggest;
  }

  static getNotifyMeSubscriptionText(subscription: GetNotifyMeInnovationSubscription): string {
    if (subscription.eventType === 'SUPPORT_UPDATED') {
      const translatedStatuses = subscription.status
        .map(status => locale.data.shared.catalog.innovation.support_status[status].name.toLowerCase())
        .sort();

      return `Notify me when an organisation updates their support status to ${
        translatedStatuses.length === 1
          ? translatedStatuses[0]
          : `${translatedStatuses.slice(0, -1).join(', ')} or ${translatedStatuses.at(-1)}`
      }`;
    }
    return '';
  }
}
