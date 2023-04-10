import { FormSelectableFieldType } from '../shared.types';
import { catalogAreas, catalogCarbonReductionPlan, catalogCareSettings, catalogCategory, catalogEvidenceType, catalogCostComparison, catalogHasCostKnowledge, catalogHasPatents, catalogHasRegulationKnowledge, catalogIntendedUserGroupsEngaged, catalogInvolvedAACProgrammes, catalogKeyHealthInequalities, catalogMainPurpose, catalogNeedsSupportAnyArea, catalogOfficeLocation, catalogOptionBestDescribesInnovation, catalogPathwayKnowledge, catalogPatientRange, catalogRevenues, catalogStandardsType, catalogEvidenceSubmitType, catalogYesInProgressNotYet, catalogYesNo, catalogYesNoNotRelevant, catalogYesNoNotSure, catalogYesNotYet, catalogYesNotYetNo } from './catalog.types';


// Shared.
export const yesNoItems: FormSelectableFieldType<catalogYesNo> = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

export const yesNotYetItems: FormSelectableFieldType<catalogYesNotYet> = [
  { value: 'YES', label: 'Yes' },
  { value: 'NOT_YET', label: 'Not yet' }
];

export const yesNotYetNoItems:FormSelectableFieldType<catalogYesNotYetNo> = [
  { value: 'YES', label: 'Yes' },
  { value: 'NOT_YET', label: 'Not yet' },
  { value: 'NO', label: 'No' }
];


// Section 1.
// Section 1.1.
export const locationItems: FormSelectableFieldType<catalogOfficeLocation | ''> = [
  { value: 'England', label: 'England' },
  { value: 'Scotland', label: 'Scotland' },
  { value: 'Wales', label: 'Wales' },
  { value: 'Northern Ireland', label: 'Northern Ireland' },
  { value: '', label: 'SEPARATOR' },
  { value: 'Based outside UK', label: 'I\'m based outside of the UK' }
];

