import { NgModule } from '@angular/core';

import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { InnovatorRoutingModule } from './innovator-routing.module';

// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Pages.
// // Account.
import { PageAccountDeleteComponent } from './pages/account/account-delete.component';
// // Collaboration Invites.
import { PageCollaborationInviteComponent } from './pages/collaboration-invite/collaboration-invite.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // First time signin.
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
// // Innovation.
import { InnovationNewComponent } from './pages/innovation-new/innovation-new.component';
import { InnovationDataSharingChangeComponent } from './pages/innovation/data-sharing/data-sharing-change.component';
import { PageInnovationExportRequestRejectComponent } from './pages/innovation/export-requests/export-request-reject.component';
import { PageInnovationHowToProceedComponent } from './pages/innovation/how-to-proceed/how-to-proceed.component';
import { PageInnovationRecommendNeedsReassessmentComponent } from './pages/innovation/how-to-proceed/recommend-need-reassessment/recommend-needs-reassessment';
import { WizardInnovationHowToProceedArchiveComponent } from './pages/innovation/how-to-proceed/wizard-how-to-proceed-archive/how-to-proceed-archive.component';
import { PageInnovationManageAccessLeaveInnovationComponent } from './pages/innovation/manage-access/manage-access-leave-innovation.component';
import { PageInnovationManageAccessOverviewComponent } from './pages/innovation/manage-access/manage-access-overview.component';
import { PageInnovationManageCollaboratorsInfoComponent } from './pages/innovation/manage/manage-collaborators-info.component';
import { PageInnovationManageCollaboratorsOverviewComponent } from './pages/innovation/manage/manage-collaborators-overview.component';
import { PageInnovationManageCollaboratorsWizardComponent } from './pages/innovation/manage/manage-collaborators-wizard.component';
import { PageInnovationManageOverviewComponent } from './pages/innovation/manage/manage-overview.component';
import { PageInnovationManageTransferComponent } from './pages/innovation/manage/manage-transfer.component';
import { WizardInnovationManageArchiveComponent } from './pages/innovation/manage/wizard-manage-archive/manage-archive.component';
import { WizardInnovationManageArchiveConfirmationStepComponent } from './pages/innovation/manage/wizard-manage-archive/steps/confirmation-step.component';
import { WizardInnovationManageArchiveOverviewStepComponent } from './pages/innovation/manage/wizard-manage-archive/steps/overview-step.component';
import { WizardInnovationManageArchiveReasonStepComponent } from './pages/innovation/manage/wizard-manage-archive/steps/reason-step.component';
import { PageInnovationNeedsReassessmentSendComponent } from './pages/innovation/needs-reassessment/needs-reassessment-send.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationDataSharingEditComponent } from './pages/innovation/record/data-sharing-edit.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';
import { InnovationSectionSubmittedComponent } from './pages/innovation/record/section-submitted.component';
import { EndSupportSurveyJourneyComponent } from './pages/innovation/surveys/journeys/end-support.component';
import { PageInnovationSupportSurveysComponent } from './pages/innovation/surveys/support-surveys.component';

// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';
import { ManageGuard } from './guards/manage.guard';
import { ShareInnovationRecordGuard } from './guards/share-innovation-record.guard';

// Services.
import { AnnouncementsService } from '../announcements/services/announcements.service';
import { InnovatorDataSharingInfoComponent } from './base/data-sharing-info.component';
import { InnovatorService } from './services/innovator.service';

import { InnovationRecordSidebarComponent } from '@modules/shared/components/innovation-record-sidebar/innovation-record-sidebar.component';

@NgModule({
  imports: [ThemeModule, SharedModule, InnovatorRoutingModule, InnovationRecordSidebarComponent, InnovatorDataSharingInfoComponent],
  declarations: [
    // Base.
    ContextInnovationOutletComponent,
    SidebarAccountMenuOutletComponent,
    SidebarInnovationMenuOutletComponent,

    // Pages.
    // // Account.
    PageAccountDeleteComponent,

    // // Collaboration invites.
    PageCollaborationInviteComponent,
    // // Dashboard.
    PageDashboardComponent,
    // // First time signin.
    FirstTimeSigninComponent,
    // // Innovation.
    InnovationDataSharingChangeComponent,
    PageInnovationExportRequestRejectComponent,
    PageInnovationHowToProceedComponent,
    PageInnovationManageCollaboratorsInfoComponent,
    PageInnovationManageCollaboratorsOverviewComponent,
    PageInnovationManageCollaboratorsWizardComponent,
    PageInnovationManageOverviewComponent,
    PageInnovationManageTransferComponent,
    PageInnovationNeedsReassessmentSendComponent,
    InnovationOverviewComponent,
    InnovationSectionEvidenceEditComponent,
    InnovationSectionEditComponent,
    InnovationSectionSubmittedComponent,
    InnovationNewComponent,
    PageInnovationManageAccessOverviewComponent,
    PageInnovationManageAccessLeaveInnovationComponent,
    InnovationDataSharingEditComponent,
    PageInnovationRecommendNeedsReassessmentComponent,
    WizardInnovationManageArchiveComponent,
    WizardInnovationManageArchiveOverviewStepComponent,
    WizardInnovationManageArchiveReasonStepComponent,
    WizardInnovationManageArchiveConfirmationStepComponent,
    WizardInnovationHowToProceedArchiveComponent,
    PageInnovationSupportSurveysComponent,
    EndSupportSurveyJourneyComponent
  ],
  providers: [
    // Guards.
    FirstTimeSigninGuard,
    ManageGuard,
    ShareInnovationRecordGuard,

    // Services.
    InnovatorService,
    AnnouncementsService
  ]
})
export class InnovatorModule {}
