import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { FormEngineComponent, WizardEngineModel } from '@app/base/forms';
import { UserInfo } from '@modules/shared/dtos/users.dto';
import { AdminUsersService } from '../../../services/users.service';
import { OutboundPayloadType, WIZARD_ADD_STRATEGIC_ROLE } from './strategic-role-new.config';

@Component({
  selector: 'app-admin-pages-users-strategic-role-new',
  templateUrl: './strategic-role-new.component.html'
})
export class PageStrategicRoleNewComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  userId: string;
  user: UserInfo | null = null;
  wizard = new WizardEngineModel(WIZARD_ADD_STRATEGIC_ROLE);
  submitButton = { isActive: true, label: 'Confirm and add' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService
  ) {
    super();
    this.userId = this.activatedRoute.snapshot.params.userId;
    this.setBackLink('Go back', this.goBackOrCancel.bind(this));
  }

  ngOnInit(): void {
    this.usersService.getUserInfo(this.userId).subscribe({
      next: user => {
        this.user = user;
        const rolesAlreadyAssigned = user.strategicRoles.map(sr => sr.role);
        this.wizard.setInboundParsedAnswers({ rolesAlreadyAssigned }).runRules();
        this.setPageTitle('Add strategic role');
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
      }
    });
  }

  onSubmitStep(action: 'previous' | 'next'): void {
    const formData = this.formEngineComponent?.getFormValues() ?? { valid: false, data: {} };
    if (action === 'next' && !formData.valid) return;

    this.wizard.addAnswers(formData.data).runRules();

    if (action === 'previous') {
      if (this.wizard.isFirstStep()) {
        this.goBackOrCancel();
      } else {
        this.wizard.previousStep();
      }
    } else {
      this.wizard.nextStep();
    }

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
    }
  }

  onGotoStep(stepNumber: number): void {
    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
  }

  onSubmitWizard(): void {
    this.submitButton = { isActive: false, label: 'Saving...' };
    const body = this.wizard.runOutboundParsing() as OutboundPayloadType;
    this.usersService.createStrategicRoles(this.userId, body).subscribe({
      next: () => {
        this.redirectTo(`/admin/users/${this.userId}`, { alert: 'strategicRoleCreationSuccess' });
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  goBackOrCancel(): void {
    if (this.wizard.isSummaryStep() || !this.wizard.isFirstStep()) {
      this.wizard.previousStep();
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.redirectTo(`/admin/users/${this.userId}`);
    }
  }
}
