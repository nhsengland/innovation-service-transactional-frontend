import { AsyncValidatorFn } from '@angular/forms';

import { FileTypes, TextareaLengthLimitType } from '../config/form-engine.config';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';
import {
  InnovationRecordFormComponentType,
  InnovationRecordMinMaxValidationType,
  InnovationRecordQuestionStepType,
  InnovationRecordStepValidationsType
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';

export class FormEngineModel {
  label?: string;
  description?: string;
  showParamLabelAsTitle?: boolean;
  parameters: FormEngineParameterModel[];

  constructor(data: Partial<FormEngineModel>) {
    this.label = data.label;
    this.description = data.description;
    this.showParamLabelAsTitle = data.showParamLabelAsTitle;
    this.parameters = (data.parameters ?? []).map(item => new FormEngineParameterModel(item));
  }
}
export class FormEngineParameterModel {
  id: string;
  dataType:
    | 'text'
    | 'textarea'
    | 'number'
    | 'password'
    | 'hidden'
    | 'date'
    | 'autocomplete-array'
    | 'checkbox-group'
    | 'checkbox-array'
    | 'grouped-checkbox-array'
    | 'radio-group'
    | 'fields-group'
    | 'file-upload'
    | 'file-upload-array'
    | 'select-component'
    | 'date-input'
    | 'ir-selectable-filters';
  label?: string;
  description?: string;
  placeholder?: string;
  isVisible?: boolean;
  isEditable?: boolean;
  rank?: number;
  validations?: {
    // Validations accepts 2 formats. Second format allows to display a custom (translated or not) message.
    isRequired?: boolean | [boolean, string];
    pattern?: string | [string, string];
    min?: number | [number, string];
    max?: number | [number, string];
    minLength?: number;
    maxLength?: number;
    equalToLength?: number | [number, string];
    async?: AsyncValidatorFn[];
    existsIn?: string[] | [string[], string];
    validEmail?: boolean | [boolean, string];
    postcodeFormat?: boolean | [boolean, string];
    urlFormat?: { message?: string; maxLength?: number };
    equalTo?: string | [string, string];
    requiredDateInput?: { message?: string };
    dateInputFormat?: { message?: string };
    futureDateInput?: { includeToday: boolean; message?: string };
    endDateInputGreaterThanStartDate?: { startDate: { day: string; month: string; year: string }; message?: string };
  };
  lengthLimit?: TextareaLengthLimitType;
  cssOverride?: string;

  additional?: FormEngineParameterModel[];

  groupedItems?: {
    // Used in "grouped-checkbox-array" dataType.
    value: string;
    label: string;
    description?: string;
    isEditable?: boolean;
    items: {
      value: string;
      label: string;
      description?: string;
      isEditable?: boolean;
    }[];
  }[];

  items?: {
    value: 'SEPARATOR' | string;
    label: 'SEPARATOR' | string;
    description?: string;
    group?: string;
    conditional?: FormEngineParameterModel;
    exclusive?: boolean;
  }[];

  fieldsGroupConfig?: {
    fields: FormEngineParameterModel[]; // Used in "fields-group" dataType.
    addNewLabel?: string;
  };

  fileUploadConfig?: {
    httpUploadUrl: string;
    httpUploadBody?: Record<string, {}>;
    acceptedFiles?: FileTypes[];
    maxFileSize?: number; // In Mb.
    previousUploadedFiles?: { id: string; name: string }[];
  };

  selectItems?: { selectList: SelectComponentInputType[]; defaultKey: string };

  constructor(data: FormEngineParameterModel) {
    this.id = data.id;
    this.dataType = data.dataType || 'text';
    this.label = data.label;
    this.description = data.description;
    this.placeholder = data.placeholder;
    this.isVisible = data.isVisible !== undefined ? data.isVisible : true;
    this.isEditable = data.isEditable !== undefined ? data.isEditable : true;
    this.rank = data.rank || 0;
    this.validations = data.validations;
    this.cssOverride = data.cssOverride;

    this.lengthLimit = data.lengthLimit;
    this.additional = data.additional;

    this.groupedItems = data.groupedItems;
    this.items = data.items;

    this.selectItems = data.selectItems;

    if (data.fieldsGroupConfig) {
      this.fieldsGroupConfig = {
        fields: (data.fieldsGroupConfig.fields || []).map(f => new FormEngineParameterModel(f)),
        addNewLabel: data.fieldsGroupConfig.addNewLabel
      };
    }

    this.fileUploadConfig = data.fileUploadConfig;
  }
}

export class FormEngineModelV3 {
  label?: string;
  description?: string;
  parameters: FormEngineParameterModelV3[];

  constructor(data: FormEngineModelV3) {
    this.label = data.label;
    this.description = data.description;
    this.parameters = (data.parameters ?? []).map(item => new FormEngineParameterModelV3(item));
  }
}

export class FormEngineParameterModelV3 {
  id: string;
  dataType: InnovationRecordFormComponentType;
  // | 'number'
  // | 'password'
  // | 'hidden'
  // | 'date'
  // | 'checkbox-group'
  // | 'grouped-checkbox-array'
  // | 'file-upload'
  // | 'file-upload-array'
  // | 'select-component';
  label?: string;
  description?: string;
  checkboxAnswerId?: string;
  parentId?: string;
  placeholder?: string;
  isHidden?: boolean;
  isEditable?: boolean;
  rank?: number;
  validations?: {
    isRequired?: string;
    pattern?: string | [string, string];
    min?: InnovationRecordMinMaxValidationType;
    max?: InnovationRecordMinMaxValidationType;
    minLength?: number;
    maxLength?: number;
    equalToLength?: number | [number, string];
    async?: AsyncValidatorFn[];
    existsIn?: string[] | [string[], string];
    validEmail?: string;
    postcodeFormat?: boolean;
    urlFormat?: { message?: string; maxLength?: number };
    equalTo?: string | [string, string];
  };
  lengthLimit?: TextareaLengthLimitType;
  cssOverride?: string;

  additional?: FormEngineParameterModelV3[];

  groupedItems?: {
    // Used in "grouped-checkbox-array" dataType.
    value: string;
    label: string;
    description?: string;
    isEditable?: boolean;
    items: {
      value: string;
      label: string;
      description?: string;
      isEditable?: boolean;
    }[];
  }[];

  items?: {
    id?: string;
    label?: string;
    description?: string;
    exclusive?: boolean;
    conditional?: FormEngineParameterModelV3;
    group?: string;
    type?: string;
    itemsFromAnswer?: string;
  }[];
  addQuestion?: InnovationRecordQuestionStepType;
  addNewLabel?: string;

  isNestedField?: boolean;

  condition?: {
    id: string;
    options: string[];
  };

  field?: {
    id: string;
    dataType: InnovationRecordFormComponentType;
    label: string;
    validations: InnovationRecordStepValidationsType;
  };

  // fieldsGroupConfig?: {
  //   fields: FormEngineParameterModelV3[]; // Used in "fields-group" dataType.
  //   addNewLabel?: string;
  // };

  // fileUploadConfig?: {
  //   httpUploadUrl: string;
  //   httpUploadBody?: Record<string, {}>;
  //   acceptedFiles?: FileTypes[];
  //   maxFileSize?: number; // In Mb.
  //   previousUploadedFiles?: { id: string; name: string }[];
  // };

  // selectItems?: { selectList: SelectComponentInputType[]; defaultKey: string };

  constructor(data: FormEngineParameterModelV3) {
    this.id = data.id;
    this.dataType = data.dataType || 'text';
    this.label = data.label;
    this.description = data.description;
    this.placeholder = data.placeholder;
    this.isHidden = data.isHidden ?? false;
    this.isEditable = data.isEditable !== undefined ? data.isEditable : true;
    this.rank = data.rank || 0;
    this.validations = data.validations;
    this.cssOverride = data.cssOverride;
    this.addQuestion = data.addQuestion;
    this.addNewLabel = data.addNewLabel;
    this.field = data.field;
    this.condition = data.condition;
    this.lengthLimit = data.lengthLimit;
    this.items = data.items;
    this.isNestedField = data.isNestedField;
    this.checkboxAnswerId = data.checkboxAnswerId;
    this.parentId = data.parentId;

    // this.additional = data.additional;

    // this.groupedItems = data.groupedItems;

    // this.selectItems = data.selectItems;

    // this.fileUploadConfig = data.fileUploadConfig;
  }
}