export const countriesItems: FormSelectableFieldType<string> = [
  { value: `Afghanistan`, label: `Afghanistan` },
  { value: `Albania`, label: `Albania` },
  { value: `Algeria`, label: `Algeria` },
  { value: `Andorra`, label: `Andorra` },
  { value: `Angola`, label: `Angola` },
  { value: `Antigua and Barbuda`, label: `Antigua and Barbuda` },
  { value: `Argentina`, label: `Argentina` },
  { value: `Armenia`, label: `Armenia` },
  { value: `Australia`, label: `Australia` },
  { value: `Austria`, label: `Austria` },
  { value: `Azerbaijan`, label: `Azerbaijan` },
  { value: `Bahamas`, label: `Bahamas` },
  { value: `Bahrain`, label: `Bahrain` },
  { value: `Bangladesh`, label: `Bangladesh` },
  { value: `Barbados`, label: `Barbados` },
  { value: `Belarus`, label: `Belarus` },
  { value: `Belgium`, label: `Belgium` },
  { value: `Belize`, label: `Belize` },
  { value: `Benin`, label: `Benin` },
  { value: `Bhutan`, label: `Bhutan` },
  { value: `Bolivia`, label: `Bolivia` },
  { value: `Bosnia and Herzegovina`, label: `Bosnia and Herzegovina` },
  { value: `Botswana`, label: `Botswana` },
  { value: `Brazil`, label: `Brazil` },
  { value: `Brunei`, label: `Brunei` },
  { value: `Bulgaria`, label: `Bulgaria` },
  { value: `Burkina Faso`, label: `Burkina Faso` },
  { value: `Burundi`, label: `Burundi` },
  { value: `Côte d'Ivoire`, label: `Côte d'Ivoire` },
  { value: `Cabo Verde`, label: `Cabo Verde` },
  { value: `Cambodia`, label: `Cambodia` },
  { value: `Cameroon`, label: `Cameroon` },
  { value: `Canada`, label: `Canada` },
  { value: `Central African Republic`, label: `Central African Republic` },
  { value: `Chad`, label: `Chad` },
  { value: `Chile`, label: `Chile` },
  { value: `China`, label: `China` },
  { value: `Colombia`, label: `Colombia` },
  { value: `Comoros`, label: `Comoros` },
  { value: `Congo (Congo-Brazzaville)`, label: `Congo (Congo-Brazzaville)` },
  { value: `Costa Rica`, label: `Costa Rica` },
  { value: `Croatia`, label: `Croatia` },
  { value: `Cuba`, label: `Cuba` },
  { value: `Cyprus`, label: `Cyprus` },
  { value: `Czechia (Czech Republic)`, label: `Czechia (Czech Republic)` },
  { value: `Democratic Republic of the Congo`, label: `Democratic Republic of the Congo` },
  { value: `Denmark`, label: `Denmark` },
  { value: `Djibouti`, label: `Djibouti` },
  { value: `Dominica`, label: `Dominica` },
  { value: `Dominican Republic`, label: `Dominican Republic` },
  { value: `Ecuador`, label: `Ecuador` },
  { value: `Egypt`, label: `Egypt` },
  { value: `El Salvador`, label: `El Salvador` },
  { value: `Equatorial Guinea`, label: `Equatorial Guinea` },
  { value: `Eritrea`, label: `Eritrea` },
  { value: `Estonia`, label: `Estonia` },
  { value: `Eswatini (fmr. "Swaziland")`, label: `Eswatini (fmr. "Swaziland")` },
  { value: `Ethiopia`, label: `Ethiopia` },
  { value: `Fiji`, label: `Fiji` },
  { value: `Finland`, label: `Finland` },
  { value: `France`, label: `France` },
  { value: `Gabon`, label: `Gabon` },
  { value: `Gambia`, label: `Gambia` },
  { value: `Georgia`, label: `Georgia` },
  { value: `Germany`, label: `Germany` },
  { value: `Ghana`, label: `Ghana` },
  { value: `Greece`, label: `Greece` },
  { value: `Grenada`, label: `Grenada` },
  { value: `Guatemala`, label: `Guatemala` },
  { value: `Guinea`, label: `Guinea` },
  { value: `Guinea-Bissau`, label: `Guinea-Bissau` },
  { value: `Guyana`, label: `Guyana` },
  { value: `Haiti`, label: `Haiti` },
  { value: `Holy See`, label: `Holy See` },
  { value: `Honduras`, label: `Honduras` },
  { value: `Hungary`, label: `Hungary` },
  { value: `Iceland`, label: `Iceland` },
  { value: `India`, label: `India` },
  { value: `Indonesia`, label: `Indonesia` },
  { value: `Iran`, label: `Iran` },
  { value: `Iraq`, label: `Iraq` },
  { value: `Ireland`, label: `Ireland` },
  { value: `Israel`, label: `Israel` },
  { value: `Italy`, label: `Italy` },
  { value: `Jamaica`, label: `Jamaica` },
  { value: `Japan`, label: `Japan` },
  { value: `Jordan`, label: `Jordan` },
  { value: `Kazakhstan`, label: `Kazakhstan` },
  { value: `Kenya`, label: `Kenya` },
  { value: `Kiribati`, label: `Kiribati` },
  { value: `Kuwait`, label: `Kuwait` },
  { value: `Kyrgyzstan`, label: `Kyrgyzstan` },
  { value: `Laos`, label: `Laos` },
  { value: `Latvia`, label: `Latvia` },
  { value: `Lebanon`, label: `Lebanon` },
  { value: `Lesotho`, label: `Lesotho` },
  { value: `Liberia`, label: `Liberia` },
  { value: `Libya`, label: `Libya` },
  { value: `Liechtenstein`, label: `Liechtenstein` },
  { value: `Lithuania`, label: `Lithuania` },
  { value: `Luxembourg`, label: `Luxembourg` },
  { value: `Madagascar`, label: `Madagascar` },
  { value: `Malawi`, label: `Malawi` },
  { value: `Malaysia`, label: `Malaysia` },
  { value: `Maldives`, label: `Maldives` },
  { value: `Mali`, label: `Mali` },
  { value: `Malta`, label: `Malta` },
  { value: `Marshall Islands`, label: `Marshall Islands` },
  { value: `Mauritania`, label: `Mauritania` },
  { value: `Mauritius`, label: `Mauritius` },
  { value: `Mexico`, label: `Mexico` },
  { value: `Micronesia`, label: `Micronesia` },
  { value: `Moldova`, label: `Moldova` },
  { value: `Monaco`, label: `Monaco` },
  { value: `Mongolia`, label: `Mongolia` },
  { value: `Montenegro`, label: `Montenegro` },
  { value: `Morocco`, label: `Morocco` },
  { value: `Mozambique`, label: `Mozambique` },
  { value: `Myanmar (formerly Burma)`, label: `Myanmar (formerly Burma)` },
  { value: `Namibia`, label: `Namibia` },
  { value: `Nauru`, label: `Nauru` },
  { value: `Nepal`, label: `Nepal` },
  { value: `Netherlands`, label: `Netherlands` },
  { value: `New Zealand`, label: `New Zealand` },
  { value: `Nicaragua`, label: `Nicaragua` },
  { value: `Niger`, label: `Niger` },
  { value: `Nigeria`, label: `Nigeria` },
  { value: `North Korea`, label: `North Korea` },
  { value: `North Macedonia`, label: `North Macedonia` },
  { value: `Norway`, label: `Norway` },
  { value: `Oman`, label: `Oman` },
  { value: `Pakistan`, label: `Pakistan` },
  { value: `Palau`, label: `Palau` },
  { value: `Palestine State`, label: `Palestine State` },
  { value: `Panama`, label: `Panama` },
  { value: `Papua New Guinea`, label: `Papua New Guinea` },
  { value: `Paraguay`, label: `Paraguay` },
  { value: `Peru`, label: `Peru` },
  { value: `Philippines`, label: `Philippines` },
  { value: `Poland`, label: `Poland` },
  { value: `Portugal`, label: `Portugal` },
  { value: `Qatar`, label: `Qatar` },
  { value: `Romania`, label: `Romania` },
  { value: `Russia`, label: `Russia` },
  { value: `Rwanda`, label: `Rwanda` },
  { value: `Saint Kitts and Nevis`, label: `Saint Kitts and Nevis` },
  { value: `Saint Lucia`, label: `Saint Lucia` },
  { value: `Saint Vincent and the Grenadines`, label: `Saint Vincent and the Grenadines` },
  { value: `Samoa`, label: `Samoa` },
  { value: `San Marino`, label: `San Marino` },
  { value: `Sao Tome and Principe`, label: `Sao Tome and Principe` },
  { value: `Saudi Arabia`, label: `Saudi Arabia` },
  { value: `Senegal`, label: `Senegal` },
  { value: `Serbia`, label: `Serbia` },
  { value: `Seychelles`, label: `Seychelles` },
  { value: `Sierra Leone`, label: `Sierra Leone` },
  { value: `Singapore`, label: `Singapore` },
  { value: `Slovakia`, label: `Slovakia` },
  { value: `Slovenia`, label: `Slovenia` },
  { value: `Solomon Islands`, label: `Solomon Islands` },
  { value: `Somalia`, label: `Somalia` },
  { value: `South Africa`, label: `South Africa` },
  { value: `South Korea`, label: `South Korea` },
  { value: `South Sudan`, label: `South Sudan` },
  { value: `Spain`, label: `Spain` },
  { value: `Sri Lanka`, label: `Sri Lanka` },
  { value: `Sudan`, label: `Sudan` },
  { value: `Suriname`, label: `Suriname` },
  { value: `Sweden`, label: `Sweden` },
  { value: `Switzerland`, label: `Switzerland` },
  { value: `Syria`, label: `Syria` },
  { value: `Tajikistan`, label: `Tajikistan` },
  { value: `Tanzania`, label: `Tanzania` },
  { value: `Thailand`, label: `Thailand` },
  { value: `Timor-Leste`, label: `Timor-Leste` },
  { value: `Togo`, label: `Togo` },
  { value: `Tonga`, label: `Tonga` },
  { value: `Trinidad and Tobago`, label: `Trinidad and Tobago` },
  { value: `Tunisia`, label: `Tunisia` },
  { value: `Turkey`, label: `Turkey` },
  { value: `Turkmenistan`, label: `Turkmenistan` },
  { value: `Tuvalu`, label: `Tuvalu` },
  { value: `Uganda`, label: `Uganda` },
  { value: `Ukraine`, label: `Ukraine` },
  { value: `United Arab Emirates`, label: `United Arab Emirates` },
  { value: `United Kingdom`, label: `United Kingdom` },
  { value: `United States of America`, label: `United States of America` },
  { value: `Uruguay`, label: `Uruguay` },
  { value: `Uzbekistan`, label: `Uzbekistan` },
  { value: `Vanuatu`, label: `Vanuatu` },
  { value: `Venezuela`, label: `Venezuela` },
  { value: `Vietnam`, label: `Vietnam` },
  { value: `Yemen`, label: `Yemen` },
  { value: `Zambia`, label: `Zambia` },
  { value: `Zimbabwe`, label: `Zimbabwe` }
];

