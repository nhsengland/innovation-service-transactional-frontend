import { Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappedObject } from '@modules/core';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { AlertType } from '@app/base/models';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { TableModel } from '@app/base/models';
import { CustomValidators, FormEngineComponent, FormEngineParameterModel } from '@modules/shared/forms';


@Component({
  selector: 'app-admin-pages-terms-of-use-new',
  templateUrl: './terms-of-use-new.component.html'
})
export class PageAdminTermsOfUseNewComponent extends CoreComponent implements OnInit {
  
  @ViewChildren(FormEngineComponent) formEngineComponent?: QueryList<FormEngineComponent>;

  alert: AlertType = { type: null };

  // form: {
  //   parameters: FormEngineParameterModel[];
  //   data: { [key: string]: any };
  // };
  form = new FormGroup({
    name: new FormControl(''),
    type: new FormControl(''),
    key_changes: new FormControl(''),
    notify_user: new FormControl('false', { updateOn: 'change' })
  }, { updateOn: 'blur' });

  currentAnswers: { [key: string]: any };

  typeItems: { value: string, label: string }[] = [
    { label: 'Support organisation', value: 'support_organisation' },
    { label: 'Innovations', value: 'innovations' }
  ];

  constructor() {

    super();
    this.setPageTitle('New version');
    // this.form = { 
    //   parameters: [
    //     new FormEngineParameterModel({
    //       id: 'name',
    //       dataType: 'text',
    //       label: 'What should we call your terms and conditions version?',
    //       description: 'Terms of use name',
    //       validations: { isRequired: [true, 'Term name is required'] },
    //     }),
    //     new FormEngineParameterModel({
    //       id: 'type',
    //       dataType: 'radio-group',
    //       label: 'Which users do this terms and conditions relate to?',
    //       validations: { isRequired: [true, 'Choose one option'] },
    //       items: [
    //         { label: 'Support organisation', value: 'support_organisation' },
    //         { label: 'Innovations', value: 'innovations' }
    //       ]
    //     }),
    //     new FormEngineParameterModel({
    //       id: 'key_changes',
    //       dataType: 'textarea',
    //       label: 'What are the key changes in this version?',
    //       description: 'Summaries changes',
    //       validations: { isRequired: [true, 'Term name is required'] },
    //       lengthLimit: 'large'
    //     }),
    //     new FormEngineParameterModel({
    //       id: 'notify_user',
    //       dataType: 'checkbox-group',
    //       description: 'If you would like to show this summary of changes to the selected users of this service, tick the checkbox below. If not, your changes will be saved but not shared',
    //       validations: { isRequired: [true, 'Term name is required'] },
    //       items: [{ label: 'Yes, notify all relevant Innovation Service users', value: 'true' }],
    //     }),
    //   ],
    //   data: {} 
    // };
    this.currentAnswers = {};
  }

  ngOnInit(): void {
    this.setPageStatus('READY');
  }

  onSubmit(action: 'update' | 'saveAsDraft' | 'submit'): void {
    this.alert = { type: '' };

    let isValid = true;

    // This section is not easy to test. TOIMPROVE: Include this code on unit test.
    (this.formEngineComponent?.toArray() || []).forEach(engine => /* istanbul ignore next */ {

      let formData: MappedObject;

      formData = engine.getFormValues(true);

      if (!formData?.valid) { isValid = false; }


      this.currentAnswers = { ...this.currentAnswers, ...formData?.data };

    });

    if (!isValid) /* istanbul ignore next */ {
      return;
    }
    console.log(this.currentAnswers);
  }
}
