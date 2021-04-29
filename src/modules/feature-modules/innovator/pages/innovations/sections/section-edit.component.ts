import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormEngineModel } from '@app/base/forms';


@Component({
  selector: 'app-innovator-pages-innovations-section-edit',
  templateUrl: './section-edit.component.html'
})
export class InnovationsSectionEditComponent extends CoreComponent implements OnInit {


  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  stepsData: FormEngineModel[] = [];
  currentStep: {
    number: number;
    data: FormEngineModel;
  };
  totalNumberOfSteps: number;

  currentAnswers: { [key: string]: any };

  isFirstStep(): boolean { return this.currentStep.number === 1; }
  isLastStep(): boolean { return this.currentStep.number === this.totalNumberOfSteps; }


  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    super();

    this.stepsData = this.stores.innovation.getSectionForm(this.activatedRoute.snapshot.params.sectionId);
    this.totalNumberOfSteps = this.stepsData.length;

    this.currentStep = {
      number: Number(this.activatedRoute.snapshot.params.questionId),
      data: new FormEngineModel({ parameters: [] })
    };

    this.currentAnswers = {};


  }


  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {

        this.currentStep.number = Number(params.questionId);
        this.currentStep.data = this.stepsData[this.currentStep.number - 1];
        this.currentStep.data.defaultData = this.currentAnswers;

      })
    );

  }



  onSubmitStep(action: 'previous' | 'next', event: Event): void {

    event.preventDefault();

    const formData = this.formEngineComponent?.getFormValues();

    console.log('ANSWERS', this.currentAnswers);
    console.log('SUBMITTED', formData);

    if (action === 'next' && !formData?.valid) { // Apply validation only when moving forward.
      return;
    }

    this.currentAnswers = { ...this.currentAnswers, ...formData?.data };

    if (this.isLastStep() && action === 'next') { this.onSubmitSurvey(); }
    else { this.redirectTo(this.getNavigationUrl(action), { a: action }); }

  }



  onSubmitSurvey(): void {

    // this.innovatorService.submitFirstTimeSigninInfo(this.currentAnswers).pipe(
    //   concatMap(() => {
    //     return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
    //   })
    // ).subscribe(
    //   () => {
    //     this.redirectTo(`innovator/dashboard`);
    //     return;
    //   },
    //   () => {
    //     this.redirectTo(`innovator/first-time-signin/summary`);
    //     return;
    //   }
    // );

  }


  getNavigationUrl(action: 'previous' | 'next'): string {

    let url = `/innovator/innovations/${this.activatedRoute.snapshot.params.innovationId}/record`;

    switch (action) {
      case 'previous':
        if (this.isFirstStep()) { url += ''; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${this.currentStep.number - 1}`; }
        break;

      case 'next':
        if (this.isLastStep()) { url += '/first-time-signin/summary'; }
        else { url += `/sections/${this.activatedRoute.snapshot.params.sectionId}/edit/${this.currentStep.number + 1}`; }
        break;

      default: // Should NOT happen!
        url += '';
        break;
    }

    return url;

  }


}
