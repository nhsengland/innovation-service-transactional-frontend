import { TextareaLengthLimitType } from '@modules/shared/forms/engine/config/form-engine.config';
import { DateISOType, MappedObjectType } from '@app/base/types';
import { AsyncValidatorFn } from '@angular/forms';
import { FormEngineParameterModelV3 } from '@modules/shared/forms';
import { FormatUrlValidatorType } from '@modules/shared/forms/engine/models/form-engine.models';
import { InnovationSectionStatusEnum } from '../../innovation.enums';

export type InnovationRecordSchemaV3Type = {
  sections: {
    id: string;
    title: string;
    subSections: InnovationRecordSubSectionType[];
  }[];
};

export type InnovationRecordSubSectionType = {
  id: string;
  title: string;
  steps: InnovationRecordStepType[];
  stepsChildParentRelations?: MappedObjectType;
  hasFiles?: boolean;
};

export type InnovationRecordStepType = {
  questions: InnovationRecordQuestionStepType[];
  condition?: InnovationRecordConditionType;
};

export type InnovationRecordConditionType = {
  id: string;
  options: string[];
};

export type InnovationRecordQuestionStepType = {
  id: string;
  dataType: InnovationRecordFormComponentType;
  label: string;
  checkboxAnswerId?: string;
  parentId?: string;
  description?: string;
  field?: {
    id: string;
    dataType: 'text';
    label: string;
    validations: InnovationRecordStepValidationsType;
  };
  addNewLabel?: string;
  addQuestion?: InnovationRecordQuestionStepType;
  validations?: InnovationRecordStepValidationsType;
  lengthLimit?: TextareaLengthLimitType;
  items?: InnovationRecordItemsType;
  condition?: InnovationRecordConditionType;
  cssOverride?: string;
  isHidden?: boolean;
};

export type nestedObjectAnswer = [{ [key: string]: string }];

export type arrStringAnswer = string[];

export type InnovationRecordFormComponentType =
  | 'text'
  | 'textarea'
  | 'radio-group'
  | 'autocomplete-array'
  | 'checkbox-array'
  | 'fields-group';

export type InnovationRecordStepValidationsType = {
  isRequired?: string;
  min?: InnovationRecordMinMaxValidationType;
  max?: InnovationRecordMinMaxValidationType;
  maxLength?: number;
  minLength?: number;
  postcodeFormat?: boolean;
  urlFormat?: FormatUrlValidatorType;
  pattern?: string | [string, string];
  equalToLength?: number | [number, string];
  async?: AsyncValidatorFn[];
  existsIn?: string[] | [string[], string];
  validEmail?: string;
  equalTo?: string | [string, string];
};

export type InnovationRecordFieldGroupAnswerType = {
  [id: string]: string;
}[];

export type InnovationRecordMinMaxValidationType = { length: number; errorMessage: string };

export type InnovationRecordItemsType = {
  id?: string;
  label?: string;
  description?: string;
  exclusive?: boolean;
  conditional?: FormEngineParameterModelV3;
  group?: string;
  type?: string;
  itemsFromAnswer?: string;
}[];

export type InnovationRecordSectionAnswersType = {
  [s: string]: string | string[] | { response: string; conditional: string };
};

export type SectionsSummaryModelV3Type = {
  id: string;
  title: string;
  sections: {
    id: string;
    title: string;
    status: InnovationSectionStatusEnum;
    submittedAt: null | DateISOType;
    submittedBy: null | {
      name: string;
      isOwner?: boolean;
    };
    isCompleted: boolean;
    openTasksCount: number;
  }[];
}[];

export type InnovationSectionInfoDTOV3Type = {
  id: null | string;
  section: string;
  status: InnovationSectionStatusEnum;
  updatedAt: string;
  data: MappedObjectType;
  submittedAt: string;
  submittedBy: null | {
    name: string;
    isOwner?: boolean;
  };
  tasksIds?: string[];
};
