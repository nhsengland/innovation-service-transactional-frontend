/* istanbul ignore file */
// TODO: create tests.

// This component is not in use at the moment.
// It is the same approach as the FormInputAutocompleteArrayComponent, but holds just 1 value.
// It was NOT thouroughly tested!
// Example of usage at the end of this file.
import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  Injector
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';
import { UtilsHelper } from '@app/base/helpers';

import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';

import { FormEngineParameterModel } from '../engine/models/form-engine.models';

@Component({
  selector: 'theme-form-input-autocomplete-value',
  templateUrl: './input-autocomplete-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputAutocompleteValueComponent),
      multi: true
    }
  ]
})
export class FormInputAutocompleteValueComponent extends ControlValueAccessorComponent implements OnInit {
  @Input() id?: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input() items: FormEngineParameterModel['items'] = [];
  @Input() pageUniqueField? = true;

  placeholder = '';
  optionsList: { value: string; label: string }[] = [];
  filteredItems$: Observable<{ value: string; label: string }[]> = of([]);

  hasError = false;
  error: { message: string; params: { [key: string]: string } } = { message: '', params: {} };

  // Accessibility.
  get ariaDescribedBy(): null | string {
    let s = '';
    if (this.description) {
      s += `hint-${this.id}`;
    }
    if (this.hasError) {
      s += `${s ? ' ' : ''}error-${this.id}`;
    }
    return s || null;
  }

  anyConditionalField?: FormEngineParameterModel;

  conditionalFormControl(f: string): FormControl {
    return this.parentFieldControl?.get(f) as FormControl;
  }

  isConditionalFieldVisible(conditionalFieldId: string): boolean {
    return (
      (this.items || []).filter(
        item => item.value === this.fieldControl.value && item.conditional?.id === conditionalFieldId
      ).length > 0
    );
  }

  isConditionalFieldError(f: string): boolean {
    const control = this.conditionalFormControl(f);
    return control.invalid && (control.touched || control.dirty);
  }

  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.id = this.id || RandomGeneratorHelper.generateRandom();

    this.filteredItems$ = this.fieldControl.valueChanges.pipe(map(value => this._filter(value)));

    this.anyConditionalField = this.items?.find(i => i.conditional)?.conditional;
  }

  onInputBlur(): void {
    // this.hasError = (this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty));
    this.hasError = !this.items?.map(i => i.label).includes(this.fieldControl.value);
    this.error = this.hasError ? { message: 'Invalid value chosen', params: {} } : { message: '', params: {} };
    this.cdr.detectChanges();
  }

  private _filter(value: string): { value: string; label: string }[] {
    if (value.length < 2) {
      return [];
    }

    const filteredValues = UtilsHelper.arrayFullTextSearch(this.items?.map(i => i.label) || [], value);

    return (this.items || []).filter(i => filteredValues.includes(i.label));
  }
}

