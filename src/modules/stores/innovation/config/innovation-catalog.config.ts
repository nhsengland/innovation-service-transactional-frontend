import { FormEngineParameterModel } from '@modules/shared/forms';


export const locationItems = [
  {
    value: 'England',
    label: 'England',
    conditional: new FormEngineParameterModel({ id: 'englandPostCode', dataType: 'text', label: 'First part of your postcode', description: 'For example SW1', validations: { isRequired: [true, 'First part of your postcode is required'] } })
  },
  { value: 'Scotland', label: 'Scotland' },
  { value: 'Wales', label: 'Wales' },
  { value: 'Northern Ireland', label: 'Northern Ireland' },
  { value: '', label: 'SEPARATOR' },
  {
    value: 'Based outside UK',
    label: 'I\'m based outside of the UK',
    conditional: new FormEngineParameterModel({ id: 'locationCountryName', dataType: 'text', label: 'Country', validations: { isRequired: [true, 'Country is required'] } })
  }
];