export const categoriesItems: FormSelectableFieldType<catalogCategory> = [
  { value: 'MEDICAL_DEVICE', label: 'Medical device' },
  { value: 'IN_VITRO_DIAGNOSTIC', label: 'In vitro diagnostic' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
  { value: 'AI', label: 'Artificial intelligence (AI)' },
  { value: 'EDUCATION', label: 'Education or training of workforce' },
  { value: 'PPE', label: 'Personal protective equipment (PPE)' },
  { value: 'MODELS_CARE', label: 'Models of care and clinical pathways' },
  { value: 'ESTATES_FACILITIES', label: 'Estates and facilities' },
  { value: 'TRAVEL_TRANSPORT', label: 'Travel and transport' },
  { value: 'FOOD_NUTRITION', label: 'Food and nutrition' },
  { value: 'DATA_MONITORING', label: 'Data and monitoring' }
];

export const areasItems: FormSelectableFieldType<catalogAreas> = [
  { value: 'COVID_19', label: 'COVID-19' },
  { value: 'DATA_ANALYTICS_AND_RESEARCH', label: 'Data Analytics & Research' },
  { value: 'DIGITALISING_SYSTEM', label: 'Digitalising the system' },
  { value: 'IMPROVING_SYSTEM_FLOW', label: 'Improving system flow' },
  { value: 'INDEPENDENCE_AND_PREVENTION', label: 'Independence and prevention' },
  { value: 'OPERATIONAL_EXCELLENCE', label: 'Operational excellence' },
  { value: 'PATIENT_ACTIVATION_AND_SELF_CARE', label: 'Patient activation and self-care' },
  { value: 'PATIENT_SAFETY', label: 'Patient safety and quality improvement' },
  { value: 'NET_ZERO_GREENER_INNOVATION', label: 'Net zero NHS or greener innovation' }
];
export const careSettingsItems: FormSelectableFieldType<catalogCareSettings> = [
  { value: 'ACADEMIA', label: 'Academia' },
  { value: 'ACUTE_TRUSTS_INPATIENT', label: 'Acute Trusts (Hospital) - Inpatient' },
  { value: 'ACUTE_TRUSTS_OUTPATIENT', label: 'Acute Trusts (Hospital) - Outpatient' },
  { value: 'AMBULANCE', label: 'Ambulance' },
  { value: 'CARE_HOMES_CARE_SETTING', label: 'Care homes or care setting' },
  { value: 'END_LIFE_CARE', label: 'End of life care (EOLC)' },
  { value: 'ICS', label: 'ICS' },
  { value: 'INDUSTRY', label: 'Industry' },
  { value: 'LOCAL_AUTHORITY_EDUCATION', label: 'Local authority - education' },
  { value: 'MENTAL_HEALTH', label: 'Mental health' },
  { value: 'PHARMACY', label: 'Pharmacies' },
  { value: 'PRIMARY_CARE', label: 'Primary Care' },
  { value: 'SOCIAL_CARE', label: 'Social care' },
  { value: 'THIRD_SECTOR_ORGANISATIONS', label: 'Third sector organisations' },
  { value: 'URGENT_AND_EMERGENCY', label: 'Urgent & Emergency' }
];
export const mainPurposeItems: FormSelectableFieldType<catalogMainPurpose> = [
  { value: 'PREVENT_CONDITION', label: 'Preventing a condition or symptom from happening or worsening' },
  { value: 'PREDICT_CONDITION', label: 'Predicting the occurence of a condition or symptom' },
  { value: 'DIAGNOSE_CONDITION', label: 'Diagnosing a condition' },
  { value: 'MONITOR_CONDITION', label: 'Monitoring a condition, treatment or therapy' },
  { value: 'PROVIDE_TREATMENT', label: 'Providing treatment or therapy' },
  { value: 'MANAGE_CONDITION', label: 'Managing a condition' },
  { value: 'ENABLING_CARE', label: 'Enabling care, services or communication' },
  { value: 'RISKS_CLIMATE_CHANGE', label: 'Supporting the NHS to mitigate the risks or effects of climate change and severe weather conditions' }
];

export const involvedAACProgrammesItems: FormSelectableFieldType<cataloginvolvedAACProgrammes> = [
  { value: 'No', label: 'No' },
  { value: 'Academic Health Science Network', label: 'Academic Health Science Network' },
  { value: 'Artificial Intelligence in Health and Care Award', label: 'Artificial Intelligence in Health and Care Award' },
  { value: 'Clinical Entrepreneur Programme', label: 'Clinical Entrepreneur Programme' },
  { value: 'Early Access to Medicines Scheme', label: 'Early Access to Medicines Scheme' },
  { value: 'Innovation for Healthcare Inequalities Programme', label: 'Innovation for Healthcare Inequalities Programme' },
  { value: 'Innovation and Technology Payment Programme', label: 'Innovation and Technology Payment Programme' },
  { value: 'NHS Innovation Accelerator', label: 'NHS Innovation Accelerator' },
  { value: 'NHS Insights Prioritisation Programme', label: 'NHS Insights Prioritisation Programme' },
  { value: 'Pathway Transformation Fund', label: 'Pathway Transformation Fund' },
  { value: 'Rapid Uptake Products Programme', label: 'Rapid Uptake Products Programme' },
  { value: 'Small Business Research Initiative for Healthcare', label: 'Small Business Research Initiative for Healthcare' },
  { value: 'Test beds', label: 'Test beds' }
];


// Section 2.
// // Section 2.1.
export const benefitsOrImpactItems: FormSelectableFieldType<string> = [
  { value: 'Benefits for patients and people - Reduces mortality', label: 'Benefits for patients and people - Reduces mortality' },
  { value: 'Benefits for patients and people - Reduces need for further treatment', label: 'Benefits for patients and people - Reduces need for further treatment' },
  { value: 'Benefits for patients and people - Reduces adverse events', label: 'Benefits for patients and people - Reduces adverse events' },
  { value: 'Benefits for patients and people - Enables earlier or more accurate diagnosis', label: 'Benefits for patients and people - Enables earlier or more accurate diagnosis' },
  { value: 'Benefits for patients and people - Reduces risks, side effects or complications', label: 'Benefits for patients and people - Reduces risks, side effects or complications' },
  { value: 'Benefits for patients and people - Prevents a condition occurring or exacerbating', label: 'Benefits for patients and people - Prevents a condition occurring or exacerbating' },
  { value: 'Benefits for patients and people - Avoids a test, procedure or unnecessary treatment', label: 'Benefits for patients and people - Avoids a test, procedure or unnecessary treatment' },
  { value: 'Benefits for patients and people - Enables a test, procedure or treatment to be done non-invasively', label: 'Benefits for patients and people - Enables a test, procedure or treatment to be done non-invasively' },
  { value: 'Benefits for patients and people - Increases self-management', label: 'Benefits for patients and people - Increases self-management' },
  { value: 'Benefits for patients and people - Increases quality of life', label: 'Benefits for patients and people - Increases quality of life' },
  { value: 'Benefits for patients and people - Enables shared care', label: 'Benefits for patients and people - Enables shared care' },
  { value: 'Benefits for patients and people - Alleviates pain', label: 'Benefits for patients and people - Alleviates pain' },
  { value: 'Benefits for the NHS and social care - Reduces the length of stay or enables earlier discharge', label: 'Benefits for the NHS and social care - Reduces the length of stay or enables earlier discharge' },
  { value: 'Benefits for the NHS and social care - Reduces need for adult or paediatric critical care', label: 'Benefits for the NHS and social care - Reduces need for adult or paediatric critical care' },
  { value: 'Benefits for the NHS and social care - Reduces emergency admissions', label: 'Benefits for the NHS and social care - Reduces emergency admissions' },
  { value: 'Benefits for the NHS and social care - Changes delivery of care from secondary care(for example hospitals) to primary care(for example GP or community services)', label: 'Benefits for the NHS and social care - Changes delivery of care from secondary care(for example hospitals) to primary care(for example GP or community services)' },
  { value: 'Benefits for the NHS and social care - Change in delivery of care from inpatient to day case', label: 'Benefits for the NHS and social care - Change in delivery of care from inpatient to day case' },
  { value: 'Benefits for the NHS and social care - Increases compliance', label: 'Benefits for the NHS and social care - Increases compliance' },
  { value: 'Benefits for the NHS and social care - Improves patient management or coordination of care or services', label: 'Benefits for the NHS and social care - Improves patient management or coordination of care or services' },
  { value: 'Benefits for the NHS and social care - Reduces referrals', label: 'Benefits for the NHS and social care - Reduces referrals' },
  { value: 'Benefits for the NHS and social care - Takes less time', label: 'Benefits for the NHS and social care - Takes less time' },
  { value: 'Benefits for the NHS and social care - Uses no staff or a lower grade of staff', label: 'Benefits for the NHS and social care - Uses no staff or a lower grade of staff' },
  { value: 'Benefits for the NHS and social care - Leads to fewer appointments', label: 'Benefits for the NHS and social care - Leads to fewer appointments' },
  { value: 'Benefits for the NHS and social care - Is cost saving', label: 'Benefits for the NHS and social care - Is cost saving' },
  { value: 'Benefits for the NHS and social care - Increases efficiency', label: 'Benefits for the NHS and social care - Increases efficiency' },
  { value: 'Benefits for the NHS and social care - Improves performance', label: 'Benefits for the NHS and social care - Improves performance' },
  { value: 'Benefits for the NHS and social care - Reduces carbon emissions and supports the NHS to achieve net zero', label: 'Benefits for the NHS and social care - Reduces carbon emissions and supports the NHS to achieve net zero' },
  { value: 'Benefits for the NHS and social care - Other environmental benefits', label: 'Benefits for the NHS and social care - Other environmental benefits' }
];

export const diseasesConditionsImpactItems: FormSelectableFieldType<string> = [
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS', label: `Blood and immune system conditions` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_ALLERGIES', label: `Blood and immune system conditions - Allergies` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_ANAPHYLAXIS', label: `Blood and immune system conditions - Anaphylaxis` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_BLOOD_CONDITIONS', label: `Blood and immune system conditions - Blood conditions` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_LYMPHOEDEMA', label: `Blood and immune system conditions - Lymphoedema` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_SYSTEMIC_LUPUS_ERYTHEMATOSUS', label: `Blood and immune system conditions - Systemic lupus erythematosus` },
  { value: 'CANCER', label: `Cancer` },
  { value: 'CANCER_BLADDER_CANCER', label: `Cancer - Bladder cancer` },
  { value: 'CANCER_BLOOD_AND_BONE_MARROW_CANCERS', label: `Cancer - Blood and bone marrow cancers` },
  { value: 'CANCER_BRAIN_CANCERS', label: `Cancer - Brain cancers` },
  { value: 'CANCER_BREAST_CANCER', label: `Cancer - Breast cancer` },
  { value: 'CANCER_CERVICAL_CANCER', label: `Cancer - Cervical cancer` },
  { value: 'CANCER_COLORECTAL_CANCER', label: `Cancer - Colorectal cancer` },
  { value: 'CANCER_COMPLICATIONS_OF_CANCER', label: `Cancer - Complications of cancer` },
  { value: 'CANCER_ENDOMETRIAL_CANCERS', label: `Cancer - Endometrial cancers` },
  { value: 'CANCER_HEAD_AND_NECK_CANCERS', label: `Cancer - Head and neck cancers` },
  { value: 'CANCER_LIVER_CANCERS', label: `Cancer - Liver cancers` },
  { value: 'CANCER_LUNG_CANCER', label: `Cancer - Lung cancer` },
  { value: 'CANCER_METASTASES', label: `Cancer - Metastases` },
  { value: 'CANCER_OESOPHAGEAL_CANCER', label: `Cancer - Oesophageal cancer` },
  { value: 'CANCER_OVARIAN_CANCER', label: `Cancer - Ovarian cancer` },
  { value: 'CANCER_PANCREATIC_CANCER', label: `Cancer - Pancreatic cancer` },
  { value: 'CANCER_PENILE_AND_TESTICULAR_CANCER', label: `Cancer - Penile and testicular cancer` },
  { value: 'CANCER_PERITONEAL_CANCER', label: `Cancer - Peritoneal cancer` },
  { value: 'CANCER_PROSTATE_CANCER', label: `Cancer - Prostate cancer` },
  { value: 'CANCER_RENAL_CANCER', label: `Cancer - Renal cancer` },
  { value: 'CANCER_SARCOMA', label: `Cancer - Sarcoma` },
  { value: 'CANCER_SKIN_CANCER', label: `Cancer - Skin cancer` },
  { value: 'CANCER_STOMACH_CANCER', label: `Cancer - Stomach cancer` },
  { value: 'CANCER_THYROID_CANCER', label: `Cancer - Thyroid cancer` },
  { value: 'CANCER_UPPER_AIRWAYS_TRACT_CANCERS', label: `Cancer - Upper airways tract cancers` },
  { value: 'CARDIOVASCULAR_CONDITIONS', label: `Cardiovascular conditions` },
  { value: 'CARDIOVASCULAR_CONDITIONS_ACUTE_CORONARY_SYNDROMES', label: `Cardiovascular conditions - Acute coronary syndromes` },
  { value: 'CARDIOVASCULAR_CONDITIONS_AORTIC_ANEURYSMS', label: `Cardiovascular conditions - Aortic aneurysms` },
  { value: 'CARDIOVASCULAR_CONDITIONS_CRANIAL_ANEURYSMS', label: `Cardiovascular conditions - Cranial aneurysms` },
  { value: 'CARDIOVASCULAR_CONDITIONS_EMBOLISM_AND_THROMBOSIS', label: `Cardiovascular conditions - Embolism and thrombosis` },
  { value: 'CARDIOVASCULAR_CONDITIONS_HEART_FAILURE', label: `Cardiovascular conditions - Heart failure` },
  { value: 'CARDIOVASCULAR_CONDITIONS_HEART_RHYTHM_CONDITIONS', label: `Cardiovascular conditions - Heart rhythm conditions` },
  { value: 'CARDIOVASCULAR_CONDITIONS_HYPERTENSION', label: `Cardiovascular conditions - Hypertension` },
  { value: 'CARDIOVASCULAR_CONDITIONS_PERIPHERAL_CIRCULATORY_CONDITIONS', label: `Cardiovascular conditions - Peripheral circulatory conditions` },
  { value: 'CARDIOVASCULAR_CONDITIONS_STABLE_ANGINA', label: `Cardiovascular conditions - Stable angina` },
  { value: 'CARDIOVASCULAR_CONDITIONS_STROKE_AND_TRANSIENT_ISCHAEMIC_ATTACK', label: `Cardiovascular conditions - Stroke and transient ischaemic attack` },
  { value: 'CARDIOVASCULAR_CONDITIONS_STRUCTURAL_HEART_DEFECTS', label: `Cardiovascular conditions - Structural heart defects` },
  { value: 'CARDIOVASCULAR_CONDITIONS_VARICOSE_VEINS', label: `Cardiovascular conditions - Varicose veins` },
  { value: 'CHRONIC_AND_NEUROPATHIC_PAIN', label: `Chronic and neuropathic pain` },
  { value: 'CHRONIC_FATIGUE_SYNDROME', label: `Chronic fatigue syndrome` },
  { value: 'CYSTIC_FIBROSIS', label: `Cystic fibrosis` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS', label: `Diabetes and other endocrinal, nutritional and metabolic conditions` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_ADRENAL_DYSFUNCTION', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Adrenal dysfunction` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_DIABETES', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Diabetes` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_FAILURE_TO_THRIVE', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Failure to thrive` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_LIPID_DISORDERS', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Lipid disorders` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_MALNUTRITION', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Malnutrition` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_METABOLIC_CONDITIONS', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Metabolic conditions` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_OBESITY', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Obesity` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_THYROID_DISORDERS', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Thyroid disorders` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS', label: `Digestive tract conditions` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_CHOLELITHIASIS_AND_CHOLECYSTITIS', label: `Digestive tract conditions - Cholelithiasis and cholecystitis` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_COELIAC_DISEASE', label: `Digestive tract conditions - Coeliac disease` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_CONSTIPATION', label: `Digestive tract conditions - Constipation` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_DIARRHOEA_AND_VOMITING', label: `Digestive tract conditions - Diarrhoea and vomiting` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_DIVERTICULAR_DISEASE', label: `Digestive tract conditions - Diverticular disease` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_FAECAL_INCONTINENCE', label: `Digestive tract conditions - Faecal incontinence` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_GASTRO_OESOPHAGEAL_REFLUX_INCLUDING_BARRETTS_OESOPHAGUS', label: `Digestive tract conditions - Gastro-oesophageal reflux, including Barrett's oesophagus` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_GASTROPARESIS', label: `Digestive tract conditions - Gastroparesis` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_HAEMORRHOIDS_AND_OTHER_ANAL_CONDITIONS', label: `Digestive tract conditions - Haemorrhoids and other anal conditions` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_HERNIA', label: `Digestive tract conditions - Hernia` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_INFLAMMATORY_BOWEL_DISEASE', label: `Digestive tract conditions - Inflammatory bowel disease` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_IRRITABLE_BOWEL_SYNDROME', label: `Digestive tract conditions - Irritable bowel syndrome` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_LOWER_GASTROINTESTINAL_LESIONS', label: `Digestive tract conditions - Lower gastrointestinal lesions` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_PANCREATITIS', label: `Digestive tract conditions - Pancreatitis` },
  { value: 'DIGESTIVE_TRACT_CONDITIONS_UPPER_GASTROINTESTINAL_BLEEDING', label: `Digestive tract conditions - Upper gastrointestinal bleeding` },
  { value: 'EAR_NOSE_AND_THROAT_CONDITIONS', label: `Ear, nose and throat conditions` },
  { value: 'EYE_CONDITIONS', label: `Eye conditions` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH', label: `Fertility, pregnancy and childbirth` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_CONTRACEPTION', label: `Fertility, pregnancy and childbirth - Contraception` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_FERTILITY', label: `Fertility, pregnancy and childbirth - Fertility` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_INTRAPARTUM_CARE', label: `Fertility, pregnancy and childbirth - Intrapartum care` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_POSTNATAL_CARE', label: `Fertility, pregnancy and childbirth - Postnatal care` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_PREGNANCY', label: `Fertility, pregnancy and childbirth - Pregnancy` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_TERMINATION_OF_PREGNANCY_SERVICES', label: `Fertility, pregnancy and childbirth - Termination of pregnancy services` },
  { value: 'GYNAECOLOGICAL_CONDITIONS', label: `Gynaecological conditions` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_ENDOMETRIOSIS_AND_FIBROIDS', label: `Gynaecological conditions - Endometriosis and fibroids` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_HEAVY_MENSTRUAL_BLEEDING', label: `Gynaecological conditions - Heavy menstrual bleeding` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_MENOPAUSE', label: `Gynaecological conditions - Menopause` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_UTERINE_PROLAPSE', label: `Gynaecological conditions - Uterine prolapse` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_VAGINAL_CONDITIONS', label: `Gynaecological conditions - Vaginal conditions` },
  { value: 'INFECTIONS', label: `Infections` },
  { value: 'INFECTIONS_ANTIMICROBIAL_STEWARDSHIP', label: `Infections - Antimicrobial stewardship` },
  { value: 'INFECTIONS_BITES_AND_STINGS', label: `Infections - Bites and stings` },
  { value: 'INFECTIONS_COVID_19', label: `Infections - COVID-19` },
  { value: 'INFECTIONS_FEVERISH_ILLNESS', label: `Infections - Feverish illness` },
  { value: 'INFECTIONS_HEALTHCARE_ASSOCIATED_INFECTIONS', label: `Infections - Healthcare-associated infections` },
  { value: 'INFECTIONS_HIV_AND_AIDS', label: `Infections - HIV and AIDS` },
  { value: 'INFECTIONS_INFLUENZA', label: `Infections - Influenza` },
  { value: 'INFECTIONS_MENINGITIS_AND_MENINGOCOCCAL_SEPTICAEMIA', label: `Infections - Meningitis and meningococcal septicaemia` },
  { value: 'INFECTIONS_SEPSIS', label: `Infections - Sepsis` },
  { value: 'INFECTIONS_SKIN_INFECTIONS', label: `Infections - Skin infections` },
  { value: 'INFECTIONS_TUBERCULOSIS', label: `Infections - Tuberculosis` },
  { value: 'INJURIES_ACCIDENTS_AND_WOUNDS', label: `Injuries, accidents and wounds` },
  { value: 'KIDNEY_CONDITIONS', label: `Kidney conditions` },
  { value: 'KIDNEY_CONDITIONS_ACUTE_KIDNEY_INJURY', label: `Kidney conditions - Acute kidney injury` },
  { value: 'KIDNEY_CONDITIONS_CHRONIC_KIDNEY_DISEASE', label: `Kidney conditions - Chronic kidney disease` },
  { value: 'KIDNEY_CONDITIONS_RENAL_STONES', label: `Kidney conditions - Renal stones` },
  { value: 'LIVER_CONDITIONS', label: `Liver conditions` },
  { value: 'LIVER_CONDITIONS_CHRONIC_LIVER_DISEASE', label: `Liver conditions - Chronic liver disease` },
  { value: 'LIVER_CONDITIONS_HEPATITIS', label: `Liver conditions - Hepatitis` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS', label: `Mental health and behavioural conditions` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_ADDICTION', label: `Mental health and behavioural conditions - Addiction` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_ALCOHOL_USE_DISORDERS', label: `Mental health and behavioural conditions - Alcohol-use disorders` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_ANXIETY', label: `Mental health and behavioural conditions - Anxiety` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_ATTENTION_DEFICIT_DISORDER', label: `Mental health and behavioural conditions - Attention deficit disorder` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_AUTISM', label: `Mental health and behavioural conditions - Autism` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_BIPOLAR_DISORDER', label: `Mental health and behavioural conditions - Bipolar disorder` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_DELIRIUM', label: `Mental health and behavioural conditions - Delirium` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_DEMENTIA', label: `Mental health and behavioural conditions - Dementia` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_DEPRESSION', label: `Mental health and behavioural conditions - Depression` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_DRUG_MISUSE', label: `Mental health and behavioural conditions - Drug misuse` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_EATING_DISORDERS', label: `Mental health and behavioural conditions - Eating disorders` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_MENTAL_HEALTH_SERVICES', label: `Mental health and behavioural conditions - Mental health services` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_PERSONALITY_DISORDERS', label: `Mental health and behavioural conditions - Personality disorders` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_PSYCHOSIS_AND_SCHIZOPHRENIA', label: `Mental health and behavioural conditions - Psychosis and schizophrenia` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_SELF_HARM', label: `Mental health and behavioural conditions - Self-harm` },
  { value: 'MENTAL_HEALTH_AND_BEHAVIOURAL_CONDITIONS_SUICIDE_PREVENTION', label: `Mental health and behavioural conditions - Suicide prevention` },
  { value: 'MULTIPLE_LONG_TERM_CONDITIONS', label: `Multiple long-term conditions` },
  { value: 'MUSCULOSKELETAL_CONDITIONS', label: `Musculoskeletal conditions` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_ARTHRITIS', label: `Musculoskeletal conditions - Arthritis` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_FRACTURES', label: `Musculoskeletal conditions - Fractures` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_HIP_CONDITIONS', label: `Musculoskeletal conditions - Hip conditions` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_JOINT_REPLACEMENT', label: `Musculoskeletal conditions - Joint replacement` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_KNEE_CONDITIONS', label: `Musculoskeletal conditions - Knee conditions` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_LOW_BACK_PAIN', label: `Musculoskeletal conditions - Low back pain` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_MAXILLOFACIAL_CONDITIONS', label: `Musculoskeletal conditions - Maxillofacial conditions` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_OSTEOPOROSIS', label: `Musculoskeletal conditions - Osteoporosis` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_SPINAL_CONDITIONS', label: `Musculoskeletal conditions - Spinal conditions` },
  { value: 'NEUROLOGICAL_CONDITIONS', label: `Neurological conditions` },
  { value: 'NEUROLOGICAL_CONDITIONS_EPILEPSY', label: `Neurological conditions - Epilepsy` },
  { value: 'NEUROLOGICAL_CONDITIONS_HEADACHES', label: `Neurological conditions - Headaches` },
  { value: 'NEUROLOGICAL_CONDITIONS_METASTATIC_SPINAL_CORD_COMPRESSION', label: `Neurological conditions - Metastatic spinal cord compression` },
  { value: 'NEUROLOGICAL_CONDITIONS_MOTOR_NEURONE_DISEASE', label: `Neurological conditions - Motor neurone disease` },
  { value: 'NEUROLOGICAL_CONDITIONS_MULTIPLE_SCLEROSIS', label: `Neurological conditions - Multiple sclerosis` },
  { value: 'NEUROLOGICAL_CONDITIONS_PARKINSONS_DISEASE_TREMOR_AND_DYSTONIA', label: `Neurological conditions - Parkinson's disease, tremor and dystonia` },
  { value: 'NEUROLOGICAL_CONDITIONS_SPASTICITY', label: `Neurological conditions - Spasticity` },
  { value: 'NEUROLOGICAL_CONDITIONS_TRANSIENT_LOSS_OF_CONSCIOUSNESS', label: `Neurological conditions - Transient loss of consciousness` },
  { value: 'ORAL_AND_DENTAL_HEALTH', label: `Oral and dental health` },
  { value: 'RESPIRATORY_CONDITIONS', label: `Respiratory conditions` },
  { value: 'RESPIRATORY_CONDITIONS_ASTHMA', label: `Respiratory conditions - Asthma` },
  { value: 'RESPIRATORY_CONDITIONS_CHRONIC_OBSTRUCTIVE_PULMONARY_DISEASE', label: `Respiratory conditions - Chronic obstructive pulmonary disease` },
  { value: 'RESPIRATORY_CONDITIONS_CYSTIC_FIBROSIS', label: `Respiratory conditions - Cystic fibrosis` },
  { value: 'RESPIRATORY_CONDITIONS_MESOTHELIOMA', label: `Respiratory conditions - Mesothelioma` },
  { value: 'RESPIRATORY_CONDITIONS_PNEUMONIA', label: `Respiratory conditions - Pneumonia` },
  { value: 'RESPIRATORY_CONDITIONS_PULMONARY_FIBROSIS', label: `Respiratory conditions - Pulmonary fibrosis` },
  { value: 'RESPIRATORY_CONDITIONS_RESPIRATORY_INFECTIONS', label: `Respiratory conditions - Respiratory infections` },
  { value: 'SKIN_CONDITIONS', label: `Skin conditions` },
  { value: 'SKIN_CONDITIONS_ACNE', label: `Skin conditions - Acne` },
  { value: 'SKIN_CONDITIONS_DIABETIC_FOOT', label: `Skin conditions - Diabetic foot` },
  { value: 'SKIN_CONDITIONS_ECZEMA', label: `Skin conditions - Eczema` },
  { value: 'SKIN_CONDITIONS_PRESSURE_ULCERS', label: `Skin conditions - Pressure ulcers` },
  { value: 'SKIN_CONDITIONS_PSORIASIS', label: `Skin conditions - Psoriasis` },
  { value: 'SKIN_CONDITIONS_WOUND_MANAGEMENT', label: `Skin conditions - Wound management` },
  { value: 'SLEEP_AND_SLEEP_CONDITIONS', label: `Sleep and sleep conditions` },
  { value: 'UROLOGICAL_CONDITIONS', label: `Urological conditions` },
  { value: 'UROLOGICAL_CONDITIONS_LOWER_URINARY_TRACT_SYMPTOMS', label: `Urological conditions - Lower urinary tract symptoms` },
  { value: 'UROLOGICAL_CONDITIONS_URINARY_INCONTINENCE', label: `Urological conditions - Urinary incontinence` },
  { value: 'UROLOGICAL_CONDITIONS_URINARY_TRACT_INFECTION', label: `Urological conditions - Urinary tract infection` }
];

export const carbonReductionPlanItems: FormSelectableFieldType<catalogCarbonReductionPlan> = [
  { value: 'YES', label: 'Yes, I have one' },
  { value: 'WORKING_ON', label: 'I am working on one' },
  { value: 'NO', label: 'No, I do not have one' }
];

export const keyHealthInequalitiesItems: FormSelectableFieldType<catalogKeyHealthInequalities> = [
  { value: 'MATERNITY', label: 'Maternity' },
  { value: 'SEVER_MENTAL_ILLNESS', label: 'Severe mental illness' },
  { value: 'CHRONIC_RESPIRATORY_DISEASE', label: 'Chronic respiratory disease' },
  { value: 'EARLY_CANCER_DIAGNOSIS', label: 'Early cancer diagnosis' },
  { value: 'HYPERTENSION_CASE_FINDING', label: 'Hypertension case finding and optimal management and lipid optimal management' },
  { value: 'NONE', label: 'None of those listed' }
];

// // Section 2.2.
export const needsSupportAnyAreaItems: FormSelectableFieldType<catalogNeedsSupportAnyArea> = [
  { value: 'RESEARCH_GOVERNANCE', label: 'Research governance, including research ethics approvals' },
  { value: 'DATA_SHARING', label: 'Data sharing' },
  { value: 'CONFIDENTIAL_PATIENT_DATA', label: 'Use of confidential patient data' },
  { value: 'DO_NOT_NEED_SUPPORT', label: 'No, I do not need support' }
];

// // Section 2.2. Evidences.
export const evidenceSubmitTypeItems: FormSelectableFieldType<catalogEvidenceSubmitType> = [
  { value: 'CLINICAL_OR_CARE', label: 'Evidence of clinical or care outcomes' },
  { value: 'COST_IMPACT_OR_ECONOMIC', label: 'Evidence of cost impact, efficiency gains and/or economic modelling' },
  { value: 'OTHER_EFFECTIVENESS', label: 'Other evidence of effectiveness (for example environmental or social)' },
  { value: 'PRE_CLINICAL', label: 'Pre-clinical evidence' },
  { value: 'REAL_WORLD', label: 'Real world evidence' }
];

export const evidenceTypeItems: FormSelectableFieldType<catalogEvidenceType> = [
  { value: 'DATA_PUBLISHED', label: 'Data published, but not in a peer reviewed journal' },
  { value: 'NON_RANDOMISED_COMPARATIVE_DATA', label: 'Non-randomised comparative data published in a peer reviewed journal' },
  { value: 'NON_RANDOMISED_NON_COMPARATIVE_DATA', label: 'Non-randomised non-comparative data published in a peer reviewed journal' },
  { value: 'CONFERENCE', label: 'Poster or abstract presented at a conference' },
  { value: 'RANDOMISED_CONTROLLED_TRIAL', label: 'Randomised controlled trial published in a peer reviewed journal' },
  { value: 'UNPUBLISHED_DATA', label: 'Unpublished data' }
];


// Section 3.
// // Section 3.1.
export const hasMarketResearchItems: FormSelectableFieldType<catalogYesInProgressNotYet> = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I\'m currently doing market research' },
  { value: 'NOT_YET', label: 'Not yet' }
];

export const optionBestDescribesInnovationItems: FormSelectableFieldType<catalogOptionBestDescribesInnovation> = [
  { value: 'ONE_OFF_INNOVATION', label: 'A one-off innovation, or the first of its kind' },
  { value: 'BETTER_ALTERNATIVE', label: 'A better alternative to those that already exist' },
  { value: 'EQUIVALENT_ALTERNATIVE', label: 'An equivalent alternative to those that already exist' },
  { value: 'COST_EFFECT_ALTERNATIVE', label: 'A more cost-effect alternative to those that already exist' },
  { value: 'NOT_SURE', label: 'I am not sure' }
];

// // Section 3.2.
export const innovationPathwayKnowledgeItems: FormSelectableFieldType<catalogPathwayKnowledge> = [
  { value: 'PATHWAY_EXISTS_AND_CHANGED', label: 'There is a pathway, and my innovation changes it' },
  { value: 'PATHWAY_EXISTS_AND_FITS', label: 'There is a pathway, and my innovation fits in to it' },
  { value: 'NO_PATHWAY', label: 'There is no current care pathway' },
  { value: 'DONT_KNOW', label: 'I do not know' },
  { value: 'NOT_PART_PATHWAY', label: 'Does not form part of a care pathway' }
];


// Section 4.
// // Section 4.1.
export const involvedUsersDesignProcessItems: FormSelectableFieldType<catalogYesInProgressNotYet> = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I am in the process of involving users in the design' },
  { value: 'NOT_YET', label: 'Not yet' }
];

export const testedWithIntendedUsersItems: FormSelectableFieldType<catalogYesInProgressNotYet> = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I am in the process of testing with users' },
  { value: 'NOT_YET', label: 'Not yet' }
];

