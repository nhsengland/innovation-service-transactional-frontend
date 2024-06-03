import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

import { FileTypes, TextareaLengthLimitType } from '../config/form-engine.config';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';
import {
  InnovationRecordFormComponentType,
  InnovationRecordItemsType,
  InnovationRecordMinMaxValidationType,
  InnovationRecordQuestionStepType,
  InnovationRecordStepValidationsType
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';

export class FormEngineModel {
  label?: string;
  description?: string;
  parameters: FormEngineParameterModel[];
  defaultData: Record<string, any>; // { [key: string]: any };

  constructor(data: Partial<FormEngineModel>) {
    this.label = data.label;
    this.description = data.description;
    this.parameters = (data.parameters ?? []).map(item => new FormEngineParameterModel(item));
    this.defaultData = data.defaultData ?? {};
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
    | 'select-component';
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
    urlFormat?: boolean | [boolean, string];
    equalTo?: string | [string, string];
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
  defaultData: Record<string, any>; // { [key: string]: any };

  constructor(data: Partial<FormEngineModelV3>) {
    this.label = data.label;
    this.description = data.description;
    this.parameters = (data.parameters ?? []).map(item => new FormEngineParameterModelV3(item));
    this.defaultData = data.defaultData ?? {};
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
  placeholder?: string;
  isVisible?: boolean;
  isEditable?: boolean;
  rank?: number;
  validations?: {
    // Validations accepts 2 formats. Second format allows to display a custom (translated or not) message.
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
    urlFormat?: boolean;
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

  items?: InnovationRecordItemsType;
  addQuestion?: InnovationRecordQuestionStepType;
  addNewLabel?: string;

  parentAddQuestionId?: string;
  parentFieldId?: string;

  condition?: string;
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
    this.isVisible = data.isVisible !== undefined ? data.isVisible : true;
    this.isEditable = data.isEditable !== undefined ? data.isEditable : true;
    this.rank = data.rank || 0;
    this.validations = data.validations;
    this.cssOverride = data.cssOverride;
    this.addQuestion = data.addQuestion;
    this.addNewLabel = data.addNewLabel;
    this.field = data.field;
    this.condition = data.condition;

    this.lengthLimit = data.lengthLimit;
    // this.additional = data.additional;

    // this.groupedItems = data.groupedItems;
    this.items = data.items;

    // this.selectItems = data.selectItems;

    this.parentAddQuestionId = data.parentAddQuestionId;
    this.parentFieldId = data.parentFieldId;

    // if (data.fieldsGroupConfig) {
    //   this.fieldsGroupConfig = {
    //     fields: (data.fieldsGroupConfig.fields || []).map(f => new FormEngineParameterModelV3(f)),
    //     addNewLabel: data.fieldsGroupConfig.addNewLabel
    //   };
    // }

    // this.fileUploadConfig = data.fileUploadConfig;
  }
}
