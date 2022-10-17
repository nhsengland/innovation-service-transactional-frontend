import { FormEngineParameterModel } from '@modules/shared/forms';

// Innovation.
export const maturityLevelItems = [
  { value: 'DISCOVERY', label: 'Discovery or early development' },
  { value: 'ADVANCED', label: 'Advanced development and testing' },
  { value: 'READY', label: 'Ready or nearly ready for adoption and scale' }
];

export const yesPartiallyNoItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'PARTIALLY', label: 'Partially' },
  { value: 'NO', label: 'No' }
];

export const yesNotYetNotSureItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NOT_YET', label: 'Not yet' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];


// Section 1.
// // Section 1.1
export const hasFinalProductItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];
export const categoriesItems = [
  { value: 'MEDICAL_DEVICE', label: 'Medical device' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
  { value: 'AI', label: 'Artificial intelligence (AI)' },
  { value: 'EDUCATION', label: 'Education or training of workforce' },
  { value: 'PPE', label: 'Personal protective equipment (PPE)' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherCategoryDescription', dataType: 'text', label: 'Other category', validations: { isRequired: [true, 'Other category description is required'] } }) }
];
export const mainCategoryItems = [
  { value: 'MEDICAL_DEVICE', label: 'Medical device' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
  { value: 'AI', label: 'Artificial intelligence (AI)' },
  { value: 'EDUCATION', label: 'Education or training of workforce' },
  { value: 'PPE', label: 'Personal protective equipment (PPE)' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherMainCategoryDescription', dataType: 'text', label: 'Other main category', validations: { isRequired: [true, 'Other main category description is required'] } }) }
];
export const areasItems = [
  { value: 'WORKFORCE', label: 'Workforce' },
  { value: 'ECONOMIC_GROWTH', label: 'Economic growth' },
  { value: 'EVIDENCE_GENERATION', label: 'Evidence generation' },
  { value: 'TRANSFORMED_OUT_OF_HOSPITAL_CARE', label: 'Transformed \'out-of-hospital care\' and fully integrated community-based care' },
  { value: 'REDUCIND_PRESSURE_EMERGENCY_HOSPITAL_SERVICES', label: 'Reducing pressure on emergency hospital services' },
  { value: 'CONTROL_OVER_THEIR_OWN_HEALTH', label: 'Giving people more control over their own health and more personalised care' },
  { value: 'DIGITALLY_ENABLING_PRIMARY_CARE', label: 'Digitally-enabling primary care and outpatient care' },
  { value: 'CANCER', label: 'Cancer' },
  { value: 'MENTAL_HEALTH', label: 'Mental Health' },
  { value: 'CHILDREN_AND_YOUNG_PEOPLE', label: 'Children and young people' },
  { value: 'LEARNING_DISABILITIES_AND_AUTISM', label: 'Learning disabilities and autism' },
  { value: 'CARDIOVASCULAR_DISEASE', label: 'Cardiovascular disease' },
  { value: 'STROKE_CARE', label: 'Stroke care' },
  { value: 'DIABETES', label: 'Diabetes' },
  { value: 'RESPIRATORY', label: 'Respiratory' },
  { value: 'RESEARCH_INNOVATION_DRIVE_FUTURE_OUTCOMES', label: 'Research and innovation to drive future outcomes improvement' },
  { value: 'GENOMICS', label: 'Genomics' },
  { value: 'WIDER_SOCIAL_IMPACT', label: 'Wider social impact' },
  { value: 'REDUCING_VARIATION_ACROSS_HEALTH_SYSTEM', label: 'Reducing variation across the health system' },
  { value: 'FINANCIAL_PLANNING_ASSUMPTIONS', label: 'Financial and planning assumptions for systems' },
  { value: 'COVID_19', label: 'COVID-19' },
  { value: 'DATA_ANALYTICS_AND_RESEARCH', label: 'Data Analytics & Research' },
  { value: 'IMPROVING_SYSTEM_FLOW', label: 'Improving system flow' },
  { value: 'INDEPENDENCE_AND_PREVENTION', label: 'Independence and prevention' },
  { value: 'OPERATIONAL_EXCELLENCE', label: 'Operational excellence' },
  { value: 'PATIENT_ACTIVATION_AND_SELF_CARE', label: 'Patient activation and self-care' },
  { value: 'PATIENT_SAFETY', label: 'Patient safety and quality improvement' },
  { value: 'GREATER_SUPPORT_AND_RESOURCE_PRIMARY_CARE', label: 'Greater support and resource for primary care' }
];
export const careSettingsItems = [
  { value: 'STP_ICS', label: 'STP / ICS' },
  { value: 'CCGS', label: 'CCGs' },
  { value: 'ACUTE_TRUSTS_INPATIENT', label: 'Acute Trusts - Inpatient' },
  { value: 'ACUTE_TRUSTS_OUTPATIENT', label: 'Acute Trusts - Outpatient' },
  { value: 'PRIMARY_CARE', label: 'Primary Care' },
  { value: 'MENTAL_HEALTH', label: 'Mental health' },
  { value: 'AMBULANCE', label: 'Ambulance' },
  { value: 'SOCIAL_CARE', label: 'Social care' },
  { value: 'INDUSTRY', label: 'Industry' },
  { value: 'COMMUNITY', label: 'Community' },
  { value: 'ACADEMIA', label: 'Academia' },
  { value: 'DOMICILIARY_CARE', label: 'Domiciliary Care' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'URGENT_AND_EMERGENCY', label: 'Urgent & Emergency' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherCareSetting', dataType: 'text', label: 'Other care setting', validations: { isRequired: [true, 'Other care setting description is required'] } }) }
];
export const mainPurposeItems = [
  { value: 'PREVENT_CONDITION', label: 'Preventing a condition or symptom from happening or worsening' },
  { value: 'PREDICT_CONDITION', label: 'Predicting the occurence of a condition or symptom' },
  { value: 'DIAGNOSE_CONDITION', label: 'Diagnosing a condition' },
  { value: 'MONITOR_CONDITION', label: 'Monitoring a condition, treatment or therapy' },
  { value: 'PROVIDE_TREATMENT', label: 'Providing treatment or therapy' },
  { value: 'MANAGE_CONDITION', label: 'Managing a condition' },
  { value: 'ENABLING_CARE', label: 'Enabling care, services or communication' }
];
export const supportTypesItems = [
  { value: 'ADOPTION', label: 'Adoption' },
  { value: 'ASSESSMENT', label: 'Health technology assessment' },
  { value: 'PRODUCT_MIGRATION', label: 'Bringing my product to or from the UK' },
  { value: 'CLINICAL_TESTS', label: 'Clinical trials and testing' },
  { value: 'COMMERCIAL', label: 'Commercial support and advice' },
  { value: 'PROCUREMENT', label: 'Procurement' },
  { value: 'DEVELOPMENT', label: 'Product development and regulatory advice' },
  { value: 'EVIDENCE_EVALUATION', label: 'Real-world evidence and evaluation' },
  { value: 'FUNDING', label: 'Understanding funding channels' },
  { value: '', label: 'SEPARATOR' },
  { value: 'INFORMATION', label: 'I\'m only looking for information right now' }
];

// // Section 1.2
export const hasProblemTackleKnowledgeItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NOT_YET', label: 'Not yet' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];


// Section 2
// // Section 2.1
export const innovationImpactItems = [
  { value: 'PATIENTS', label: 'Patients or citizens' },
  { value: 'CLINICIANS', label: 'Clinicians, carers or administrative staff' }
];

export const innovationDiseasesConditionsImpactItems = [
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_ALLERGIES', label: `Blood and immune system conditions - Allergies` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_ANAPHYLAXIS', label: `Blood and immune system conditions - Anaphylaxis` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_BLOOD_CONDITIONS', label: `Blood and immune system conditions - Blood conditions` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_LYMPHOEDEMA', label: `Blood and immune system conditions - Lymphoedema` },
  { value: 'BLOOD_AND_IMMUNE_SYSTEM_CONDITIONS_SYSTEMIC_LUPUS_ERYTHEMATOSUS', label: `Blood and immune system conditions - Systemic lupus erythematosus` },
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
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_ADRENAL_DYSFUNCTION', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Adrenal dysfunction` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_DIABETES', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Diabetes` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_FAILURE_TO_THRIVE', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Failure to thrive` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_LIPID_DISORDERS', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Lipid disorders` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_MALNUTRITION', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Malnutrition` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_METABOLIC_CONDITIONS', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Metabolic conditions` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_OBESITY', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Obesity` },
  { value: 'DIABETES_AND_OTHER_ENDOCRINAL_NUTRITIONAL_AND_METABOLIC_CONDITIONS_THYROID_DISORDERS', label: `Diabetes and other endocrinal, nutritional and metabolic conditions - Thyroid disorders` },
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
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_CONTRACEPTION', label: `Fertility, pregnancy and childbirth - Contraception` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_FERTILITY', label: `Fertility, pregnancy and childbirth - Fertility` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_INTRAPARTUM_CARE', label: `Fertility, pregnancy and childbirth - Intrapartum care` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_POSTNATAL_CARE', label: `Fertility, pregnancy and childbirth - Postnatal care` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_PREGNANCY', label: `Fertility, pregnancy and childbirth - Pregnancy` },
  { value: 'FERTILITY_PREGNANCY_AND_CHILDBIRTH_TERMINATION_OF_PREGNANCY_SERVICES', label: `Fertility, pregnancy and childbirth - Termination of pregnancy services` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_ENDOMETRIOSIS_AND_FIBROIDS', label: `Gynaecological conditions - Endometriosis and fibroids` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_HEAVY_MENSTRUAL_BLEEDING', label: `Gynaecological conditions - Heavy menstrual bleeding` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_MENOPAUSE', label: `Gynaecological conditions - Menopause` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_UTERINE_PROLAPSE', label: `Gynaecological conditions - Uterine prolapse` },
  { value: 'GYNAECOLOGICAL_CONDITIONS_VAGINAL_CONDITIONS', label: `Gynaecological conditions - Vaginal conditions` },
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
  { value: 'KIDNEY_CONDITIONS_ACUTE_KIDNEY_INJURY', label: `Kidney conditions - Acute kidney injury` },
  { value: 'KIDNEY_CONDITIONS_CHRONIC_KIDNEY_DISEASE', label: `Kidney conditions - Chronic kidney disease` },
  { value: 'KIDNEY_CONDITIONS_RENAL_STONES', label: `Kidney conditions - Renal stones` },
  { value: 'LIVER_CONDITIONS_CHRONIC_LIVER_DISEASE', label: `Liver conditions - Chronic liver disease` },
  { value: 'LIVER_CONDITIONS_HEPATITIS', label: `Liver conditions - Hepatitis` },
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
  { value: 'MUSCULOSKELETAL_CONDITIONS_ARTHRITIS', label: `Musculoskeletal conditions - Arthritis` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_FRACTURES', label: `Musculoskeletal conditions - Fractures` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_HIP_CONDITIONS', label: `Musculoskeletal conditions - Hip conditions` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_JOINT_REPLACEMENT', label: `Musculoskeletal conditions - Joint replacement` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_KNEE_CONDITIONS', label: `Musculoskeletal conditions - Knee conditions` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_LOW_BACK_PAIN', label: `Musculoskeletal conditions - Low back pain` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_MAXILLOFACIAL_CONDITIONS', label: `Musculoskeletal conditions - Maxillofacial conditions` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_OSTEOPOROSIS', label: `Musculoskeletal conditions - Osteoporosis` },
  { value: 'MUSCULOSKELETAL_CONDITIONS_SPINAL_CONDITIONS', label: `Musculoskeletal conditions - Spinal conditions` },
  { value: 'NEUROLOGICAL_CONDITIONS_EPILEPSY', label: `Neurological conditions - Epilepsy` },
  { value: 'NEUROLOGICAL_CONDITIONS_HEADACHES', label: `Neurological conditions - Headaches` },
  { value: 'NEUROLOGICAL_CONDITIONS_METASTATIC_SPINAL_CORD_COMPRESSION', label: `Neurological conditions - Metastatic spinal cord compression` },
  { value: 'NEUROLOGICAL_CONDITIONS_MOTOR_NEURONE_DISEASE', label: `Neurological conditions - Motor neurone disease` },
  { value: 'NEUROLOGICAL_CONDITIONS_MULTIPLE_SCLEROSIS', label: `Neurological conditions - Multiple sclerosis` },
  { value: 'NEUROLOGICAL_CONDITIONS_PARKINSONS_DISEASE_TREMOR_AND_DYSTONIA', label: `Neurological conditions - Parkinson's disease, tremor and dystonia` },
  { value: 'NEUROLOGICAL_CONDITIONS_SPASTICITY', label: `Neurological conditions - Spasticity` },
  { value: 'NEUROLOGICAL_CONDITIONS_TRANSIENT_LOSS_OF_CONSCIOUSNESS', label: `Neurological conditions - Transient loss of consciousness` },
  { value: 'ORAL_AND_DENTAL_HEALTH', label: `Oral and dental health` },
  { value: 'RESPIRATORY_CONDITIONS_ASTHMA', label: `Respiratory conditions - Asthma` },
  { value: 'RESPIRATORY_CONDITIONS_CHRONIC_OBSTRUCTIVE_PULMONARY_DISEASE', label: `Respiratory conditions - Chronic obstructive pulmonary disease` },
  { value: 'RESPIRATORY_CONDITIONS_CYSTIC_FIBROSIS', label: `Respiratory conditions - Cystic fibrosis` },
  { value: 'RESPIRATORY_CONDITIONS_MESOTHELIOMA', label: `Respiratory conditions - Mesothelioma` },
  { value: 'RESPIRATORY_CONDITIONS_PNEUMONIA', label: `Respiratory conditions - Pneumonia` },
  { value: 'RESPIRATORY_CONDITIONS_PULMONARY_FIBROSIS', label: `Respiratory conditions - Pulmonary fibrosis` },
  { value: 'RESPIRATORY_CONDITIONS_RESPIRATORY_INFECTIONS', label: `Respiratory conditions - Respiratory infections` },
  { value: 'SKIN_CONDITIONS_ACNE', label: `Skin conditions - Acne` },
  { value: 'SKIN_CONDITIONS_DIABETIC_FOOT', label: `Skin conditions - Diabetic foot` },
  { value: 'SKIN_CONDITIONS_ECZEMA', label: `Skin conditions - Eczema` },
  { value: 'SKIN_CONDITIONS_PRESSURE_ULCERS', label: `Skin conditions - Pressure ulcers` },
  { value: 'SKIN_CONDITIONS_PSORIASIS', label: `Skin conditions - Psoriasis` },
  { value: 'SKIN_CONDITIONS_WOUND_MANAGEMENT', label: `Skin conditions - Wound management` },
  { value: 'SLEEP_AND_SLEEP_CONDITIONS', label: `Sleep and sleep conditions` },
  { value: 'UROLOGICAL_CONDITIONS_LOWER_URINARY_TRACT_SYMPTOMS', label: `Urological conditions - Lower urinary tract symptoms` },
  { value: 'UROLOGICAL_CONDITIONS_URINARY_INCONTINENCE', label: `Urological conditions - Urinary incontinence` },
  { value: 'UROLOGICAL_CONDITIONS_URINARY_TRACT_INFECTION', label: `Urological conditions - Urinary tract infection` }
];


// // Section 2.2
export const hasBenefitsItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NOT_YET', label: 'Not yet' },
  { value: 'NOT_SURE', label: 'Not sure' }
];
export const patientsCitizensBenefitItems = [
  { value: 'REDUCE_MORTALITY', label: 'Reduces mortality' },
  { value: 'REDUCE_FURTHER_TREATMENT', label: 'Reduces need for further treatment' },
  { value: 'REDUCE_ADVERSE_EVENTS', label: 'Reduces adverse events' },
  { value: 'ENABLE_EARLIER_DIAGNOSIS', label: 'Enables earlier or more accurate diagnosis' },
  { value: 'REDUCE_RISKS', label: 'Reduces risks, side effects or complications' },
  { value: 'PREVENTS_CONDITION_OCCURRING', label: 'Prevents a condition occurring or exacerbating' },
  { value: 'AVOIDS_UNNECESSARY_TREATMENT', label: 'Avoids a test, procedure or unnecessary treatment' },
  { value: 'ENABLES_NON_INVASIVELY_TEST', label: 'Enables a test, procedure or treatment to be done non-invasively' },
  { value: 'INCREASES_SELF_MANAGEMENT', label: 'Increases self-management' },
  { value: 'INCREASES_LIFE_QUALITY', label: 'Increases quality of life' },
  { value: 'ENABLES_SHARED_CARE', label: 'Enables shared care' },
  // {
  //   value: 'OTHER',
  //   label: 'Other',
  //   conditional: new FormEngineParameterModel({ id: 'otherPatientsCitizensBenefit', dataType: 'text', label: 'Other patients or citizens benefit', validations: { isRequired: [true, 'Other patients or citizens benefit is required'] } })
  // }
];
export const generalBenefitItems = [
  { value: 'REDUCE_LENGTH_STAY', label: 'Reduces the length of stay or enables earlier discharge' },
  { value: 'REDUCE_CRITICAL_CARE', label: 'Reduces need for adult or paediatric critical care' },
  { value: 'REDUCE_EMERGENCY_ADMISSIONS', label: 'Reduces emergency admissions' },
  { value: 'CHANGES_DELIVERY_SECONDARY_TO_PRIMARY', label: 'Changes delivery of care from secondary care (e.g. hospitals) to primary care (e.g. GP or community services)' },
  { value: 'CHANGES_DELIVERY_INPATIENT_TO_DAY_CASE', label: 'Change in delivery of care from inpatient to day case' },
  { value: 'INCREASES_COMPLIANCE', label: 'Increases compliance' },
  { value: 'IMPROVES_COORDINATION', label: 'Improves patient management or coordination of care or services' },
  { value: 'REDUCES_REFERRALS', label: 'Reduces referrals' },
  { value: 'LESS_TIME', label: 'Takes less time' },
  { value: 'FEWER_STAFF', label: 'Uses no staff or a lower grade of staff' },
  { value: 'FEWER_APPOINTMENTS', label: 'Leads to fewer appointments' },
  { value: 'COST_SAVING', label: 'Is cost saving' },
  { value: 'INCREASES_EFFICIENCY', label: 'Increases efficiency' },
  { value: 'IMPROVES_PERFORMANCE', label: 'Improves performance' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherGeneralBenefit', dataType: 'text', label: 'Other NHS or social care benefit', validations: { isRequired: [true, 'Other MHS pr social care benefit is required'] } }) }
];
export const environmentalBenefitItems = [
  { value: 'NO_SIGNIFICANT_BENEFITS', label: 'There are no significant environmental sustainability benefits associated with my technology' },
  { value: 'LESS_ENERGY', label: 'Less energy is used' },
  { value: 'LESS_RAW_MATERIALS', label: 'Less raw materials are used' },
  { value: 'REDUCES_GAS_EMISSIONS', label: 'Reduces greenhouse gas emissions (including CO2 emissions)' },
  { value: 'REDUCES_PLASTICS_USE', label: 'Reduces the use of single use plastics' },
  { value: 'MINIMISES_WASTE', label: 'Minimises waste' },
  { value: 'LOWER_ENVIRONMENTAL_IMPACT', label: 'Lower environmental impact (e.g. less travel, better use of NHS resources)' },
  { value: 'OPTIMIZES_FINITE_RESOURCE_USE', label: 'Reduces or optimizes finite resource use (e.g. water, metals)' },
  { value: 'USES_RECYCLED_MATERIALS', label: 'Can be readily recycled or uses recycled materials' },
  {
    value: 'OTHER',
    label: 'Other',
    conditional: new FormEngineParameterModel({ id: 'otherEnvironmentalBenefit', dataType: 'text', label: 'Other environmental sustainability benefit', validations: { isRequired: [true, 'Other environmental sustainability benefit is required'] } })
  }
];

// // Section 2.3
export const hasEvidenceItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'NOT_YET', label: 'Not yet' }
];


// Section 3
// // Section 3.1
export const hasMarketResearchItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I\'m currently doing market research' },
  { value: 'NOT_YET', label: 'Not yet' }
];

// // Section 3.2
export const hasPatentsItems = [
  { value: 'HAS_AT_LEAST_ONE', label: 'I have one or more patents' },
  { value: 'APPLIED_AT_LEAST_ONE', label: 'I have applied for one or more patents' },
  { value: 'HAS_NONE', label: 'I don\'t have any patents, but believe I have freedom to operate' }
];
export const hasOtherIntellectualItems = [
  { value: 'YES', label: 'Yes', conditional: new FormEngineParameterModel({ id: 'otherIntellectual', dataType: 'text', label: 'Intellectual property name', validations: { isRequired: [true, 'Intellectual property name is required'] } }) },
  { value: 'NO', label: 'No' }
];


// Section 4
// // Section 4.1
export const hasRegulationKnowledgeItems = [
  { value: 'YES_ALL', label: 'Yes, I know all of them' },
  { value: 'YES_SOME', label: 'Yes, I know some of them' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];
export const standardsTypeItems = [
  { value: 'CE_UKCA_NON_MEDICAL', label: 'Non-medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_I', label: 'Class I medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_II_A', label: 'Class IIa medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_II_B', label: 'Class IIb medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_III', label: 'Class III medical device', group: 'UKCA / CE' },
  { value: 'IVD_GENERAL', label: 'IVD general', group: 'In-vitro diagnostics' },
  { value: 'IVD_SELF_TEST', label: 'IVD self-test', group: 'In-vitro diagnostics' },
  { value: 'IVD_ANNEX_LIST_A', label: 'IVD Annex II List A', group: 'In-vitro diagnostics' },
  { value: 'IVD_ANNEX_LIST_B', label: 'IVD Annex II List B', group: 'In-vitro diagnostics' },
  { value: 'MARKETING', label: 'Marketing authorisation' },
  { value: 'CQC', label: 'Care Quality Commission (CQC) registration' },
  { value: 'DTAC', label: 'Digital Technology Assessment Criteria (DTAC)' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRegulationDescription', dataType: 'text', label: 'Other standards and certifications that apply', validations: { isRequired: [true, 'Other standards and certifications is required'] } }) }
];
export const standardsHasMetItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I\'m in the process of gaining approval' },
  { value: 'NOT_YET', label: 'Not yet' },
];


// Section 5
// // Section 5.1
export const hasUKPathwayKnowledgeItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];
export const innovationPathwayKnowledgeItems = [
  { value: 'PATHWAY_EXISTS_AND_CHANGED', label: 'There is a pathway, and my innovation changes it' },
  { value: 'PATHWAY_EXISTS_AND_FITS', label: 'There is a pathway, and my innovation fits in it' },
  { value: 'NO_PATHWAY', label: 'There is no current care pathway' }
];
export const carePathwayItems = [
  { value: 'ONLY_OPTION', label: 'The only option, or first of its kind' },
  { value: 'BETTER_OPTION', label: 'A better option to those that already exist' },
  { value: 'EQUIVALENT_OPTION', label: 'An equivalent option to those that already exist' },
  { value: 'FIT_LESS_COSTS', label: 'Fit for purpose and costs less' },
  { value: 'NO_KNOWLEDGE', label: 'I don\'t know' }
];