export const intendedUserGroupsEngagedItems: FormSelectableFieldType<catalogIntendedUserGroupsEngaged> = [
  { value: 'CLINICAL_SOCIAL_CARE_WORKING_INSIDE_UK', label: 'Clinical or social care professionals working in the UK health and social care system' },
  { value: 'CLINICAL_SOCIAL_CARE_WORKING_OUTSIDE_UK', label: 'Clinical or social care professionals working outside the UK' },
  { value: 'NON_CLINICAL_HEALTHCARE', label: 'Non-clinical healthcare staff' },
  { value: 'PATIENTS', label: 'Patients' },
  { value: 'SERVICE_USERS', label: 'Service users' },
  { value: 'CARERS', label: 'Carers' },
];


// Section 5.
// // Section 5.1.
export const hasRegulationKnowledgeItems: FormSelectableFieldType<catalogHasRegulationKnowledge> = [
  { value: 'YES_ALL', label: 'Yes, I know all of them' },
  { value: 'YES_SOME', label: 'Yes, I know some of them' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];
export const standardsTypeItems: FormSelectableFieldType<catalogStandardsType> = [
  { value: 'CE_UKCA_NON_MEDICAL', label: 'Non-medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_I', label: 'Class I medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_II_A', label: 'Class IIa medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_II_B', label: 'Class IIb medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_III', label: 'Class III medical device', group: 'UKCA / CE' },
  { value: 'IVD_GENERAL', label: 'IVD general', group: 'In-vitro diagnostics' },
  { value: 'IVD_SELF_TEST', label: 'IVD self-test', group: 'In-vitro diagnostics' },
  { value: 'IVD_ANNEX_LIST_A', label: 'IVD Annex II List A', group: 'In-vitro diagnostics' },
  { value: 'IVD_ANNEX_LIST_B', label: 'IVD Annex II List B', group: 'In-vitro diagnostics' },
  { value: 'MARKETING', label: 'Marketing authorisation for medicines' },
  { value: 'CQC', label: 'Care Quality Commission (CQC) registration, as I am providing a regulated activity' },
  { value: 'DTAC', label: 'Digital Technology Assessment Criteria (DTAC)' }
];

export const standardsHasMetItems: FormSelectableFieldType<catalogYesInProgressNotYet> = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I am actively working towards it' },
  { value: 'NOT_YET', label: 'Not yet' },
];

