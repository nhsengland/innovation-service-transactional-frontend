import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

import { FileTypes, TextareaLengthLimitType } from '../config/form-engine.config';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';

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
