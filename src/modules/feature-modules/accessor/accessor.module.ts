import { NgModule } from '@angular/core';

import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AccessorRoutingModule } from './accessor-routing.module';

// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Pages.
// // Account.
import { AccountManageCustomNotificationsComponent } from './pages/account/manage-custom-notifications/manage-custom-notifications.component';
// // Tasks.
import { TasksListComponent } from './pages/tasks/tasks-list.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationCustomNotificationsComponent } from './pages/innovation/custom-notifications/custom-notifications.component';
import { WizardInnovationCustomNotificationDeleteComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-delete/custom-notification-delete.component';
import { WizardInnovationCustomNotificationDeleteInnovationStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-delete/steps/innovation-step.component';
import { WizardInnovationCustomNotificationDeleteNotificationsStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-delete/steps/notifications-step.component';
import { WizardInnovationCustomNotificationDeleteSummaryStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-delete/steps/summary-step.component';
import { WizardInnovationCustomNotificationNewComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/custom-notification-new.component';
import { WizardInnovationCustomNotificationNewDateStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/steps/date-step.component';
import { WizardInnovationCustomNotificationNewInnovationRecordUpdateStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/steps/innovation-record-update-step.component';
import { WizardInnovationCustomNotificationNewNotificationStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/steps/notification-step.component';
import { WizardInnovationCustomNotificationNewOrganisationsStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/steps/organisations-step.component';
import { WizardInnovationCustomNotificationNewReminderStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/steps/reminder-step.component';
import { WizardInnovationCustomNotificationNewSummaryStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/steps/summary-step.component';
import { WizardInnovationCustomNotificationNewSupportStatusesStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/steps/support-statuses-step.component';
import { WizardInnovationCustomNotificationNewUnitsStepComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/steps/units-step.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './pages/innovation/support/organisations-support-status-suggest.component';
import { InnovationSupportRequestUpdateStatusComponent } from './pages/innovation/support/support-request-update-status.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support/support-update.component';
import { InnovationsNeedingActionComponent } from './pages/innovations-needing-action/innovations-needing-action.component';
import { InnovationsReviewComponent } from './pages/innovations/innovations-review.component';
import { InnovationSupportOrganisationReferralCriteriaComponent } from './pages/organisation-referral-criteria/organisation-referral-criteria.component';
// Services.
import { AnnouncementsService } from '../announcements/services/announcements.service';
import { InnovationChangeAccessorsComponent } from './pages/innovation/support/support-change-accessors.component';
import { TrainingAndResourcesComponent } from './pages/training-and-resources/training-and-resources/training-and-resources.component';
import { AccessorAndInnovationListComponent } from './pages/unit/accessor-and-innovation-list.component';
import { AccessorService } from './services/accessor.service';

import { InnovationRecordSidebarComponent } from '@modules/shared/components/innovation-record-sidebar/innovation-record-sidebar.component';
import { InnovatorContactDetailsComponent } from '@modules/shared/components/innovator-contact-details/innovator-contact-details.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    AccessorRoutingModule,
    InnovationRecordSidebarComponent,
    InnovatorContactDetailsComponent
  ],
  declarations: [
    // Base.
    ContextInnovationOutletComponent,
    SidebarAccountMenuOutletComponent,
    SidebarInnovationMenuOutletComponent,

    // // Account.
    AccountManageCustomNotificationsComponent,
    // // Actions.
    TasksListComponent,
    // // Dashboard.
    DashboardComponent,
    // // Innovation.
    InnovationOverviewComponent,
    InnovationSupportOrganisationsSupportStatusSuggestComponent,
    InnovationSupportUpdateComponent,
    InnovationSupportRequestUpdateStatusComponent,
    InnovationChangeAccessorsComponent,
    InnovationsReviewComponent,
    InnovationSupportOrganisationReferralCriteriaComponent,
    InnovationsNeedingActionComponent,
    InnovationCustomNotificationsComponent,
    WizardInnovationCustomNotificationNewComponent,
    WizardInnovationCustomNotificationNewNotificationStepComponent,
    WizardInnovationCustomNotificationNewOrganisationsStepComponent,
    WizardInnovationCustomNotificationNewUnitsStepComponent,
    WizardInnovationCustomNotificationNewSupportStatusesStepComponent,
    WizardInnovationCustomNotificationNewInnovationRecordUpdateStepComponent,
    WizardInnovationCustomNotificationNewReminderStepComponent,
    WizardInnovationCustomNotificationNewDateStepComponent,
    WizardInnovationCustomNotificationNewSummaryStepComponent,
    WizardInnovationCustomNotificationDeleteComponent,
    WizardInnovationCustomNotificationDeleteInnovationStepComponent,
    WizardInnovationCustomNotificationDeleteNotificationsStepComponent,
    WizardInnovationCustomNotificationDeleteSummaryStepComponent,
    // // Training.
    TrainingAndResourcesComponent,
    // // Unit
    AccessorAndInnovationListComponent
  ],
  providers: [
    // Services.
    AccessorService,
    AnnouncementsService
  ]
})
export class AccessorModule { }
