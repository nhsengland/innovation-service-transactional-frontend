import { DatePipe } from '@angular/common';
import { locale } from '@app/config/translations/en';
import {
  GetNotifyMeInnovationSubscription,
  NotificationEnum,
  NotifyMeResponseTypes,
  ProgressUpdateCreatedResponseDTO,
  SupportUpdatedResponseDTO
} from '@modules/feature-modules/accessor/services/accessor.service';
import { OrganisationsListDTO } from '@modules/shared/services/organisations.service';
import { SchemaContextStore } from '@modules/stores';
import { PhoneUserPreferenceEnum } from '@modules/stores/authentication/authentication.service';

export class UtilsHelper {
  static isEmpty(value: any) {
    switch (typeof value) {
      case 'number':
        return value < 0; // 0 is considered NOT empty.
      case 'string':
        return value.trim() === '';
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

  static getNotifyMeSubscriptionTitleText(subscription: GetNotifyMeInnovationSubscription): string {
    switch (subscription.eventType) {
      case NotificationEnum.SUPPORT_UPDATED:
        const translatedStatuses = subscription.status
          .map(status => locale.data.shared.catalog.innovation.support_status[status].name.toLowerCase())
          .sort((a, b) => a.localeCompare(b));

        return `Notify me when an organisation updates their support status to ${
          translatedStatuses.length === 1
            ? translatedStatuses[0]
            : `${translatedStatuses.slice(0, -1).join(', ')} or ${translatedStatuses.at(-1)}`
        }`;
      case NotificationEnum.PROGRESS_UPDATE_CREATED:
        return 'Notify me when an organisation adds a progress update to the support summary';
      case NotificationEnum.INNOVATION_RECORD_UPDATED:
        return 'Notify me when the innovator updates their innovation record';
      case NotificationEnum.REMINDER:
        return 'Notify me on a date in future';
      default:
        return '';
    }
  }

  static getNotifyMeSubscriptionOrganisationsText(
    subscription: SupportUpdatedResponseDTO | ProgressUpdateCreatedResponseDTO
  ): string[] {
    return subscription.organisations
      .flatMap(org => org.units.map(unit => unit.name))
      .sort((a, b) => a.localeCompare(b));
  }

  static getNotifyMeSubscriptionSectionsText(
    subscription: NotifyMeResponseTypes[NotificationEnum.INNOVATION_RECORD_UPDATED],
    schemaStore: SchemaContextStore
  ): string[] {
    if (subscription.sections) {
      return subscription.sections
        .map(s => {
          const sectionIdentification = schemaStore.getIrSchemaSectionIdentificationV3(s);
          return `${sectionIdentification?.group.number}.${sectionIdentification?.section.number} ${sectionIdentification?.section.title}`;
        })
        .sort((a, b) => a.localeCompare(b));
    } else {
      return ['All sections'];
    }
  }

  static getNotifyMeSubscriptionReminderText(
    subscription: NotifyMeResponseTypes[NotificationEnum.REMINDER],
    datePipe: DatePipe
  ): string {
    return `Notify me on ${datePipe.transform(subscription.date, locale.data.app.date_formats.long_date)} for this reason:`;
  }

  static getAssessmentVersion(majorVersion: number = 1, minorVersion: number = 0): string {
    return `${majorVersion}.${minorVersion}`;
  }
}
