import { InnovationRecordUpdateStepOutputType } from './innovation-record-update-step.types';
import { NotificationStepOutputType } from './notification-step.types';
import { OrganisationsStepOutputType } from './organisations-step.types';
import { SupportStatusesStepOutputType } from './support-statuses-step.types';
import { UnitsStepOutputType } from './units-step.types';

export type SummaryStepInputType = {
  displayEditMode: boolean;
  notificationStep: NotificationStepOutputType;
  organisationsStep: OrganisationsStepOutputType;
  unitsStep: UnitsStepOutputType;
  supportStatusesStep: SupportStatusesStepOutputType;
  innovationRecordUpdateStep: InnovationRecordUpdateStepOutputType;
};
