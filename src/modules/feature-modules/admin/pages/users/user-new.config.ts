import { AppInjector } from '@modules/core';

import { UserRoleEnum } from '@app/base/enums';

import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import { CtxStore } from '@modules/stores';
import { inject } from '@angular/core';
import { UserContextStore } from '@modules/stores/ctx/user/user.store';

// Labels.
const stepsLabels = {
  l1: { label: "What is the new user's email?", description: 'Enter an email with a maximum of 100 characters.' },
  l2: {
    label: 'What is the name of the new user?',
    description: 'Enter the first name and surname. This is how their name will appear on the service.'
  },
  l3: { label: 'What is their role?' },
  l4: { label: 'Which organisation is the user associated to?' },
  l5: { label: 'Which unit is the user associated to?' }
};

// Types.
type Organisation = { id: string; name: string; units: { id: string; name: string }[] };

type CreateUserInBaseInbound = { contextType: 'BASE'; organisations: Organisation[] };
type CreateUserInUnitInbound = {
  contextType: 'UNIT';
  organisations: Organisation[];
  organisationId: string;
  unitIds: string[];
};
type CreateUserInTeamInbound = { contextType: 'TEAM'; role: UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN };
type InboundPayloadType = CreateUserInBaseInbound | CreateUserInUnitInbound | CreateUserInTeamInbound;

type LogicFieldsType = {
  contextType: 'BASE' | 'UNIT' | 'TEAM';
  organisations?: Organisation[];
};
type QuestionFieldsType = {
  email?: string;
  name?: string;
  role?: UserRoleEnum.QUALIFYING_ACCESSOR | UserRoleEnum.ACCESSOR | UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN;
  organisationId?: string;
  unitIds?: string[];
};
type StepPayloadType = LogicFieldsType & QuestionFieldsType;

type CreateRolesType =
  | { role: UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN | UserRoleEnum.ACCESSOR | UserRoleEnum.QUALIFYING_ACCESSOR }
  | {
      role: UserRoleEnum.ACCESSOR | UserRoleEnum.QUALIFYING_ACCESSOR;
      organisationId: string;
      unitIds: string[];
    };
type CreateUserType = { email: string; name: string } & CreateRolesType;
export type OutboundPayloadType = CreateUserType;

// consts.
const injector = AppInjector.getInjector();
const userCtx = injector?.get(UserContextStore);

const roles = [UserRoleEnum.QUALIFYING_ACCESSOR, UserRoleEnum.ACCESSOR, UserRoleEnum.ASSESSMENT, UserRoleEnum.ADMIN];
const roleItems = roles.map(r => ({ value: r, label: userCtx?.getRoleDescription(r) }));

export const WIZARD_CREATE_USER: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'email',
          dataType: 'text',
          label: stepsLabels.l1.label,
          description: stepsLabels.l1.description,
          validations: {
            isRequired: [true, 'Email is required'],
            validEmail: true,
            maxLength: 100
          }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'name',
          dataType: 'text',
          label: stepsLabels.l2.label,
          description: stepsLabels.l2.description,
          validations: {
            isRequired: [true, 'Name is required'],
            maxLength: 100
          }
        }
      ]
    })
  ],
  showSummary: true,
  runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType) => wizardRuntimeRules(steps, currentValues)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function wizardRuntimeRules(steps: WizardStepType[], data: StepPayloadType): void {
  steps.splice(2);

  if (data.contextType === 'BASE' || data.contextType === 'UNIT') {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'role',
            dataType: 'radio-group',
            label: stepsLabels.l3.label,
            validations: { isRequired: [true, 'Choose one role'] },
            items:
              data.contextType === 'BASE'
                ? roleItems
                : roleItems.filter(
                    r => r.value === UserRoleEnum.ACCESSOR || r.value === UserRoleEnum.QUALIFYING_ACCESSOR
                  )
          }
        ]
      })
    );
  }

  if (data.role === UserRoleEnum.ASSESSMENT || data.role === UserRoleEnum.ADMIN) {
    data.organisationId = undefined;
    data.unitIds = undefined;
  } else if (data.contextType !== 'UNIT') {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'organisationId',
            dataType: 'radio-group',
            label: stepsLabels.l4.label,
            validations: { isRequired: [true, 'Organisation is required'] },
            items: (data.organisations ?? []).map(o => ({
              value: o.id,
              label: o.name
            }))
          }
        ]
      })
    );

    if (data.organisationId) {
      const organisation = (data.organisations ?? []).find(o => o.id === data.organisationId);
      const units = (organisation?.units ?? []).map(u => ({ value: u.id, label: u.name }));

      if (units.length === 1) {
        data.unitIds = units.map(u => u.value);
      } else {
        steps.push(
          new FormEngineModel({
            parameters: [
              {
                id: 'unitIds',
                dataType: 'checkbox-array',
                label: stepsLabels.l5.label,
                validations: { isRequired: [true, 'Unit is required'] },
                items: units.sort((a, b) => a.label.localeCompare(b.label))
              }
            ]
          })
        );
      }
    }
  }
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    contextType: data.contextType ?? 'BASE',
    ...(data.contextType === 'BASE' && { organisations: data.organisations }),
    ...(data.contextType === 'UNIT' && {
      organisations: data.organisations,
      organisationId: data.organisationId,
      unitIds: data.unitIds
    }),
    ...(data.contextType === 'TEAM' && { role: data.role })
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    name: data.name ?? '',
    email: data.email ?? '',
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

  toReturn.push(
    { label: 'Email', value: data.email, editStepNumber: editStepNumber++ },
    { label: 'Name', value: data.name, editStepNumber: editStepNumber++ }
  );

  const role = userCtx.getRoleDescription(data.role ?? UserRoleEnum.ASSESSMENT); // Reaching this point role will be defined

  if (data.role === UserRoleEnum.ADMIN || data.role === UserRoleEnum.ASSESSMENT) {
    toReturn.push({
      label: 'Role',
      value: role,
      editStepNumber: data.contextType === 'BASE' ? editStepNumber++ : undefined
    });
  } else {
    const org = (data.organisations ?? []).find(o => o.id === data.organisationId);
    const selectedUnits = (org?.units ?? []).filter(u => data.unitIds?.includes(u.id));

    toReturn.push({
      label: selectedUnits.length > 1 ? 'Roles' : 'Role',
      value: selectedUnits.map(u => `${role} (${u.name})`).join('\n'),
      editStepNumber
    });
  }

  return toReturn;
}
