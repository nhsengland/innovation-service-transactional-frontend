import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { InnovatorService, SurveyType } from '@modules/feature-modules/innovator/services/innovator.service';

@Component({
  selector: 'app-innovator-pages-innovation-support-surveys',
  templateUrl: './support-surveys.component.html'
})
export class PageInnovationSupportSurveysComponent extends CoreComponent implements OnInit {
  innovationId: string;
  requestId: string;
  baseUrl: string;

  private surveys: SurveyType[] = [];
  private isCurrentlyBeingRedirected = false;
  private isRedirectedFromSurvey = signal<boolean>(false);

  radioButtonInfo = signal<{
    label: string;
    description?: string;
    items: { value: string; label: string; description?: string }[];
  }>({
    label: 'Which organisation would you like to give feedback to?',
    items: []
  });

  form = new FormGroup(
    {
      survey: new FormControl<null | string>(null, { validators: CustomValidators.required('Please choose an option') })
    },
    { updateOn: 'blur' }
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService,
    private datePipe: DatePipe
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.requestId = this.activatedRoute.snapshot.params.requestId;
    this.baseUrl = `/innovator/innovations/${this.innovationId}`;

    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && 'redirectedFromAnswer' in state) {
      this.isRedirectedFromSurvey.set(true);
    }

    this.setBackLink('Go back');
  }

  ngOnInit(): void {
    this.innovatorService.getUnansweredSurveys(this.innovationId).subscribe(surveys => {
      this.surveys = surveys;

      if (this.isRedirectedFromSurvey()) {
        this.handleRedirectedFromSurveyPage();
      } else {
        this.handleShowAllSurveysPage();
      }

      if (!this.isCurrentlyBeingRedirected) {
        this.setPageStatus('READY');
      }
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.get('survey')?.value;
    if (this.isRedirectedFromSurvey()) {
      if (value === 'YES') {
        this.handleShowAllSurveysPage();
      } else {
        this.redirectToOverview();
      }
    } else {
      const selectedSurvey = this.surveys.find(s => s.id === value);
      if (!selectedSurvey) return;
      this.redirectToSurvey(selectedSurvey.id, selectedSurvey.info!.supportUnit);
    }
  }

  private handleShowAllSurveysPage(): void {
    this.isRedirectedFromSurvey.set(false);

    if (this.surveys.length === 0) {
      this.handleEmptyState();
      return;
    }

    // If we only have one survey we don't show anything, we redirect directly to the survey.
    if (this.surveys.length === 1) {
      const [survey] = this.surveys;
      this.redirectToSurvey(survey.id, survey.info!.supportUnit, true);
      return;
    }

    this.radioButtonInfo.set({
      label: 'Which organisation would you like to give feedback to?',
      items: this.transformSurveysIntoItems(this.surveys)
    });
  }

  private handleRedirectedFromSurveyPage(): void {
    if (this.surveys.length === 0) {
      this.redirectToOverview();
      return;
    }

    let label = 'Would you like to give feedback to other organisations?';
    let description: undefined | string = undefined;

    if (this.surveys.length === 1) {
      const [survey] = this.surveys;
      label = `Would you like to give feedback to ${survey.info?.supportUnit}?`;
      description = `${survey.info?.supportUnit} closed support on ${this.datePipe.transform(survey.info!.supportFinishedAt, this.translate('app.date_formats.long_date'))}`;
    }

    this.radioButtonInfo.set({
      label,
      description,
      items: [
        { value: 'YES', label: 'Yes' },
        { value: 'NO', label: 'No' }
      ]
    });
  }

  private handleEmptyState(): void {
    this.resetBackLink();
    this.setPageTitle('You have completed the feedback for all organisations that have supported your innovation', {
      size: 'l',
      width: '2.thirds'
    });
  }

  private transformSurveysIntoItems(surveys: SurveyType[]) {
    return surveys
      .filter(s => s.info && s.info.type === 'SUPPORT_END')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(s => ({
        value: s.id,
        label: s.info!.supportUnit,
        description: `Closed support ${this.datePipe.transform(s.info!.supportFinishedAt, this.translate('app.date_formats.long_date'))}`
      }));
  }

  private redirectToSurvey(surveyId: string, unitName: string, onlyOneSurveyToAnswer?: boolean): void {
    const url = `${this.baseUrl}/surveys/${surveyId}`;
    this.router.navigateByUrl(url, { state: { unitName, onlyOneSurveyToAnswer } });
    this.isCurrentlyBeingRedirected = true;
  }

  private redirectToOverview(): void {
    this.redirectTo(this.baseUrl);
    this.isCurrentlyBeingRedirected = true;
  }
}
