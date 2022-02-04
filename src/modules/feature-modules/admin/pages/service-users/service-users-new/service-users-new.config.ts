
import { Validators } from '@angular/forms';
import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';

// Types.
type InboundPayloadType = {
  organisationUnitList: { acronym: string, name: string, units: { acronym: string, name: string }[] }[],
  service: ServiceUsersService
};

type StepPayloadType = {
  email: string,
  name: string,
  type: null | 'ASSESSMENT' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR',
  organisationAcronym?: null | string, // Only for QA, A
  role?: null | 'QUALIFYING_ACCESSOR' | 'ACCESSOR', // Only for QA, A
  organisationUnitAcronym?: null | string, // Only for A
  organisationUnitList: { acronym: string, name: string, units: { acronym: string, name: string }[] }[],
  service: ServiceUsersService
};

type OutboundPayloadType = {
  email: string,
  name: string,
  type: null | 'ASSESSMENT' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR',
  organisationAcronym?: null | string, // Only for QA, A
  role?: null | 'QUALIFYING_ACCESSOR' | 'ACCESSOR', // Only for QA, A
  organisationUnitAcronym?: null | string, // Only for A
};

// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let CREATE_NEW_USER_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [

    new FormEngineModel({
      parameters: [{
        id: 'name',
        dataType: 'text',
        label: 'Kindly provide Name',
        description: 'name?',
        validations: { isRequired: [true, 'Name is required'] }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'type',
        dataType: 'radio-group',
        label: 'Kindly select appropriate user type',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'ASSESSMENT', label: 'Needs Accessor' },
          { value: 'QUALIFYING_ACCESSOR', label: 'Qualifying Accessor'},
          { value: 'ACCESSOR', label: 'Accessor' },
        ]
      }]
    })

  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});


function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {
  // Backup current organisation shares items.
  const organisationAcronym = steps.find(s => s.parameters[0].id === 'organisationAcronym')?.parameters[0].items;
  // const organisationUnitAcronym = steps.find(s => s.parameters[0].id === 'organisationUnitAcronym')?.parameters[0].items;

  steps.splice(2);

  steps.splice(0, 0,  new FormEngineModel({
    parameters: [{
      id: 'email',
      dataType: 'text',
      label: 'Kindly provide Email Id',
      description: 'emailId?',
      validations: { isRequired: [true, 'Email Id is required'] },
      syncValidation: [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      asyncValidator: [data.service.userValidator()],
      updateOn: "blur"
    }]
  }));

  if (data.type === 'ASSESSMENT') {
    data.organisationAcronym = null;
    data.organisationUnitAcronym = null;
    data.role = null;
  } else {

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'organisationAcronym',
          dataType: 'radio-group',
          label: 'Kindly select organisation?',
          validations: { isRequired: [true, 'Organisation is required'] },
          items: organisationAcronym
        }]
      })

    );

  }

  if (data.type  === 'ACCESSOR' || data.type === 'QUALIFYING_ACCESSOR') {
    const unitsList = (data.organisationUnitList.find((org) => (org.acronym === data.organisationAcronym))?.units.map(units => ({ value: units.acronym, label: units.name })));
    if (unitsList !== undefined ) {
      if ((unitsList as []).length > 1) {
      steps.push(
        new FormEngineModel({
          parameters: [{
            id: 'organisationUnitAcronym',
            dataType: 'radio-group',
            label: 'Kindly select unit?',
            validations: { isRequired: [true, 'Unit is required'] },
            items: unitsList
          }]
        }),
      );
      }
      else {
        data.organisationUnitAcronym = unitsList?.length ? unitsList[0].value : null;
      }
    }
  }

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    email: '',
    name: '',
    type: null,
    organisationAcronym: null,
    organisationUnitAcronym: null,
    role : null,
    organisationUnitList: data.organisationUnitList,
    service: data.service
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  if (data.type === 'ACCESSOR') {
    data.role = 'ACCESSOR';
  }

  if(data.type === 'QUALIFYING_ACCESSOR') {
    data.role = 'QUALIFYING_ACCESSOR';
    data.type = 'ACCESSOR';
  }

  // const unit = data.organisationList.find((org) => (org.acronym === data.organisationUnitAcronym && org.units.length < 1))
  // ?.units.filter((unit: string) => unit.acronym);


  return {
    name: data.name,
    email: data.email,
    type: data.type,
    role: data.role,
    organisationAcronym: data.organisationAcronym,
    organisationUnitAcronym: data.organisationUnitAcronym
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];
  const organisationAcronym = steps.find(s => s.parameters[0].id === 'organisationAcronym')?.parameters[0].items;

  toReturn.push(
    { label: 'Email Id', value: data.email, editStepNumber: 1 },
    { label: 'User Name', value: data.name, editStepNumber: 2 },
    { label: 'User Type', value: data.type === 'QUALIFYING_ACCESSOR' ? 'Qualifying Accessor' : data.type === 'ACCESSOR' ? 'Accessor' : 'Needs Accessor', editStepNumber: 3 }
  );

  let lastMarkStep = 3;

  if (data.type === 'QUALIFYING_ACCESSOR' || data.type === 'ACCESSOR') {
    const orgAcronym: { [key: string]: any }[0] = organisationAcronym?.filter((item) => (data.organisationAcronym === item.value))[0];

    toReturn.push(
        { label: 'Organisation', value: orgAcronym.label === null ? 'NA' : orgAcronym.label, editStepNumber: 4 },
        { label: 'Role', value: data.type === 'QUALIFYING_ACCESSOR' ? 'Qualifying Accessor' : data.type === 'ACCESSOR' ? 'Accessor' : '', editStepNumber: 5 }
    );

    const unitsList = (data.organisationUnitList.find((org) => (org.acronym === data.organisationAcronym))?.units.map(units => ({ value: units.acronym, label: units.name })));
    if (unitsList !== undefined ) {
      if ((unitsList as []).length > 1){
        const organisationUnitAcronym = steps.find(s => s.parameters[0].id === 'organisationUnitAcronym')?.parameters[0].items;
        const orgUnitAcronym: { [key: string]: any }[0] = organisationUnitAcronym?.filter((item) => (data.organisationUnitAcronym === item.value))[0];
        toReturn.push(
          { label: 'Organisation Unit', value: orgUnitAcronym.label === null ? 'NA' : orgUnitAcronym.label, editStepNumber: 6 }
        );
      }
      else {
      toReturn.push(
        { label: 'Organisation Unit', value: unitsList?.length ? unitsList[0].label : '', editStepNumber: 6 }
      );
      }
    }
    lastMarkStep = 6;
  }
  return toReturn;
}
