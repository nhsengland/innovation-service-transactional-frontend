import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { CustomValidators } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UsersService } from '@modules/shared/services/users.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { AccessorService } from '../../../services/accessor.service';
import { ContextPageLayoutType } from '@modules/stores/context/context.types';


@Component({
  selector: 'app-accessor-pages-innovation-change-accessors',
  templateUrl: './support-change-accessors.component.html'
})
export class InnovationChangeAccessorsComponent extends CoreComponent implements OnInit {

  private accessorsList: { id: string, userRoleId: string, name: string }[] = [];

  innovationId: string;
  supportId: string;
  stepNumber: number;

  formAccessorsList: { value: string, label: string }[] = [];
  selectedAccessors: typeof this.accessorsList = [];
  userOrganisationUnit: null | { id: string, name: string, acronym: string };

  supportStatusObj = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  supportStatus = Object.entries(this.supportStatusObj).map(([key, item]) => ({
    key,
    checked: false,
    ...item
  })).filter(x => !x.hidden);

  chosenStatus: null | InnovationSupportStatusEnum = null;

  form = new FormGroup({
    status: new FormControl<null | Partial<InnovationSupportStatusEnum>>( null, { validators: Validators.required, updateOn: 'change' }),
    accessors: new FormArray<FormControl<string>>([], { updateOn: 'change' }),
    message: new FormControl<string>('', CustomValidators.required('A message is required')),
    suggestOrganisations: new FormControl<string>('YES', { validators: Validators.required, updateOn: 'change' })
  }, { updateOn: 'blur' });

  // formfieldSuggestOrganisations = {
  //   description: `Based on the innovation's current support status, can you refer another organisation to continue supporting this Innovation at this moment in time?`,
  //   items: [
  //     { value: 'YES', label: `Yes` },
  //     { value: 'NO', label: `No` }
  //   ]
  // };

  private currentStatus: null | InnovationSupportStatusEnum = null;

  // private messageStatusLabels: { [key in InnovationSupportStatusEnum]?: string } = {
  //   [InnovationSupportStatusEnum.ENGAGING]: 'Describe the support you plan to provide.',
  //   [InnovationSupportStatusEnum.WAITING]: 'Explain the information or decisions you need, before you can support this innovation.',
  //   [InnovationSupportStatusEnum.UNSUITABLE]: 'Explain why your organisation has no suitable support offer for this innovation.',
  //   [InnovationSupportStatusEnum.CLOSED]: 'Explain why your organisation has closed its engagement with this innovation.'
  // };
  
  // private messageStatusDescriptions: { [key in InnovationSupportStatusEnum]?: string } = {
  //   [InnovationSupportStatusEnum.ENGAGING]: 'This message will be sent to the innovator and collaborators. It will also appear on the innovation’s support summary.',
  //   [InnovationSupportStatusEnum.WAITING]: 'The innovator and collaborators will be notified.',
  //   [InnovationSupportStatusEnum.UNSUITABLE]: 'The innovator and collaborators will be notified.',
  //   [InnovationSupportStatusEnum.CLOSED]: 'The innovator and collaborators will be notified.'
  // };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private usersService: UsersService,
    private accessorService: AccessorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.stepNumber = 1;

    this.userOrganisationUnit = this.stores.authentication.getUserContextInfo()?.organisationUnit || null;

  
  }


  ngOnInit(): void {

    this.setBackLink('Go back', this.handleGoBack.bind(this));

    this.setPageTitle('Assign accessors to support this innovation', { width: 'full', size: 'l' });

    if (!this.supportId) {

      this.setPageStatus('READY');

    } else {

      this.innovationsService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(response => {

        this.currentStatus = response.status;

        response.engagingAccessors.forEach(accessor => {
          (this.form.get('accessors') as FormArray).push(new FormControl<string>(accessor.id));
        });

        this.setPageStatus('READY');

      });

    }

    this.usersService.getUsersList({ queryParams: { take: 100, skip: 0, filters: { email: false, onlyActive: true, organisationUnitId: this.userOrganisationUnit?.id ?? '', userTypes: [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR] } } }).subscribe(
      response => {

        this.accessorsList = response.data.map((item) => ({ id: item.id, userRoleId: item.roleId, name: item.name }));
        this.formAccessorsList = response.data.map((r) => ({ value: r.id, label: r.name }));

      }
    );

  }


  onSubmitStep(): void {

    switch (this.stepNumber) {

      case 1:

        const formAccessors = this.form.get('accessors');
        if ((this.form.get('accessors')?.value ?? []).length === 0) {
          formAccessors?.markAsTouched();
          formAccessors?.setErrors({ customError: true, message: 'Please, choose at least one accessor' });
          return;
        }

        this.selectedAccessors = this.accessorsList.filter(item =>
          (this.form.get('accessors')?.value ?? []).includes(item.id)
        );

        this.stepNumber++;
        this.setPageTitle('Change assigned accessors', { size: 'l' });

        break;

      default:
        break;

    }

  }

  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      accessors: this.selectedAccessors.map(item => ({
        id: item.id,
        userRoleId: item.userRoleId
      })),
      message: this.form.get('message')?.value ?? ''
    }

    // this.accessorService.saveSupportStatus(this.innovationId, body, this.supportId).subscribe(() => {

    //   // this.setAlertSuccess('Support status updated and organisation suggestions sent', { message: 'The Innovation Support status has been successfully updated and the Innovator has been notified of your accompanying suggestions and feedback.' });

    //   if (this.chosenStatus && this.currentStatus === InnovationSupportStatusEnum.ENGAGING && [InnovationSupportStatusEnum.CLOSED, InnovationSupportStatusEnum.WAITING, InnovationSupportStatusEnum.UNSUITABLE].includes(this.chosenStatus)) {
    //     this.setAlertSuccess('Support status updated', { message: this.getMessageStatusUpdated()?.message });
    //     this.setPageTitle('Suggest other organisations', { showPage: false, size: 'l' });
    //     this.stepNumber = 4;
    //   } else {
    //     this.setRedirectAlertSuccess('You have changed the accessors assigned to this innovation', { message: 'The innovator and collaborators will be notified and your message has been sent.'})
    //     this.redirectTo(this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`);
    //   }

    // });

    this.accessorService.changeAccessors(this.innovationId, body).subscribe(() =>{

      this.setRedirectAlertSuccess('You have changed the accessors assigned to this innovation', { message: 'The innovator and collaborators will be notified and your message has been sent.'})
      this.redirectTo(this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`);

    })
  }

  // onSubmitRedirect() {
  //     this.redirectTo(this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`);
  // }

  getMessageLabel() {

    const status = this.form.get('status')?.value;
    return 'Explain the reason you have changed the assigned accessors for this innovation (optional).';
  }

  getMessageDescription() {
    const status = this.form.get('status')?.value;
    return 'This message will be sent to the innovator and collaborators. It will also appear on the innovation’s support summary.';
  }

  // getMessageStatusUpdated(): { message: string, itemsList?: ContextPageLayoutType['alert']['itemsList'] } | undefined {
  //   const status = this.form.get('status')?.value;
  //   return status ? this.messageStatusUpdated[status] : undefined;
  // }

  private handleGoBack() {

    if (this.stepNumber > 0){
      this.stepNumber--;
    }
    
    if (this.stepNumber === 0) {
      this.redirectTo(`/accessor/innovations/${this.innovationId}/overview`);
    }

  }

}