// // Section 5.2.
export const hasPatentsItems: FormSelectableFieldType<catalogHasPatents> = [
  { value: 'HAS_AT_LEAST_ONE', label: 'I have one or more patents' },
  { value: 'APPLIED_AT_LEAST_ONE', label: 'I have applied for one or more patents' },
  { value: 'HAS_NONE', label: 'I don\'t have any patents, but believe I have freedom to operate' }
];


// Section 6.
// // Section 6.1.
export const hasRevenueModelItems: FormSelectableFieldType<catalogYesNo> = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No or I do not know' }
];
export const revenuesItems: FormSelectableFieldType<catalogRevenues> = [
  { value: 'ADVERTISING', label: 'Advertising' },
  { value: 'DIRECT_PRODUCT_SALES', label: 'Direct product sales' },
  { value: 'FEE_FOR_SERVICE', label: 'Fee for service' },
  { value: 'LEASE', label: 'Lease' },
  { value: 'SALES_OF_CONSUMABLES_OR_ACCESSORIES', label: 'Sales of consumables or accessories' },
  { value: 'SUBSCRIPTION', label: 'Subscription' }
];
export const hasFundindItems: FormSelectableFieldType<catalogYesNoNotRelevant> = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];

// Section 7.
// // Section 7.1.
export const hasCostKnowledgeItems: FormSelectableFieldType<catalogHasCostKnowledge> = [
  { value: 'DETAILED_ESTIMATE', label: 'Yes, I have a detailed estimate' },
  { value: 'ROUGH_IDEA', label: 'Yes, I have a rough idea' },
  { value: 'NO', label: 'No' }
];

export const patientRangeItems: FormSelectableFieldType<catalogPatientRange> = [
  { value: 'UP_10000', label: 'Up to 10,000 per year' },
  { value: 'BETWEEN_10000_500000', label: '10,000 to half a million per year' },
  { value: 'MORE_THAN_500000', label: 'More than half a million per year' },
  { value: 'NOT_SURE', label: 'I am not sure' },
  { value: 'NOT_RELEVANT', label: 'Not relevant to my innovation' }
];

export const costComparisonItems: FormSelectableFieldType<catalogCostComparison> = [
  { value: 'CHEAPER', label: 'My innovation is cheaper to purchase' },
  { value: 'COSTS_MORE_WITH_SAVINGS', label: 'My innovation costs more to purchase, but has greater benefits that will lead to overall cost savings' },
  { value: 'COSTS_MORE', label: 'My innovation costs more to purchase and has greater benefits, but will lead to higher costs overall' },
  { value: 'NOT_SURE', label: 'I am not sure' }
];



// Section 8.
// // Section 8.1.
export const hasResourcesToScaleItems: FormSelectableFieldType<catalogYesNoNotSure> = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_SURE', label: 'I am not sure' }
];
