export class FormEngineModel {

  label?: string;
  description?: string;
  details?: { title: string; content: string; };
  parameters: FormEngineParameterModel[];
  visibility?: {
    parameter: string,
    values: string[]
  };
  defaultData?: { [key: string]: any };

  constructor(data: FormEngineModel) {
    this.label = data.label;
    this.description = data.description;
    this.details = data.details;
    this.parameters = (data.parameters || []).map(p => new FormEngineParameterModel(p));
    this.visibility = data.visibility;
    this.defaultData = data.defaultData || {};
  }

}


export class FormEngineParameterModel {

  id: string;
  dataType: 'text' | 'textarea' | 'number' | 'password' | 'hidden' | 'checkbox-group' | 'checkbox-array' | 'radio-group' | 'fields-group';
  label?: string;
  description?: string;
  placeholder?: string;
  isVisible?: boolean;
  isEditable?: boolean;
  rank?: number;
  validations?: { // Validations accepts 2 formats. Second format allows to display a custom (translated or not) message.
    isRequired?: boolean | [boolean, string];
    pattern?: string | [string, string];
    min?: string | number;
    max?: string | number;
    minLength?: string | number;
    maxLength?: string | number;
  };
  items?: ({
    value: 'SEPARATOR' | string;
    label: 'SEPARATOR' | string;
    description?: string;
    group?: string;
    conditional?: FormEngineParameterModel
  })[];
  fieldsGroupConfig?: {
    fields: FormEngineParameterModel[];  // Used in "fields-group" dataType.
    addNewLabel?: string;
  };

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
    this.items = data.items;

    if (data.fieldsGroupConfig) {
      this.fieldsGroupConfig = {
        fields: (data.fieldsGroupConfig.fields || []).map(f => new FormEngineParameterModel(f)),
        addNewLabel: data.fieldsGroupConfig.addNewLabel
      };
    }

  }

}
