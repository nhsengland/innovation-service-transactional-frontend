import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';

import { AnnouncementStatusEnum, AnnouncementsService } from '@modules/feature-modules/admin/services/announcements.service';

import { ANNOUNCEMENT_EDIT_QUESTIONS, ANNOUNCEMENT_NEW_QUESTIONS, OutboundPayloadType } from './announcement-newdit.config';


@Component({
  selector: 'app-admin-pages-announcement-newdit',
  templateUrl: './announcement-newdit.component.html'
})
export class PageAnnouncementNewditComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  announcementId: string;
  annoncementStatus: null | AnnouncementStatusEnum = null;

  wizard: WizardEngineModel = new WizardEngineModel({});
  wizardSummary: null | OutboundPayloadType = null;
  wizardSummaryUserGroupsLabels: string = '';

  isCreation(): boolean { return !this.announcementId; }
  isEdition(): boolean { return !!this.announcementId; }

  isScheduled(): boolean { return this.isEdition() && this.annoncementStatus === AnnouncementStatusEnum.SCHEDULED; }
  isActive(): boolean { return this.isEdition() && this.annoncementStatus === AnnouncementStatusEnum.ACTIVE; }

  constructor(
    private activatedRoute: ActivatedRoute,
    private announcementsService: AnnouncementsService
  ) {

    super();

    this.announcementId = this.activatedRoute.snapshot.params.announcementId;

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

  }

  ngOnInit(): void {

    if (this.isCreation()) {

      this.wizard = new WizardEngineModel(ANNOUNCEMENT_NEW_QUESTIONS);
      this.wizard.runRules();

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      this.setPageStatus('READY');

    } else {

      this.announcementsService.getAnnouncementInfo(this.announcementId).subscribe(response => {

        this.annoncementStatus = response.status;

        if (this.isScheduled()) {
          this.wizard = new WizardEngineModel(ANNOUNCEMENT_NEW_QUESTIONS);
        } else if (this.isActive()) {
          this.wizard = new WizardEngineModel(ANNOUNCEMENT_EDIT_QUESTIONS);
        } else {
          this.redirectTo('info');
        }

        this.wizard.setAnswers(this.wizard.runInboundParsing(response)).runRules();
        this.wizard.gotoStep(this.activatedRoute.snapshot.params.stepId || 1);

        this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        this.setPageStatus('READY');

      });

    }

  }

  onSubmitStep(action: 'previous' | 'next'): void {

    const formData = this.formEngineComponent?.getFormValues() || { valid: false, data: {} };

    if (action === 'next' && !formData.valid) { // Don't move forward if step is NOT valid.
      return;
    }

    this.wizard.addAnswers(formData.data).runRules();

    switch (action) {
      case 'previous':
        if (this.wizard.isFirstStep()) { this.redirectTo('admin/announcements'); }
        else { this.wizard.previousStep(); }
        break;
      case 'next':
        this.wizard.nextStep();
        break;
      default: // Should NOT happen!
        break;
    }

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
      this.wizardSummary = this.wizard.runOutboundParsing() as OutboundPayloadType;
      this.wizardSummaryUserGroupsLabels = this.wizardSummary.userRoles.map(item => this.stores.authentication.getRoleDescription(item)).join('\n')
    }

  }

  onGotoStep(stepNumber: number): void {

    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });

  }

  onSubmitWizard(): void {

    this.wizardSummary = this.wizard.runOutboundParsing() as OutboundPayloadType;

    if (this.isCreation()) {

      this.announcementsService.createAnnouncement(this.wizardSummary).subscribe({
        next: response => {
          this.setRedirectAlertSuccess('A new announcement was created.');
          this.redirectTo(`admin/announcements/${response.id}`);
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      });

    } else {

      this.announcementsService.updateAnnouncement(this.announcementId, this.annoncementStatus!, this.wizardSummary).subscribe({
        next: () => {
          this.setRedirectAlertSuccess('The announcement was updated.');
          this.redirectTo(`admin/announcements/${this.announcementId}`);
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      });

    }

  }

}
