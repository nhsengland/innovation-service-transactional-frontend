import { StrategicRoleEnum } from '@app/base/enums';
import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

// Labels.
const stepsLabels = {
  l1: { label: 'What strategic role would you like to add?' }
};

// Types.
type InboundPayloadType = { rolesAlreadyAssigned: StrategicRoleEnum[] };
type StepPayloadType = { roles: Record<string, boolean> };
export type OutboundPayloadType = { strategicRoles: StrategicRoleEnum[] };

export const WIZARD_ADD_STRATEGIC_ROLE: WizardEngineModel = new WizardEngineModel({
  steps: [],
  showSummary: true,
  runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType & { rolesAlreadyAssigned: StrategicRoleEnum[] }) => wizardRuntimeRules(steps, currentValues)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function wizardRuntimeRules(steps: WizardStepType[], data: StepPayloadType & { rolesAlreadyAssigned: StrategicRoleEnum[] }): void {
  steps.splice(0);

  const roles = [StrategicRoleEnum.CHAMPION, StrategicRoleEnum.SENIOR_SPONSOR];
  const roleItems = roles
    .filter(r => !data.rolesAlreadyAssigned.includes(r))
    .map(r => ({
      value: r,
      label: r === StrategicRoleEnum.CHAMPION ? 'Champion' : 'Senior sponsor'
    }));

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'roles',
          dataType: 'checkbox-group',
          label: stepsLabels.l1.label,
          validations: { isRequired: [true, 'Choose at least one role '] },
          items: roleItems
        }
      ]
    })
  );
}

function inboundParsing(data: InboundPayloadType): StepPayloadType & { rolesAlreadyAssigned: StrategicRoleEnum[] } {
  return {
    roles: {},
    rolesAlreadyAssigned: data.rolesAlreadyAssigned || []
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  const selectedRoles = Object.keys(data.roles).filter(key => data.roles[key]) as StrategicRoleEnum[];
  return {
    strategicRoles: selectedRoles
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const selectedRoles = Object.keys(data.roles).filter(key => data.roles[key]) as StrategicRoleEnum[];
  return [
    {
      label: 'Strategic role',
      value: selectedRoles
        .map(r => (r === StrategicRoleEnum.CHAMPION ? 'Champion' : 'Senior sponsor'))
        .join(', '),
      editStepNumber: 1
    }
  ];
}
