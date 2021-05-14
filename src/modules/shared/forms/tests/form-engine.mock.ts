import { FormEngineParameterModel } from '../engine/models/form-engine.models';


export const ALL_PARAMETER_TYPES_EMPTY = [
  new FormEngineParameterModel({ id: 'textField', dataType: 'text' }),
  new FormEngineParameterModel({ id: 'radioGroupField', dataType: 'radio-group' }),
  new FormEngineParameterModel({ id: 'checkboxGroupField', dataType: 'checkbox-group' }),
  new FormEngineParameterModel({ id: 'checkboxArrayField', dataType: 'checkbox-array' }),
  new FormEngineParameterModel({
    id: 'fieldsGroupField',
    dataType: 'fields-group',
    fieldsGroupConfig: {
      fields: [
        new FormEngineParameterModel({ id: 'field01', dataType: 'text'}),
        new FormEngineParameterModel({ id: 'field02', dataType: 'text'})
      ]}
  })
];


export const CHOOSABLE_PARAMETER_TYPES = [
  new FormEngineParameterModel({
    id: 'radioGroupField',
    dataType: 'radio-group',
    items: [
      { value: 'value 1', label: 'label 1' },
      { value: 'value 2', label: 'label 2' },
      { value: 'value 3', label: 'label 3' }
    ]
  }),
  new FormEngineParameterModel({
    id: 'checkboxGroupField',
    dataType: 'checkbox-group',
    items: [
      { value: 'value 1', label: 'label 1' },
      { value: 'value 2', label: 'label 2' },
      { value: 'value 3', label: 'label 3' }
    ]
  }),
  new FormEngineParameterModel({
    id: 'checkboxArrayField',
    dataType: 'checkbox-array',
    items: [
      { value: 'value 1', label: 'label 1' },
      { value: 'value 2', label: 'label 2' },
      { value: 'value 3', label: 'label 3' }
    ]
  })
];

export const CHOOSABLE_PARAMETER_TYPES_WITH_CONDITIONALS = [
  new FormEngineParameterModel({
    id: 'radioGroupField',
    dataType: 'radio-group',
    items: [
      { value: 'value 1', label: 'label 1' },
      { value: 'value 2', label: 'label 2' },
      { value: 'value 3', label: 'label 3', conditional: new FormEngineParameterModel({ id: 'textField', dataType: 'text' }) }
    ]
  })
];


export const ALL_PARAMETERS_HIDDEN = [
  new FormEngineParameterModel({
    id: 'textField',
    dataType: 'text',
    isVisible: false
  }),
  new FormEngineParameterModel({
    id: 'radioGroupField',
    dataType: 'radio-group',
    isVisible: false
  }),
  new FormEngineParameterModel({
    id: 'checkboxGroupField',
    dataType: 'checkbox-group',
    isVisible: false
  }),
  new FormEngineParameterModel({
    id: 'checkboxArrayField',
    dataType: 'checkbox-array',
    isVisible: false
  })
];


export const PARAMETERS_WITH_VALIDATIONS = [
  new FormEngineParameterModel({
    id: 'textField1',
    dataType: 'text',
    validations: {
      isRequired: false,
      pattern: '',
    }
  }),
  new FormEngineParameterModel({
    id: 'textField2',
    dataType: 'text',
    validations: {
      isRequired: true,
      pattern: '[a-z]',
      minLength: 5,
      maxLength: 10
    }
  }),
  new FormEngineParameterModel({
    id: 'textField3',
    dataType: 'text',
    validations: {
      isRequired: [true, 'is required'],
      pattern: ['[a-z]', 'wrong pattern'],
    }
  }),
  new FormEngineParameterModel({
    id: 'textField4',
    dataType: 'number',
    validations: {
      isRequired: [true, 'is required'],
      min: 10,
      max: 20
    }
  }),
  new FormEngineParameterModel({
    id: 'textField5',
    dataType: 'number',
    isVisible: false,
    validations: {
      isRequired: [true, 'is required']
    }
  }),
  new FormEngineParameterModel({
    id: 'radioGroupField',
    dataType: 'radio-group',
    items: [
      { value: 'value 1', label: 'label 1' },
      { value: 'value 2', label: 'label 2' },
      { value: 'value 3', label: 'label 3' }
    ],
    validations: {
      isRequired: [true, 'is required'],
    }
  }),
  new FormEngineParameterModel({
    id: 'checkboxGroupField',
    dataType: 'checkbox-group',
    items: [
      { value: 'value 1', label: 'label 1' },
      { value: 'value 2', label: 'label 2' },
      { value: 'value 3', label: 'label 3' }
    ],
    validations: {
      isRequired: [true, 'is required'],
    }
  }),
  new FormEngineParameterModel({
    id: 'checkboxArrayField',
    dataType: 'checkbox-array',
    items: [
      { value: 'value 1', label: 'label 1' },
      { value: 'value 2', label: 'label 2' },
      { value: 'value 3', label: 'label 3' }
    ],
    validations: {
      isRequired: [true, 'is required'],
    }
  })
];


export const PARAMETERS_VALUES = {
  textField2: 'abcdefg',
  textField3: 'abc',
  textField4: 15,
  checkboxArrayField: [true, false],
  checkboxGroupField: { 'value 1': true, 'value 2': false, 'value 3': false },
  radioGroupField: ['value 1', 'value 2']
};
