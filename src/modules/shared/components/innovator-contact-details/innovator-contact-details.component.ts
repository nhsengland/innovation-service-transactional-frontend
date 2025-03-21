import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';
import { DateISOType } from '@app/base/types';
import { PhoneUserPreferenceEnum } from '@modules/stores';

@Component({
  selector: 'innovator-contact-details',
  templateUrl: './innovator-contact-details.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnovatorContactDetailsComponent extends CoreComponent {
  constructor(private datePipe: DatePipe) {
    super();
  }

  innovatorSummary = input<Partial<{
    name: string;
    lastLoginAt: DateISOType | null;
    contactByEmail: boolean;
    contactByPhone: boolean;
    contactByPhoneTimeframe: PhoneUserPreferenceEnum | null;
    contactDetails: string | null;
    email: string | null;
    mobilePhone: string | null;
  }> | null>();
  isArchived = input<boolean>();

  innovatorSummaryList = computed(() => [
    { label: 'Name', value: this.innovatorSummary()?.name ?? '[deleted account]' },
    {
      label: 'Last login',
      value: this.innovatorSummary()?.lastLoginAt
        ? this.datePipe.transform(
            this.innovatorSummary()?.lastLoginAt,
            this.translate('app.date_formats.long_date_time')
          )
        : ''
    },
    {
      label: 'Contact preference',
      value: this.isArchived()
        ? 'Not available'
        : UtilsHelper.getContactPreferenceValue(
            this.innovatorSummary()?.contactByEmail,
            this.innovatorSummary()?.contactByPhone,
            this.innovatorSummary()?.contactByPhoneTimeframe
          ) || ''
    },
    {
      label: 'Contact details',
      value: this.isArchived() ? 'Not available' : this.innovatorSummary()?.contactDetails || ''
    },
    { label: 'Email address', value: this.isArchived() ? 'Not available' : this.innovatorSummary()?.email || '' },
    {
      label: 'Phone number',
      value: this.isArchived() ? 'Not available' : this.innovatorSummary()?.mobilePhone || ''
    }
  ]);
}
