import { Component, computed } from '@angular/core';

import { CoreComponent } from '@app/base';
import { UtilsHelper } from '@app/base/helpers';
import { UserRoleType } from '@modules/shared/dtos/roles.dto';
import { UserContextType } from '@modules/stores';

type SummaryList = { label: string; value: null | string; editStepNumber?: number }[];

@Component({
  selector: 'shared-pages-account-manage-details-info',
  templateUrl: './manage-details-info.component.html'
})
export class PageAccountManageDetailsInfoComponent extends CoreComponent {
  summary = computed(() => {
    const user = this.ctx.user.getUserInfo();
    if (this.ctx.user.isInnovator()) return this.handleInnovatorInfo(user);
    if (this.ctx.user.isAccessorOrAssessment()) return this.handleAccessorOrAssessmentInfo(user);
    if (this.ctx.user.isAdmin()) return this.handleAdminInfo(user);
    return [];
  });

  constructor() {
    super();
    this.setPageTitle('Your details');
    this.setPageStatus('READY');
  }

  private handleInnovatorInfo(user: UserContextType['user']): SummaryList {
    let editStep = 0;
    const summary = [
      { label: 'Name', value: user.displayName, editStepNumber: ++editStep },
      { label: 'Email address', value: user.email },
      {
        label: 'Contact preference',
        value: UtilsHelper.getContactPreferenceValue(
          user.contactByEmail,
          user.contactByPhone,
          user.contactByPhoneTimeframe
        ),
        editStepNumber: ++editStep
      },
      { label: 'Phone number', value: user.phone, editStepNumber: ++editStep },
      { label: 'Contact details', value: user.contactDetails, editStepNumber: ++editStep }
    ];

    if (!user.organisations[0].isShadow) {
      const [org] = user.organisations;
      summary.push(
        { label: 'Company', value: org.name, editStepNumber: ++editStep },
        { label: 'Company description', value: org.description, editStepNumber: ++editStep },
        { label: 'Company size', value: org.size, editStepNumber: ++editStep },
        { label: 'Company UK registration number', value: org.registrationNumber ?? '', editStepNumber: ++editStep }
      );
    }
    return summary;
  }

  private handleAccessorOrAssessmentInfo(user: UserContextType['user']): SummaryList {
    // this assumes that the user only has one organisation as it's currently the business case
    const organisation = user.roles.find(
      (r): r is UserRoleType & { organisation: { name: string } } => r.organisation !== undefined
    )?.organisation?.name;
    const roles = [...new Set(user.roles.map(r => this.ctx.user.getRoleDescription(r.role)))].join('\n');

    return [
      { label: 'Name', value: user.displayName, editStepNumber: 1 },
      { label: 'Email address', value: user.email },
      ...(organisation ? [{ label: 'Organisation', value: organisation }] : []),
      { label: 'Service roles', value: roles }
    ];
  }

  private handleAdminInfo(user: UserContextType['user']): SummaryList {
    return [
      { label: 'Name', value: user.displayName, editStepNumber: 1 },
      { label: 'Email address', value: user.email },
      { label: 'User type', value: this.ctx.user.getRoleDescription(user.roles[0].role as 'ADMIN') }
    ];
  }
}
