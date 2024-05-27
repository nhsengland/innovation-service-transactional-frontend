import { TextareaLengthLimitType } from '@modules/shared/forms/engine/config/form-engine.config';
import { INNOVATION_SECTION_STATUS } from '../../innovation.models';
import { DateISOType, MappedObjectType } from '@app/base/types';
import { AsyncValidatorFn } from '@angular/forms';
import { dummy_schema_V3_202405 } from './ir-v3-schema';

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
  questions: InnovationRecordQuestionStepType[];
};

export type InnovationRecordQuestionStepType = {
  id: string;
  dataType: InnovationRecordFormComponentType;
  label: string;
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
  condition?: string;
  cssOverride?: string;
  isVisible?: boolean;
};

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
  urlFormat?: boolean;
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
  conditional?: {
    id: string;
    label: string;
    description?: string;
    dataType: any;
    validations: InnovationRecordStepValidationsType;
    isVisible?: boolean;
    cssOverride?: string;
    placeholder?: string;
    items?: any;
  };
  group?: string;
  type?: string;
  itemsFromAnswer?: string;
}[];

export type InnovationRecordSectionAnswersType = {
  [s: string]: string | string[] | { response: string; conditional: string };
};

export const dummy_202405_sections = dummy_schema_V3_202405.sections.map(section => ({
  id: section.id,
  title: section.title,
  subsections: section.subSections.map(subsection => ({ id: subsection.id, title: subsection.title }))
}));

export type SectionsSummaryModelV3Type = {
  id: string;
  title: string;
  sections: {
    id: string;
    title: string;
    status: keyof typeof INNOVATION_SECTION_STATUS;
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
  status: keyof typeof INNOVATION_SECTION_STATUS;
  updatedAt: string;
  data: MappedObjectType;
  submittedAt: string;
  submittedBy: null | {
    name: string;
    isOwner?: boolean;
  };
  tasksIds?: string[];
};