// // Section 5.2
export const hasTestsItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROCESS', label: 'I\'m in the process of testing with users' },
  { value: 'NOT_YET', label: 'Not yet' }
];


// Section 6
// // Section 6.1
export const hasCostKnowledgeItems = [
  { value: 'DETAILED_ESTIMATE', label: 'Yes, I have a detailed estimate' },
  { value: 'ROUGH_IDEA', label: 'Yes, I have a rough idea' },
  { value: 'NO', label: 'No' }
];
export const patientRangeItems = [
  { value: 'UP_10000', label: 'Up to 10,000 per year' },
  { value: 'BETWEEN_10000_500000', label: '10,000 to half a million per year' },
  { value: 'MORE_THAN_500000', label: 'More than half a million per year' },
  { value: 'NOT_SURE', label: 'I\'m not sure' },
  { value: 'NOT_RELEVANT', label: 'Not relevant to my innovation' }
];

// // Section 6.2
export const costComparisonItems = [
  { value: 'CHEAPER', label: 'My innovation is cheaper to purchase' },
  { value: 'COSTS_MORE_WITH_SAVINGS', label: 'My innovation costs more to purchase but has greater benefits that will lead to overall cost savings' },
  { value: 'COSTS_MORE', label: 'My innovation costs more to purchase and has greater benefits but will lead to higher costs overall' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];


// Section 7
// // Section 7.1
export const hasRevenueModelItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];
export const revenuesItems = [
  { value: 'ADVERTISING', label: 'Advertising' },
  { value: 'DIRECT_PRODUCT_SALES', label: 'Direct product sales' },
  { value: 'FEE_FOR_SERVICE', label: 'Fee for service' },
  { value: 'LEASE', label: 'Lease' },
  { value: 'SALES_OF_CONSUMABLES_OR_ACCESSORIES', label: 'Sales of consumables or accessories' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  {
    value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRevenueDescription', dataType: 'text', label: 'Other revenue model', validations: { isRequired: [true, 'Other revenue model is required'] } })
  }
];
export const hasFundindItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];


// Section 8
// // Section 8.1
export const hasDeployPlanItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

export const hasResourcesToScaleItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];