// new FormEngineModel({
//   parameters: [{
//     id: 'aTest',
//     dataType: 'autocomplete',
//     label: 'Auto complete test component',
//     description: 'Start typing to be able to choose an option',
//     validations: { isRequired: [true, 'The field is required'] },
//     items: [
//       { value: 'Blood and immune system conditions', label: 'Blood and immune system conditions' },
//       { value: 'Blood and immune system conditions - Allergies', label: 'Blood and immune system conditions - Allergies' },
//       { value: 'Blood and immune system conditions - Anaphylaxis', label: 'Blood and immune system conditions - Anaphylaxis' },
//       { value: 'Blood and immune system conditions - Blood and bone marrow cancers', label: 'Blood and immune system conditions - Blood and bone marrow cancers' },
//       { value: 'Blood and immune system conditions - Blood conditions', label: 'Blood and immune system conditions - Blood conditions' },
//       { value: 'Blood and immune system conditions - Coeliac disease', label: 'Blood and immune system conditions - Coeliac disease' },
//       { value: 'Blood and immune system conditions - Lymphoedema', label: 'Blood and immune system conditions - Lymphoedema' },
//       { value: 'Blood and immune system conditions - Systemic lupus erythematosus', label: 'Blood and immune system conditions - Systemic lupus erythematosus' },
//       { value: 'Cancer', label: 'Cancer' },
//       { value: 'Cancer - Bladder cancer', label: 'Cancer - Bladder cancer' },
//       { value: 'Cancer - Blood and bone marrow cancers', label: 'Cancer - Blood and bone marrow cancers' },
//       { value: 'Cancer - Brain cancers', label: 'Cancer - Brain cancers' },
//       { value: 'Cancer - Breast cancer', label: 'Cancer - Breast cancer' },
//       { value: 'Cancer - Cervical cancer', label: 'Cancer - Cervical cancer' },
//       { value: 'Cancer - Colorectal cancer', label: 'Cancer - Colorectal cancer' },
//       { value: 'Cancer - Complications of cancer', label: 'Cancer - Complications of cancer' },
//       { value: 'Cancer - Endometrial cancers', label: 'Cancer - Endometrial cancers' },
//       { value: 'Cancer - Head and neck cancers', label: 'Cancer - Head and neck cancers' },
//       { value: 'Cancer - Liver cancers', label: 'Cancer - Liver cancers' },
//       { value: 'Cancer - Lung cancer', label: 'Cancer - Lung cancer' },
//       { value: 'Cancer - Metastases', label: 'Cancer - Metastases' },
//       { value: 'Cancer - Oesophageal cancer', label: 'Cancer - Oesophageal cancer' },
//       { value: 'Cancer - Ovarian cancer', label: 'Cancer - Ovarian cancer' },
//       { value: 'Cancer - Pancreatic cancer', label: 'Cancer - Pancreatic cancer' },
//       { value: 'Cancer - Penile and testicular cancer', label: 'Cancer - Penile and testicular cancer' },
//       { value: 'Cancer - Peritoneal cancer', label: 'Cancer - Peritoneal cancer' },
//       { value: 'Cancer - Prostate cancer', label: 'Cancer - Prostate cancer' },
//       { value: 'Cancer - Renal cancer', label: 'Cancer - Renal cancer' },
//       { value: 'Cancer - Sarcoma', label: 'Cancer - Sarcoma' },
//       { value: 'Cancer - Skin cancer', label: 'Cancer - Skin cancer' },
//       { value: 'Cancer - Stomach cancer', label: 'Cancer - Stomach cancer' },
//       { value: 'Cancer - Thyroid cancer', label: 'Cancer - Thyroid cancer' },
//       { value: 'Cancer - Upper airways tract cancers', label: 'Cancer - Upper airways tract cancers' },
//       { value: 'Cardiovascular conditions', label: 'Cardiovascular conditions' },
//       { value: 'Cardiovascular conditions - Acute coronary syndromes', label: 'Cardiovascular conditions - Acute coronary syndromes' },
//       { value: 'Cardiovascular conditions - Aortic aneurysms', label: 'Cardiovascular conditions - Aortic aneurysms' },
//       { value: 'Cardiovascular conditions - Cranial aneurysms', label: 'Cardiovascular conditions - Cranial aneurysms' },
//       { value: 'Cardiovascular conditions - Embolism and thrombosis', label: 'Cardiovascular conditions - Embolism and thrombosis' },
//       { value: 'Cardiovascular conditions - Heart failure', label: 'Cardiovascular conditions - Heart failure' },
//       { value: 'Cardiovascular conditions - Heart rhythm conditions', label: 'Cardiovascular conditions - Heart rhythm conditions' },
//       { value: 'Cardiovascular conditions - Hypertension', label: 'Cardiovascular conditions - Hypertension' },
//       { value: 'Cardiovascular conditions - Lipid disorders', label: 'Cardiovascular conditions - Lipid disorders' },
//       { value: 'Cardiovascular conditions - Peripheral circulatory conditions', label: 'Cardiovascular conditions - Peripheral circulatory conditions' },
//       { value: 'Cardiovascular conditions - Stable angina', label: 'Cardiovascular conditions - Stable angina' },
//       { value: 'Cardiovascular conditions - Stroke and transient ischaemic attack', label: 'Cardiovascular conditions - Stroke and transient ischaemic attack' },
//       { value: 'Cardiovascular conditions - Structural heart defects', label: 'Cardiovascular conditions - Structural heart defects' },
//       { value: 'Cardiovascular conditions - Varicose veins', label: 'Cardiovascular conditions - Varicose veins' },
//       { value: 'Chronic and neuropathic pain', label: 'Chronic and neuropathic pain' },
//       { value: 'Chronic fatigue syndrome', label: 'Chronic fatigue syndrome' },
//       { value: 'Cystic fibrosis', label: 'Cystic fibrosis' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Adrenal dysfunction', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Adrenal dysfunction' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Diabetes', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Diabetes' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Failure to thrive', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Failure to thrive' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Lipid disorders', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Lipid disorders' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Malnutrition', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Malnutrition' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Metabolic conditions', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Metabolic conditions' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Obesity', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Obesity' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Osteoporosis', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Osteoporosis' },
//       { value: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Thyroid disorders', label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Thyroid disorders' },
//       { value: 'Digestive tract conditions', label: 'Digestive tract conditions' },
//       { value: 'Digestive tract conditions - Cholelithiasis and cholecystitis', label: 'Digestive tract conditions - Cholelithiasis and cholecystitis' },
//       { value: 'Digestive tract conditions - Coeliac disease', label: 'Digestive tract conditions - Coeliac disease' },
//       { value: 'Digestive tract conditions - Colorectal cancer', label: 'Digestive tract conditions - Colorectal cancer' },
//       { value: 'Digestive tract conditions - Constipation', label: 'Digestive tract conditions - Constipation' },
//       { value: 'Digestive tract conditions - Diarrhoea and vomiting', label: 'Digestive tract conditions - Diarrhoea and vomiting' },
//       { value: 'Digestive tract conditions - Diverticular disease', label: 'Digestive tract conditions - Diverticular disease' },
//       { value: 'Digestive tract conditions - Faecal incontinence', label: 'Digestive tract conditions - Faecal incontinence' },
//       { value: 'Digestive tract conditions - Gastro-oesophageal reflux, including Barrett\'s oesophagus', label: 'Digestive tract conditions - Gastro-oesophageal reflux, including Barrett\'s oesophagus' },
//       { value: 'Digestive tract conditions - Gastroparesis', label: 'Digestive tract conditions - Gastroparesis' },
//       { value: 'Digestive tract conditions - Haemorrhoids and other anal conditions', label: 'Digestive tract conditions - Haemorrhoids and other anal conditions' },
//       { value: 'Digestive tract conditions - Hernia', label: 'Digestive tract conditions - Hernia' },
//       { value: 'Digestive tract conditions - Inflammatory bowel disease', label: 'Digestive tract conditions - Inflammatory bowel disease' },
//       { value: 'Digestive tract conditions - Irritable bowel syndrome', label: 'Digestive tract conditions - Irritable bowel syndrome' },
//       { value: 'Digestive tract conditions - Lower gastrointestinal lesions', label: 'Digestive tract conditions - Lower gastrointestinal lesions' },
//       { value: 'Digestive tract conditions - Oesophageal cancer', label: 'Digestive tract conditions - Oesophageal cancer' },
//       { value: 'Digestive tract conditions - Pancreatic cancer', label: 'Digestive tract conditions - Pancreatic cancer' },
//       { value: 'Digestive tract conditions - Pancreatitis', label: 'Digestive tract conditions - Pancreatitis' },
//       { value: 'Digestive tract conditions - Stomach cancer', label: 'Digestive tract conditions - Stomach cancer' },
//       { value: 'Digestive tract conditions - Upper gastrointestinal bleeding', label: 'Digestive tract conditions - Upper gastrointestinal bleeding' },
//       { value: 'Ear, nose and throat conditions', label: 'Ear, nose and throat conditions' },
//       { value: 'Eye conditions', label: 'Eye conditions' },
//       { value: 'Fertility, pregnancy and childbirth', label: 'Fertility, pregnancy and childbirth' },
//       { value: 'Fertility, pregnancy and childbirth - Contraception', label: 'Fertility, pregnancy and childbirth - Contraception' },
//       { value: 'Fertility, pregnancy and childbirth - Fertility', label: 'Fertility, pregnancy and childbirth - Fertility' },
//       { value: 'Fertility, pregnancy and childbirth - Intrapartum care', label: 'Fertility, pregnancy and childbirth - Intrapartum care' },
//       { value: 'Fertility, pregnancy and childbirth - Postnatal care', label: 'Fertility, pregnancy and childbirth - Postnatal care' },
//       { value: 'Fertility, pregnancy and childbirth - Pregnancy', label: 'Fertility, pregnancy and childbirth - Pregnancy' },
//       { value: 'Fertility, pregnancy and childbirth - Termination of pregnancy services', label: 'Fertility, pregnancy and childbirth - Termination of pregnancy services' },
//       { value: 'Gynaecological conditions', label: 'Gynaecological conditions' },
//       { value: 'Gynaecological conditions - Cervical cancer', label: 'Gynaecological conditions - Cervical cancer' },
//       { value: 'Gynaecological conditions - Endometrial cancers', label: 'Gynaecological conditions - Endometrial cancers' },
//       { value: 'Gynaecological conditions - Endometriosis and fibroids', label: 'Gynaecological conditions - Endometriosis and fibroids' },
//       { value: 'Gynaecological conditions - Heavy menstrual bleeding', label: 'Gynaecological conditions - Heavy menstrual bleeding' },
//       { value: 'Gynaecological conditions - Menopause', label: 'Gynaecological conditions - Menopause' },
//       { value: 'Gynaecological conditions - Ovarian cancer', label: 'Gynaecological conditions - Ovarian cancer' },
//       { value: 'Gynaecological conditions - Termination of pregnancy services', label: 'Gynaecological conditions - Termination of pregnancy services' },
//       { value: 'Gynaecological conditions - Uterine prolapse', label: 'Gynaecological conditions - Uterine prolapse' },
//       { value: 'Gynaecological conditions - Vaginal conditions', label: 'Gynaecological conditions - Vaginal conditions' },
//       { value: 'Infections', label: 'Infections' },
//       { value: 'Infections - Antimicrobial stewardship', label: 'Infections - Antimicrobial stewardship' },
//       { value: 'Infections - Bites and stings', label: 'Infections - Bites and stings' },
//       { value: 'Infections - COVID-19', label: 'Infections - COVID-19' },
//       { value: 'Infections - Feverish illness', label: 'Infections - Feverish illness' },
//       { value: 'Infections - Healthcare-associated infections', label: 'Infections - Healthcare-associated infections' },
//       { value: 'Infections - Hepatitis', label: 'Infections - Hepatitis' },
//       { value: 'Infections - HIV and AIDS', label: 'Infections - HIV and AIDS' },
//       { value: 'Infections - Influenza', label: 'Infections - Influenza' },
//       { value: 'Infections - Meningitis and meningococcal septicaemia', label: 'Infections - Meningitis and meningococcal septicaemia' },
//       { value: 'Infections - Sepsis', label: 'Infections - Sepsis' },
//       { value: 'Infections - Skin infections', label: 'Infections - Skin infections' },
//       { value: 'Infections - Tuberculosis', label: 'Infections - Tuberculosis' },
//       { value: 'Injuries, accidents and wounds', label: 'Injuries, accidents and wounds' },
//       { value: 'Kidney conditions', label: 'Kidney conditions' },
//       { value: 'Kidney conditions - Acute kidney injury', label: 'Kidney conditions - Acute kidney injury' },
//       { value: 'Kidney conditions - Chronic kidney disease', label: 'Kidney conditions - Chronic kidney disease' },
//       { value: 'Kidney conditions - Renal cancer', label: 'Kidney conditions - Renal cancer' },
//       { value: 'Kidney conditions - Renal stones', label: 'Kidney conditions - Renal stones' },
//       { value: 'Liver conditions', label: 'Liver conditions' },
//       { value: 'Liver conditions - Alcohol-use disorders', label: 'Liver conditions - Alcohol-use disorders' },
//       { value: 'Liver conditions - Chronic liver disease', label: 'Liver conditions - Chronic liver disease' },
//       { value: 'Liver conditions - Hepatitis', label: 'Liver conditions - Hepatitis' },
//       { value: 'Liver conditions - Liver cancers', label: 'Liver conditions - Liver cancers' },
//       { value: 'Mental health and behavioural conditions', label: 'Mental health and behavioural conditions' },
//       { value: 'Mental health and behavioural conditions - Addiction', label: 'Mental health and behavioural conditions - Addiction' },
//       { value: 'Mental health and behavioural conditions - Alcohol-use disorders', label: 'Mental health and behavioural conditions - Alcohol-use disorders' },
//       { value: 'Mental health and behavioural conditions - Anxiety', label: 'Mental health and behavioural conditions - Anxiety' },
//       { value: 'Mental health and behavioural conditions - Attention deficit disorder', label: 'Mental health and behavioural conditions - Attention deficit disorder' },
//       { value: 'Mental health and behavioural conditions - Autism', label: 'Mental health and behavioural conditions - Autism' },
//       { value: 'Mental health and behavioural conditions - Bipolar disorder', label: 'Mental health and behavioural conditions - Bipolar disorder' },
//       { value: 'Mental health and behavioural conditions - Delirium', label: 'Mental health and behavioural conditions - Delirium' },
//       { value: 'Mental health and behavioural conditions - Dementia', label: 'Mental health and behavioural conditions - Dementia' },
//       { value: 'Mental health and behavioural conditions - Depression', label: 'Mental health and behavioural conditions - Depression' },
//       { value: 'Mental health and behavioural conditions - Drug misuse', label: 'Mental health and behavioural conditions - Drug misuse' },
//       { value: 'Mental health and behavioural conditions - Eating disorders', label: 'Mental health and behavioural conditions - Eating disorders' },
//       { value: 'Mental health and behavioural conditions - Mental health services', label: 'Mental health and behavioural conditions - Mental health services' },
//       { value: 'Mental health and behavioural conditions - Personality disorders', label: 'Mental health and behavioural conditions - Personality disorders' },
//       { value: 'Mental health and behavioural conditions - Psychosis and schizophrenia', label: 'Mental health and behavioural conditions - Psychosis and schizophrenia' },
//       { value: 'Mental health and behavioural conditions - Self-harm', label: 'Mental health and behavioural conditions - Self-harm' },
//       { value: 'Mental health and behavioural conditions - Suicide prevention', label: 'Mental health and behavioural conditions - Suicide prevention' },
//       { value: 'Multiple long-term conditions', label: 'Multiple long-term conditions' },
//       { value: 'Musculoskeletal conditions', label: 'Musculoskeletal conditions' },
//       { value: 'Musculoskeletal conditions - Arthritis', label: 'Musculoskeletal conditions - Arthritis' },
//       { value: 'Musculoskeletal conditions - Fractures', label: 'Musculoskeletal conditions - Fractures' },
//       { value: 'Musculoskeletal conditions - Hip conditions', label: 'Musculoskeletal conditions - Hip conditions' },
//       { value: 'Musculoskeletal conditions - Joint replacement', label: 'Musculoskeletal conditions - Joint replacement' },
//       { value: 'Musculoskeletal conditions - Knee conditions', label: 'Musculoskeletal conditions - Knee conditions' },
//       { value: 'Musculoskeletal conditions - Low back pain', label: 'Musculoskeletal conditions - Low back pain' },
//       { value: 'Musculoskeletal conditions - Maxillofacial conditions', label: 'Musculoskeletal conditions - Maxillofacial conditions' },
//       { value: 'Musculoskeletal conditions - Osteoporosis', label: 'Musculoskeletal conditions - Osteoporosis' },
//       { value: 'Musculoskeletal conditions - Spinal conditions', label: 'Musculoskeletal conditions - Spinal conditions' },
//       { value: 'Neurological conditions', label: 'Neurological conditions' },
//       { value: 'Neurological conditions - Brain cancers', label: 'Neurological conditions - Brain cancers' },
//       { value: 'Neurological conditions - Cerebral palsy', label: 'Neurological conditions - Cerebral palsy' },
//       { value: 'Neurological conditions - Delirium', label: 'Neurological conditions - Delirium' },
//       { value: 'Neurological conditions - Dementia', label: 'Neurological conditions - Dementia' },
//       { value: 'Neurological conditions - Epilepsy', label: 'Neurological conditions - Epilepsy' },
//       { value: 'Neurological conditions - Faecal incontinence', label: 'Neurological conditions - Faecal incontinence' },
//       { value: 'Neurological conditions - Headaches', label: 'Neurological conditions - Headaches' },
//       { value: 'Neurological conditions - Metastatic spinal cord compression', label: 'Neurological conditions - Metastatic spinal cord compression' },
//       { value: 'Neurological conditions - Motor neurone disease', label: 'Neurological conditions - Motor neurone disease' },
//       { value: 'Neurological conditions - Multiple sclerosis', label: 'Neurological conditions - Multiple sclerosis' },
//       { value: 'Neurological conditions - Parkinson\'s disease, tremor and dystonia', label: 'Neurological conditions - Parkinson\'s disease, tremor and dystonia' },
//       { value: 'Neurological conditions - Spasticity', label: 'Neurological conditions - Spasticity' },
//       { value: 'Neurological conditions - Spinal conditions', label: 'Neurological conditions - Spinal conditions' },
//       { value: 'Neurological conditions - Transient loss of consciousness', label: 'Neurological conditions - Transient loss of consciousness' },
//       { value: 'Neurological conditions - Urinary incontinence', label: 'Neurological conditions - Urinary incontinence' },
//       { value: 'Oral and dental health', label: 'Oral and dental health' },
//       { value: 'Respiratory conditions', label: 'Respiratory conditions' },
//       { value: 'Respiratory conditions - Asthma', label: 'Respiratory conditions - Asthma' },
//       { value: 'Respiratory conditions - Chronic obstructive pulmonary disease', label: 'Respiratory conditions - Chronic obstructive pulmonary disease' },
//       { value: 'Respiratory conditions - COVID-19', label: 'Respiratory conditions - COVID-19' },
//       { value: 'Respiratory conditions - Cystic fibrosis', label: 'Respiratory conditions - Cystic fibrosis' },
//       { value: 'Respiratory conditions - Lung cancer', label: 'Respiratory conditions - Lung cancer' },
//       { value: 'Respiratory conditions - Mesothelioma', label: 'Respiratory conditions - Mesothelioma' },
//       { value: 'Respiratory conditions - Pneumonia', label: 'Respiratory conditions - Pneumonia' },
//       { value: 'Respiratory conditions - Pulmonary fibrosis', label: 'Respiratory conditions - Pulmonary fibrosis' },
//       { value: 'Respiratory conditions - Respiratory infections', label: 'Respiratory conditions - Respiratory infections' },
//       { value: 'Respiratory conditions - Tuberculosis', label: 'Respiratory conditions - Tuberculosis' },
//       { value: 'Skin conditions', label: 'Skin conditions' },
//       { value: 'Skin conditions - Acne', label: 'Skin conditions - Acne' },
//       { value: 'Skin conditions - Diabetic foot', label: 'Skin conditions - Diabetic foot' },
//       { value: 'Skin conditions - Eczema', label: 'Skin conditions - Eczema' },
//       { value: 'Skin conditions - Pressure ulcers', label: 'Skin conditions - Pressure ulcers' },
//       { value: 'Skin conditions - Psoriasis', label: 'Skin conditions - Psoriasis' },
//       { value: 'Skin conditions - Skin cancer', label: 'Skin conditions - Skin cancer' },
//       { value: 'Skin conditions - Skin infections', label: 'Skin conditions - Skin infections' },
//       { value: 'Skin conditions - Wound management', label: 'Skin conditions - Wound management' },
//       { value: 'Sleep and sleep conditions', label: 'Sleep and sleep conditions' },
//       { value: 'Urological conditions', label: 'Urological conditions' },
//       { value: 'Urological conditions - Bladder cancer', label: 'Urological conditions - Bladder cancer' },
//       { value: 'Urological conditions - Lower urinary tract symptoms', label: 'Urological conditions - Lower urinary tract symptoms' },
//       { value: 'Urological conditions - Penile and testicular cancer', label: 'Urological conditions - Penile and testicular cancer' },
//       { value: 'Urological conditions - Prostate cancer', label: 'Urological conditions - Prostate cancer' },
//       { value: 'Urological conditions - Renal cancer', label: 'Urological conditions - Renal cancer' },
//       { value: 'Urological conditions - Urinary incontinence', label: 'Urological conditions - Urinary incontinence' },
//       { value: 'Urological conditions - Urinary tract infection', label: 'Urological conditions - Urinary tract infection' },
//       { value: 'OTHER', label: 'Other condition', conditional: new FormEngineParameterModel({ id: 'otherRegulationDescription', dataType: 'text', label: 'Other condition', validations: { isRequired: [true, 'Other condition is required'] } }) }
//     ]
//   }]
// }),
