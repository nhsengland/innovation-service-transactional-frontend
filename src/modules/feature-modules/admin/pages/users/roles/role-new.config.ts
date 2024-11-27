import { AppInjector } from '@modules/core';

import { UserRoleEnum } from '@app/base/enums';

import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import { CtxStore } from '@modules/stores';

// Labels.
const stepsLabels = {
  l1: { label: 'What is their role?' },
  l2: { label: 'Which organisation is the user associated to?' },
  l3: { label: 'Which unit is the user associated to?' }
};

// Types.
type Organisation = { id: string; name: string; units: { id: string; name: string }[] };
type UserRole = { role: UserRoleEnum; orgId?: string; unitId?: string };
type AvailableRoles = UserRoleEnum.QUALIFYING_ACCESSOR | UserRoleEnum.ACCESSOR | UserRoleEnum.ASSESSMENT;

type InboundPayloadType = {
  userRoles: UserRole[];
  organisations?: Organisation[];

  email: string;
  name: string;
  organisationId?: string;
  unitId?: string;
};

type LogicFieldsType = {
  email: string;
  name: string;

  inboundData: { orgId?: string; unitId?: string };
  organisations?: Organisation[];
  availableRoles: UserRoleEnum[];
  userRoles: UserRole[];
};
type QuestionFieldsType = {
  role?: AvailableRoles;
  organisationId?: string;
  unitIds?: string[];
};
type StepPayloadType = LogicFieldsType & QuestionFieldsType;

type CreateRolesType =
  | { role: AvailableRoles }
  | {
      role: UserRoleEnum.ACCESSOR | UserRoleEnum.QUALIFYING_ACCESSOR;
      organisationId: string;
      unitIds: string[];
    };
export type OutboundPayloadType = CreateRolesType;

// consts.
const injector = AppInjector.getInjector();
const ctx = injector?.get(CtxStore);

export const WIZARD_ADD_ROLE: WizardEngineModel = new WizardEngineModel({
  steps: [],
  showSummary: true,
  runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType) => wizardRuntimeRules(steps, currentValues)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function wizardRuntimeRules(steps: WizardStepType[], data: StepPayloadType): void {
  steps.splice(0);

  if (data.availableRoles.length > 0) {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'role',
            dataType: 'radio-group',
            label: stepsLabels.l1.label,
            validations: { isRequired: [true, 'Choose one role'] },
            items: data.availableRoles.map(r => ({ value: r, label: ctx.user?.getRoleDescription(r) }))
          }
        ]
      })
    );
  }

  if (data.role === UserRoleEnum.ASSESSMENT) {
    data.organisationId = undefined;
    data.unitIds = undefined;
  } else {
    if (!data.inboundData.orgId) {
      steps.push(
        new FormEngineModel({
          parameters: [
            {
              id: 'organisationId',
              dataType: 'radio-group',
              label: stepsLabels.l2.label,
              validations: { isRequired: [true, 'Organisation is required'] },
              items: (data.organisations ?? []).map(o => ({
                value: o.id,
                label: o.name
              }))
            }
          ]
        })
      );
    } else {
      // Fallback in case the user chooses other role that clears this field and then comes back to QA/A
      data.organisationId = data.inboundData.orgId;
    }

    if (data.organisationId && !data.inboundData.unitId) {
      const userUnits = new Set(data.userRoles.map(r => r.unitId));
      const organisation = (data.organisations ?? []).find(o => o.id === data.organisationId);
      const units = (organisation?.units ?? [])
        .filter(u => !userUnits.has(u.id))
        .map(u => ({ value: u.id, label: u.name }));

      // if the organisation has only one unit, don't show unit selection step
      if (organisation?.units.length === 1) {
        data.unitIds = units.map(u => u.value);
      } else {
        steps.push(
          new FormEngineModel({
            parameters: [
              {
                id: 'unitIds',
                dataType: 'checkbox-array',
                label: stepsLabels.l3.label,
                validations: { isRequired: [true, 'Unit is required'] },
                items: units.sort((a, b) => a.value.localeCompare(b.value))
              }
            ]
          })
        );
      }
    }
  }
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  const isAssessment = data.userRoles.some(r => r.role === UserRoleEnum.ASSESSMENT);
  const isAccessor = data.userRoles.some(
    r => r.role === UserRoleEnum.QUALIFYING_ACCESSOR || r.role === UserRoleEnum.ACCESSOR
  );

  let roles = [UserRoleEnum.QUALIFYING_ACCESSOR, UserRoleEnum.ACCESSOR, UserRoleEnum.ASSESSMENT];
  if (isAssessment) {
    roles = roles.filter(r => r !== UserRoleEnum.ASSESSMENT);
  }

  let existingRole: undefined | UserRole;
  let isAOrQaFromAllUnits: undefined | boolean;
  if (isAccessor) {
    roles = roles.filter(r => r !== UserRoleEnum.QUALIFYING_ACCESSOR && r !== UserRoleEnum.ACCESSOR);
    existingRole = data.userRoles.find(
      r => r.role === UserRoleEnum.QUALIFYING_ACCESSOR || r.role === UserRoleEnum.ACCESSOR
    );

    const nUnits = data.organisations?.find(o => o.id === (data.organisationId ?? existingRole?.orgId))?.units.length;
    isAOrQaFromAllUnits = data.userRoles.filter(r => r.role === existingRole?.role).length === nUnits;

    if (roles.includes(UserRoleEnum.ASSESSMENT) && !isAOrQaFromAllUnits) {
      roles.push(existingRole!.role);
    }
  }

  return {
    email: data.email,
    name: data.name,
    organisations: data.organisations,
    userRoles: data.userRoles,

    inboundData: { orgId: data.organisationId ?? existingRole?.orgId, unitId: data.unitId },
    availableRoles: roles,

    organisationId: data.organisationId ?? existingRole?.orgId,
    ...(!isAOrQaFromAllUnits
      ? {
          role: existingRole?.role && roles.length === 0 ? (existingRole.role as AvailableRoles) : undefined,
          unitIds: data.unitId ? [data.unitId] : undefined
        }
      : {})
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    role: data.role ?? UserRoleEnum.ASSESSMENT, // This can't happen, since role is required.
    ...((data.role === UserRoleEnum.ACCESSOR || data.role === UserRoleEnum.QUALIFYING_ACCESSOR) && {
      organisationId: data.organisationId,
      unitIds: data.unitIds
    })
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  toReturn.push({ label: 'Email', value: data.email }, { label: 'Name', value: data.name });

  const role = ctx.user.getRoleDescription(data.role!); // Reaching this point role will be defined

  if (data.role === UserRoleEnum.ASSESSMENT) {
    toReturn.push({ label: 'Role', value: role, editStepNumber: editStepNumber++ });
  } else {
    const org = (data.organisations ?? []).find(o => o.id === data.organisationId);
    const selectedUnits = (org?.units ?? []).filter(u => data.unitIds?.includes(u.id));

    toReturn.push({
      label: selectedUnits.length > 1 ? 'Roles' : 'Role',
      value: selectedUnits.map(u => `${role} (${u.name})`).join('\n'),
      editStepNumber: !data.inboundData.unitId ? editStepNumber : undefined
    });
  }

  return toReturn;
}
