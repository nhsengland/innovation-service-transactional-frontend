import { InnovationRecordSchemaV3Type } from './ir-v3-types';

export const dummy_schema_V3_202405: InnovationRecordSchemaV3Type = {
  sections: [
    {
      id: 'aboutYourInnovation',
      title: 'About your innovation',
      subSections: [
        {
          id: 'innovationDescription',
          title: 'Description of innovation',
          questions: [
            {
              id: 'name',
              dataType: 'text',
              label: 'What is the name of your innovation?',
              description: 'Enter the name of your innovation with a maximum of 100 characters',
              validations: {
                isRequired: 'Innovation name is required',
                maxLength: 100
              }
            },
            {
              id: 'description',
              dataType: 'textarea',
              label: 'Provide a short description of your innovation',
              description:
                'Provide a high-level overview of your innovation. You will have the opportunity to explain its impact, target population, testing and revenue model later in the innovation record.',
              lengthLimit: 's',
              validations: {
                isRequired: 'A description is required'
              }
            },
            {
              id: 'officeLocation',
              dataType: 'radio-group',
              label: 'Where is your head office located?',
              description:
                '<p>If your head office is overseas but you have a UK office, use the UK address.</p><p>If you are not part of a company or organisation, put where you are based.</p><p>We ask this to identify the organisations and people who are in the best position to support you.</p>',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'england',
                  label: 'England'
                },
                {
                  id: 'scotland',
                  label: 'Scotland'
                },
                {
                  id: 'wales',
                  label: 'Wales'
                },
                {
                  id: 'northernIreland',
                  label: 'Northern Ireland'
                },
                {
                  type: 'separator'
                },
                {
                  id: 'basedOutsideUk',
                  label: "I'm based outside of the UK"
                }
              ]
            },
            {
              id: 'postcode',
              dataType: 'text',
              label: 'What is your head office postcode?',
              validations: {
                isRequired: 'Postcode is required',
                maxLength: 8,
                postcodeFormat: true
              },
              condition: "data.officeLocation != 'basedOutsideUk'"
            },
            {
              id: 'countryLocation',
              dataType: 'autocomplete-array',
              label: 'Which country is your head office located in?',
              validations: {
                isRequired: 'You must choose one country',
                max: {
                  length: 1,
                  errorMessage: 'Only 1 country is allowed'
                }
              },
              condition: "data.officeLocation == 'basedOutsideUk'",
              items: [
                {
                  id: 'afghanistan',
                  label: 'Afghanistan'
                },
                {
                  id: 'albania',
                  label: 'Albania'
                },
                {
                  id: 'algeria',
                  label: 'Algeria'
                },
                {
                  id: 'andorra',
                  label: 'Andorra'
                },
                {
                  id: 'angola',
                  label: 'Angola'
                },
                {
                  id: 'antiguaAndBarbuda',
                  label: 'Antigua and Barbuda'
                },
                {
                  id: 'argentina',
                  label: 'Argentina'
                },
                {
                  id: 'armenia',
                  label: 'Armenia'
                },
                {
                  id: 'australia',
                  label: 'Australia'
                },
                {
                  id: 'austria',
                  label: 'Austria'
                },
                {
                  id: 'azerbaijan',
                  label: 'Azerbaijan'
                },
                {
                  id: 'bahamas',
                  label: 'Bahamas'
                },
                {
                  id: 'bahrain',
                  label: 'Bahrain'
                },
                {
                  id: 'bangladesh',
                  label: 'Bangladesh'
                },
                {
                  id: 'barbados',
                  label: 'Barbados'
                },
                {
                  id: 'belarus',
                  label: 'Belarus'
                },
                {
                  id: 'belgium',
                  label: 'Belgium'
                },
                {
                  id: 'belize',
                  label: 'Belize'
                },
                {
                  id: 'benin',
                  label: 'Benin'
                },
                {
                  id: 'bhutan',
                  label: 'Bhutan'
                },
                {
                  id: 'bolivia',
                  label: 'Bolivia'
                },
                {
                  id: 'bosniaAndHerzegovina',
                  label: 'Bosnia and Herzegovina'
                },
                {
                  id: 'botswana',
                  label: 'Botswana'
                },
                {
                  id: 'brazil',
                  label: 'Brazil'
                },
                {
                  id: 'brunei',
                  label: 'Brunei'
                },
                {
                  id: 'bulgaria',
                  label: 'Bulgaria'
                },
                {
                  id: 'burkinaFaso',
                  label: 'Burkina Faso'
                },
                {
                  id: 'burundi',
                  label: 'Burundi'
                },
                {
                  id: 'coteDIvoire',
                  label: "Côte d'Ivoire"
                },
                {
                  id: 'caboVerde',
                  label: 'Cabo Verde'
                },
                {
                  id: 'cambodia',
                  label: 'Cambodia'
                },
                {
                  id: 'cameroon',
                  label: 'Cameroon'
                },
                {
                  id: 'canada',
                  label: 'Canada'
                },
                {
                  id: 'centralAfricanRepublic',
                  label: 'Central African Republic'
                },
                {
                  id: 'chad',
                  label: 'Chad'
                },
                {
                  id: 'chile',
                  label: 'Chile'
                },
                {
                  id: 'china',
                  label: 'China'
                },
                {
                  id: 'colombia',
                  label: 'Colombia'
                },
                {
                  id: 'comoros',
                  label: 'Comoros'
                },
                {
                  id: 'congo',
                  label: 'Congo (Congo-Brazzaville)'
                },
                {
                  id: 'costaRica',
                  label: 'Costa Rica'
                },
                {
                  id: 'croatia',
                  label: 'Croatia'
                },
                {
                  id: 'cuba',
                  label: 'Cuba'
                },
                {
                  id: 'cyprus',
                  label: 'Cyprus'
                },
                {
                  id: 'czechia',
                  label: 'Czechia (Czech Republic)'
                },
                {
                  id: 'democraticRepublicOfTheCongo',
                  label: 'Democratic Republic of the Congo'
                },
                {
                  id: 'denmark',
                  label: 'Denmark'
                },
                {
                  id: 'djibouti',
                  label: 'Djibouti'
                },
                {
                  id: 'dominica',
                  label: 'Dominica'
                },
                {
                  id: 'dominicanRepublic',
                  label: 'Dominican Republic'
                },
                {
                  id: 'ecuador',
                  label: 'Ecuador'
                },
                {
                  id: 'egypt',
                  label: 'Egypt'
                },
                {
                  id: 'elSalvador',
                  label: 'El Salvador'
                },
                {
                  id: 'equatorialGuinea',
                  label: 'Equatorial Guinea'
                },
                {
                  id: 'eritrea',
                  label: 'Eritrea'
                },
                {
                  id: 'estonia',
                  label: 'Estonia'
                },
                {
                  id: 'eswatini',
                  label: 'Eswatini (fmr. "Swaziland")'
                },
                {
                  id: 'ethiopia',
                  label: 'Ethiopia'
                },
                {
                  id: 'fiji',
                  label: 'Fiji'
                },
                {
                  id: 'finland',
                  label: 'Finland'
                },
                {
                  id: 'france',
                  label: 'France'
                },
                {
                  id: 'gabon',
                  label: 'Gabon'
                },
                {
                  id: 'gambia',
                  label: 'Gambia'
                },
                {
                  id: 'georgia',
                  label: 'Georgia'
                },
                {
                  id: 'germany',
                  label: 'Germany'
                },
                {
                  id: 'ghana',
                  label: 'Ghana'
                },
                {
                  id: 'greece',
                  label: 'Greece'
                },
                {
                  id: 'grenada',
                  label: 'Grenada'
                },
                {
                  id: 'guatemala',
                  label: 'Guatemala'
                },
                {
                  id: 'guinea',
                  label: 'Guinea'
                },
                {
                  id: 'guineaBissau',
                  label: 'Guinea-Bissau'
                },
                {
                  id: 'guyana',
                  label: 'Guyana'
                },
                {
                  id: 'haiti',
                  label: 'Haiti'
                },
                {
                  id: 'holySee',
                  label: 'Holy See'
                },
                {
                  id: 'honduras',
                  label: 'Honduras'
                },
                {
                  id: 'hungary',
                  label: 'Hungary'
                },
                {
                  id: 'iceland',
                  label: 'Iceland'
                },
                {
                  id: 'india',
                  label: 'India'
                },
                {
                  id: 'indonesia',
                  label: 'Indonesia'
                },
                {
                  id: 'iran',
                  label: 'Iran'
                },
                {
                  id: 'iraq',
                  label: 'Iraq'
                },
                {
                  id: 'ireland',
                  label: 'Ireland'
                },
                {
                  id: 'israel',
                  label: 'Israel'
                },
                {
                  id: 'italy',
                  label: 'Italy'
                },
                {
                  id: 'jamaica',
                  label: 'Jamaica'
                },
                {
                  id: 'japan',
                  label: 'Japan'
                },
                {
                  id: 'jordan',
                  label: 'Jordan'
                },
                {
                  id: 'kazakhstan',
                  label: 'Kazakhstan'
                },
                {
                  id: 'kenya',
                  label: 'Kenya'
                },
                {
                  id: 'kiribati',
                  label: 'Kiribati'
                },
                {
                  id: 'kuwait',
                  label: 'Kuwait'
                },
                {
                  id: 'kyrgyzstan',
                  label: 'Kyrgyzstan'
                },
                {
                  id: 'laos',
                  label: 'Laos'
                },
                {
                  id: 'latvia',
                  label: 'Latvia'
                },
                {
                  id: 'lebanon',
                  label: 'Lebanon'
                },
                {
                  id: 'lesotho',
                  label: 'Lesotho'
                },
                {
                  id: 'liberia',
                  label: 'Liberia'
                },
                {
                  id: 'libya',
                  label: 'Libya'
                },
                {
                  id: 'liechtenstein',
                  label: 'Liechtenstein'
                },
                {
                  id: 'lithuania',
                  label: 'Lithuania'
                },
                {
                  id: 'luxembourg',
                  label: 'Luxembourg'
                },
                {
                  id: 'madagascar',
                  label: 'Madagascar'
                },
                {
                  id: 'malawi',
                  label: 'Malawi'
                },
                {
                  id: 'malaysia',
                  label: 'Malaysia'
                },
                {
                  id: 'maldives',
                  label: 'Maldives'
                },
                {
                  id: 'mali',
                  label: 'Mali'
                },
                {
                  id: 'malta',
                  label: 'Malta'
                },
                {
                  id: 'marshallIslands',
                  label: 'Marshall Islands'
                },
                {
                  id: 'mauritania',
                  label: 'Mauritania'
                },
                {
                  id: 'mauritius',
                  label: 'Mauritius'
                },
                {
                  id: 'mexico',
                  label: 'Mexico'
                },
                {
                  id: 'micronesia',
                  label: 'Micronesia'
                },
                {
                  id: 'moldova',
                  label: 'Moldova'
                },
                {
                  id: 'monaco',
                  label: 'Monaco'
                },
                {
                  id: 'mongolia',
                  label: 'Mongolia'
                },
                {
                  id: 'montenegro',
                  label: 'Montenegro'
                },
                {
                  id: 'morocco',
                  label: 'Morocco'
                },
                {
                  id: 'mozambique',
                  label: 'Mozambique'
                },
                {
                  id: 'myanmar',
                  label: 'Myanmar (formerly Burma)'
                },
                {
                  id: 'namibia',
                  label: 'Namibia'
                },
                {
                  id: 'nauru',
                  label: 'Nauru'
                },
                {
                  id: 'nepal',
                  label: 'Nepal'
                },
                {
                  id: 'netherlands',
                  label: 'Netherlands'
                },
                {
                  id: 'newZealand',
                  label: 'New Zealand'
                },
                {
                  id: 'nicaragua',
                  label: 'Nicaragua'
                },
                {
                  id: 'niger',
                  label: 'Niger'
                },
                {
                  id: 'nigeria',
                  label: 'Nigeria'
                },
                {
                  id: 'northKorea',
                  label: 'North Korea'
                },
                {
                  id: 'northMacedonia',
                  label: 'North Macedonia'
                },
                {
                  id: 'norway',
                  label: 'Norway'
                },
                {
                  id: 'oman',
                  label: 'Oman'
                },
                {
                  id: 'pakistan',
                  label: 'Pakistan'
                },
                {
                  id: 'palau',
                  label: 'Palau'
                },
                {
                  id: 'palestineState',
                  label: 'Palestine State'
                },
                {
                  id: 'panama',
                  label: 'Panama'
                },
                {
                  id: 'papuaNewGuinea',
                  label: 'Papua New Guinea'
                },
                {
                  id: 'paraguay',
                  label: 'Paraguay'
                },
                {
                  id: 'peru',
                  label: 'Peru'
                },
                {
                  id: 'philippines',
                  label: 'Philippines'
                },
                {
                  id: 'poland',
                  label: 'Poland'
                },
                {
                  id: 'portugal',
                  label: 'Portugal'
                },
                {
                  id: 'qatar',
                  label: 'Qatar'
                },
                {
                  id: 'romania',
                  label: 'Romania'
                },
                {
                  id: 'russia',
                  label: 'Russia'
                },
                {
                  id: 'rwanda',
                  label: 'Rwanda'
                },
                {
                  id: 'saintKittsAndNevis',
                  label: 'Saint Kitts and Nevis'
                },
                {
                  id: 'saintLucia',
                  label: 'Saint Lucia'
                },
                {
                  id: 'saintVincentAndTheGrenadines',
                  label: 'Saint Vincent and the Grenadines'
                },
                {
                  id: 'samoa',
                  label: 'Samoa'
                },
                {
                  id: 'sanMarino',
                  label: 'San Marino'
                },
                {
                  id: 'saoTomeAndPrincipe',
                  label: 'Sao Tome and Principe'
                },
                {
                  id: 'saudiArabia',
                  label: 'Saudi Arabia'
                },
                {
                  id: 'senegal',
                  label: 'Senegal'
                },
                {
                  id: 'serbia',
                  label: 'Serbia'
                },
                {
                  id: 'seychelles',
                  label: 'Seychelles'
                },
                {
                  id: 'sierraLeone',
                  label: 'Sierra Leone'
                },
                {
                  id: 'singapore',
                  label: 'Singapore'
                },
                {
                  id: 'slovakia',
                  label: 'Slovakia'
                },
                {
                  id: 'slovenia',
                  label: 'Slovenia'
                },
                {
                  id: 'solomonIslands',
                  label: 'Solomon Islands'
                },
                {
                  id: 'somalia',
                  label: 'Somalia'
                },
                {
                  id: 'southAfrica',
                  label: 'South Africa'
                },
                {
                  id: 'southKorea',
                  label: 'South Korea'
                },
                {
                  id: 'southSudan',
                  label: 'South Sudan'
                },
                {
                  id: 'spain',
                  label: 'Spain'
                },
                {
                  id: 'sriLanka',
                  label: 'Sri Lanka'
                },
                {
                  id: 'sudan',
                  label: 'Sudan'
                },
                {
                  id: 'suriname',
                  label: 'Suriname'
                },
                {
                  id: 'sweden',
                  label: 'Sweden'
                },
                {
                  id: 'switzerland',
                  label: 'Switzerland'
                },
                {
                  id: 'syria',
                  label: 'Syria'
                },
                {
                  id: 'tajikistan',
                  label: 'Tajikistan'
                },
                {
                  id: 'tanzania',
                  label: 'Tanzania'
                },
                {
                  id: 'thailand',
                  label: 'Thailand'
                },
                {
                  id: 'timorLeste',
                  label: 'Timor-Leste'
                },
                {
                  id: 'togo',
                  label: 'Togo'
                },
                {
                  id: 'tonga',
                  label: 'Tonga'
                },
                {
                  id: 'trinidadAndTobago',
                  label: 'Trinidad and Tobago'
                },
                {
                  id: 'tunisia',
                  label: 'Tunisia'
                },
                {
                  id: 'turkey',
                  label: 'Turkey'
                },
                {
                  id: 'turkmenistan',
                  label: 'Turkmenistan'
                },
                {
                  id: 'tuvalu',
                  label: 'Tuvalu'
                },
                {
                  id: 'uganda',
                  label: 'Uganda'
                },
                {
                  id: 'ukraine',
                  label: 'Ukraine'
                },
                {
                  id: 'unitedArabEmirates',
                  label: 'United Arab Emirates'
                },
                {
                  id: 'unitedKingdom',
                  label: 'United Kingdom'
                },
                {
                  id: 'unitedStatesOfAmerica',
                  label: 'United States of America'
                },
                {
                  id: 'uruguay',
                  label: 'Uruguay'
                },
                {
                  id: 'uzbekistan',
                  label: 'Uzbekistan'
                },
                {
                  id: 'vanuatu',
                  label: 'Vanuatu'
                },
                {
                  id: 'venezuela',
                  label: 'Venezuela'
                },
                {
                  id: 'vietnam',
                  label: 'Vietnam'
                },
                {
                  id: 'yemen',
                  label: 'Yemen'
                },
                {
                  id: 'zambia',
                  label: 'Zambia'
                },
                {
                  id: 'zimbabwe',
                  label: 'Zimbabwe'
                }
              ]
            },
            {
              id: 'hasWebsite',
              dataType: 'radio-group',
              label: 'Does your innovation have a website?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes',
                  conditional: {
                    id: 'website',
                    dataType: 'text',
                    label: 'Website',
                    validations: {
                      isRequired: 'Website url is required',
                      maxLength: 100,
                      urlFormat: true
                    }
                  }
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            },
            {
              id: 'categories',
              dataType: 'checkbox-array',
              label: 'Select all the categories that can be used to describe your innovation',
              validations: {
                isRequired: 'Choose at least one category'
              },
              items: [
                {
                  id: 'medicalDevice',
                  label: 'Medical device'
                },
                {
                  id: 'inVitroDiagnostic',
                  label: 'In vitro diagnostic'
                },
                {
                  id: 'pharmaceutical',
                  label: 'Pharmaceutical'
                },
                {
                  id: 'digital',
                  label: 'Digital (including apps, platforms, software)'
                },
                {
                  id: 'ai',
                  label: 'Artificial intelligence (AI)'
                },
                {
                  id: 'education',
                  label: 'Education or training of workforce'
                },
                {
                  id: 'ppe',
                  label: 'Personal protective equipment (PPE)'
                },
                {
                  id: 'modelsCare',
                  label: 'Models of care and clinical pathways'
                },
                {
                  id: 'estatesFacilities',
                  label: 'Estates and facilities'
                },
                {
                  id: 'travelTransport',
                  label: 'Travel and transport'
                },
                {
                  id: 'foodNutrition',
                  label: 'Food and nutrition'
                },
                {
                  id: 'dataMonitoring',
                  label: 'Data and monitoring'
                },
                {
                  id: 'other',
                  label: 'Other',
                  conditional: {
                    id: 'otherCategoryDescription',
                    dataType: 'text',
                    label: 'Other category',
                    validations: {
                      isRequired: 'Other category description is required',
                      maxLength: 100
                    }
                  }
                }
              ]
            },
            {
              id: 'mainCategory',
              dataType: 'radio-group',
              label: 'Select a primary category to describe your innovation',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [{ itemsFromAnswer: 'categories' }]
            },
            {
              id: 'areas',
              dataType: 'checkbox-array',
              label: 'Is your innovation relevant to any of the following areas?',
              description:
                'We ask this to identify the organisations and people who are in the best position to support you.',
              items: [
                {
                  id: 'covid19',
                  label: 'COVID-19'
                },
                {
                  id: 'dataAnalyticsAndResearch',
                  label: 'Data, analytics and research'
                },
                {
                  id: 'digitalisingSystem',
                  label: 'Digitalising the system'
                },
                {
                  id: 'improvingSystemFlow',
                  label: 'Improving system flow'
                },
                {
                  id: 'independenceAndPrevention',
                  label: 'Independence and prevention'
                },
                {
                  id: 'operationalExcellence',
                  label: 'Operational excellence'
                },
                {
                  id: 'patientActivationAndSelfCare',
                  label: 'Patient activation and self-care'
                },
                {
                  id: 'patientSafety',
                  label: 'Patient safety and quality improvement'
                },
                {
                  id: 'workforceResourceOptimisation',
                  label: 'Workforce resource optimisation'
                },
                {
                  id: 'netZeroGreenerInnovation',
                  label: 'Net zero NHS or greener innovation'
                }
              ]
            },
            {
              id: 'careSettings',
              dataType: 'checkbox-array',
              label: 'In which care settings is your innovation relevant?',
              validations: {
                isRequired: 'Choose at least one category'
              },
              items: [
                {
                  id: 'academia',
                  label: 'Academia'
                },
                {
                  id: 'acuteTrustsInpatient',
                  label: 'Acute trust - inpatient'
                },
                {
                  id: 'acuteTrustsOutpatient',
                  label: 'Acute trust - outpatient'
                },
                {
                  id: 'ambulance',
                  label: 'Ambulance'
                },
                {
                  id: 'careHomesCareSetting',
                  label: 'Care homes or care setting'
                },
                {
                  id: 'endLifeCare',
                  label: 'End of life care (EOLC)'
                },
                {
                  id: 'ics',
                  label: 'ICS'
                },
                {
                  id: 'industry',
                  label: 'Industry'
                },
                {
                  id: 'localAuthorityEducation',
                  label: 'Local authority - education'
                },
                {
                  id: 'mentalHealth',
                  label: 'Mental health'
                },
                {
                  id: 'pharmacy',
                  label: 'Pharmacies'
                },
                {
                  id: 'primaryCare',
                  label: 'Primary care'
                },
                {
                  id: 'socialCare',
                  label: 'Social care'
                },
                {
                  id: 'thirdSectorOrganisations',
                  label: 'Third sector organisations'
                },
                {
                  id: 'urgentAndEmergency',
                  label: 'Urgent and emergency'
                },
                {
                  id: 'other',
                  label: 'Other',
                  conditional: {
                    id: 'otherCareSetting',
                    dataType: 'text',
                    label: 'Other care setting',
                    validations: {
                      isRequired: 'Other care setting description is required',
                      maxLength: 100
                    }
                  }
                }
              ]
            },
            {
              id: 'mainPurpose',
              dataType: 'radio-group',
              label: 'What is the main purpose of your innovation?',
              description:
                'We ask this to identify the organisations and people who are in the best position to support you.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'preventCondition',
                  label: 'Preventing a condition or symptom from happening or worsening'
                },
                {
                  id: 'predictCondition',
                  label: 'Predicting the occurence of a condition or symptom'
                },
                {
                  id: 'diagnoseCondition',
                  label: 'Diagnosing a condition'
                },
                {
                  id: 'monitorCondition',
                  label: 'Monitoring a condition, treatment or therapy'
                },
                {
                  id: 'provideTreatment',
                  label: 'Providing treatment or therapy'
                },
                {
                  id: 'manageCondition',
                  label: 'Managing a condition'
                },
                {
                  id: 'enablingCare',
                  label: 'Enabling care, services or communication'
                },
                {
                  id: 'risksClimateChange',
                  label:
                    'Supporting the NHS to mitigate the risks or effects of climate change and severe weather conditions'
                }
              ]
            },
            {
              id: 'supportDescription',
              dataType: 'textarea',
              label: 'What support are you seeking from the Innovation Service?',
              description:
                '<p>For example, support with clinical trials, product development, real-world evidence, regulatory advice, or adoption.</p><p>You will have the opportunity to explain how your innovation works and its benefits later in the record</p>',
              lengthLimit: 'xl',
              validations: {
                isRequired: 'A description is required'
              }
            },
            {
              id: 'currentlyReceivingSupport',
              dataType: 'textarea',
              label: 'Are you currently receiving any support for your innovation?',
              description:
                'This can include any UK funding to support the development of your innovation, or any support you are currently receiving from <a href={{urls.ORGANISATIONS_BEHIND_THE_SERVICE}} target="_blank" rel="noopener noreferrer">NHS Innovation Service organisations (opens in a new window)</a>.',
              lengthLimit: 'xl',
              validations: {
                isRequired: 'A description is required'
              }
            },
            {
              id: 'involvedAACProgrammes',
              dataType: 'checkbox-array',
              label: 'Are you involved with any Accelerated Access Collaborative programmes?',
              description: 'Select all that apply, or select no, if not relevant.',
              validations: {
                isRequired: 'Choose at least one category'
              },
              items: [
                {
                  id: 'no',
                  label: 'No',
                  exclusive: true
                },
                {
                  type: 'separator'
                },
                {
                  id: 'healthInnovationNetwork',
                  label: 'Health Innovation Network'
                },
                {
                  id: 'artificialIntelligenceInHealthAndCareAward',
                  label: 'Artificial Intelligence in Health and Care Award'
                },
                {
                  id: 'clinicalEntrepreneurProgramme',
                  label: 'Clinical Entrepreneur Programme'
                },
                {
                  id: 'earlyAccessToMedicinesScheme',
                  label: 'Early Access to Medicines Scheme'
                },
                {
                  id: 'innovationForHealthcareInequalitiesProgramme',
                  label: 'Innovation for Healthcare Inequalities Programme'
                },
                {
                  id: 'innovationAndTechnologyPaymentProgramme',
                  label: 'Innovation and Technology Payment Programme'
                },
                {
                  id: 'nhsInnovationAccelerator',
                  label: 'NHS Innovation Accelerator'
                },
                {
                  id: 'nhsInsightsPrioritisationProgramme',
                  label: 'NHS Insights Prioritisation Programme'
                },
                {
                  id: 'pathwayTransformationFund',
                  label: 'Pathway Transformation Fund'
                },
                {
                  id: 'rapidUptakeProductsProgramme',
                  label: 'Rapid Uptake Products Programme'
                },
                {
                  id: 'smallBusinessResearchInitiativeForHealthcare',
                  label: 'Small Business Research Initiative for Healthcare'
                },
                {
                  id: 'testBeds',
                  label: 'Test beds'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'valueProposition',
      title: 'Value proposition',
      subSections: [
        {
          id: 'understandingOfNeeds',
          title: 'Detailed understanding of needs and benefits',
          questions: [
            {
              id: 'problemsTackled',
              dataType: 'textarea',
              label: 'What problem is your innovation trying to solve?',
              description:
                "<p>Include the current consequences of the problem.</p><p>For example, the process of checking a patient's pulse to determine if there is atrial fibrillation using a finger and a watch is inherently inaccurate. Using this method approximately 25% of patients are not referred to secondary care who should be (false negative) and 15% of patients who are referred are referred unnecessarily (false positive). For those patients who are not picked up at this stage, their underlying disease will progress before being correctly diagnosed.</p>",
              lengthLimit: 'l',
              validations: {
                isRequired: 'A description is required'
              }
            },
            {
              id: 'howInnovationWork',
              dataType: 'textarea',
              label: 'Give an overview of how your innovation works',
              description:
                '<p>If this is or might be a medical device, include the <a href={{urls.MEDICAL_DEVICES_INTENDED_PURPOSE_STATEMENT}} target="_blank" rel="noopener noreferrer">intended purpose statement (opens in a new window)</a>.</p><p>For example, GPs will identify patients with suspected atrial fibrillation from their history and reported symptoms. This innovation is a portable device that patients wear over a 7-day period. The device will monitor the patient’s heart rate continuously whilst they are wearing it. GPs will need to be trained in using the device and interpreting the results. GP practices will need to store the device and consumables.</p>',
              lengthLimit: 'l',
              validations: {
                isRequired: 'A description is required'
              }
            },
            {
              id: 'hasProductServiceOrPrototype',
              dataType: 'radio-group',
              label: 'Do you have a working product, service or prototype?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            },
            {
              id: 'benefitsOrImpact',
              dataType: 'checkbox-array',
              label: 'What are the benefits or impact of your innovation?',
              items: [
                {
                  id: 'reducesMortality',
                  label: 'Reduces mortality',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'reducesNeedForFurtherTreatment',
                  label: 'Reduces need for further treatment',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'reducesAdverseEvents',
                  label: 'Reduces adverse events',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'enablesEarlierOrMoreAccurateDiagnosis',
                  label: 'Enables earlier or more accurate diagnosis',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'reducesRisksSideEffectsOrComplications',
                  label: 'Reduces risks, side effects or complications',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'preventsAConditionOccurringOrExacerbating',
                  label: 'Prevents a condition occurring or exacerbating',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'avoidsATestProcedureOrUnnecessaryTreatment',
                  label: 'Avoids a test, procedure or unnecessary treatment',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'enablesATestProcedureOrTreatmentToBeDoneNonInvasively',
                  label: 'Enables a test, procedure or treatment to be done non-invasively',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'increasesSelfManagement',
                  label: 'Increases self-management',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'increasesQualityOfLife',
                  label: 'Increases quality of life',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'enablesSharedCare',
                  label: 'Enables shared care',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'alleviatesPain',
                  label: 'Alleviates pain',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'otherBenefitsForPatientsAndPeople',
                  label: 'Other benefits for patients and people',
                  group: 'Benefits for patients and people'
                },
                {
                  id: 'reducesTheLengthOfStayOrEnablesEarlierDischarge',
                  label: 'Reduces the length of stay or enables earlier discharge',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'reducesNeedForAdultOrPaediatricCriticalCare',
                  label: 'Reduces need for adult or paediatric critical care',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'reducesEmergencyAdmissions',
                  label: 'Reduces emergency admissions',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'changesDeliveryOfCareFromSecondaryCareForExampleHospitalsToPrimaryCareForExampleGpOrCommunityServices',
                  label:
                    'Changes delivery of care from secondary care(for example hospitals) to primary care(for example GP or community services)',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'changeInDeliveryOfCareFromInpatientToDayCase',
                  label: 'Change in delivery of care from inpatient to day case',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'increasesCompliance',
                  label: 'Increases compliance',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'improvesPatientManagementOrCoordinationOfCareOrServices',
                  label: 'Improves patient management or coordination of care or services',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'reducesReferrals',
                  label: 'Reduces referrals',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'takesLessTime',
                  label: 'Takes less time',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'usesNoStaffOrALowerGradeOfStaff',
                  label: 'Uses no staff or a lower grade of staff',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'leadsToFewerAppointments',
                  label: 'Leads to fewer appointments',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'isCostSaving',
                  label: 'Is cost saving',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'increasesEfficiency',
                  label: 'Increases efficiency',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'improvesPerformance',
                  label: 'Improves performance',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'reducesCarbonEmissionsAndSupportsTheNhsToAchieveNetZero',
                  label: 'Reduces carbon emissions and supports the NHS to achieve net zero',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'otherEnvironmentalBenefits',
                  label: 'Other environmental benefits',
                  group: 'Benefits for the NHS and social care'
                },
                {
                  id: 'otherBenefitsForTheNhsAndSocialCare',
                  label: 'Other benefits for the NHS and social care',
                  group: 'Benefits for the NHS and social care'
                }
              ]
            },
            {
              id: 'impactDiseaseCondition',
              dataType: 'radio-group',
              label: 'Does your innovation impact a disease or condition?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            },
            {
              id: 'diseasesConditionsImpact',
              dataType: 'autocomplete-array',
              label: 'What diseases or conditions does your innovation impact?',
              description: 'Start typing to view conditions. You can select as many conditions as you like.',
              validations: {
                isRequired: 'You must choose at least one disease or condition'
              },
              condition: "data.impactDiseaseCondition == 'yes'",
              items: [
                {
                  id: 'bloodAndImmuneSystemConditions',
                  label: 'Blood and immune system conditions'
                },
                {
                  id: 'bloodAndImmuneSystemConditionsAllergies',
                  label: 'Blood and immune system conditions - Allergies'
                },
                {
                  id: 'bloodAndImmuneSystemConditionsAnaphylaxis',
                  label: 'Blood and immune system conditions - Anaphylaxis'
                },
                {
                  id: 'bloodAndImmuneSystemConditionsBloodConditions',
                  label: 'Blood and immune system conditions - Blood conditions'
                },
                {
                  id: 'bloodAndImmuneSystemConditionsLymphoedema',
                  label: 'Blood and immune system conditions - Lymphoedema'
                },
                {
                  id: 'bloodAndImmuneSystemConditionsSystemicLupusErythematosus',
                  label: 'Blood and immune system conditions - Systemic lupus erythematosus'
                },
                {
                  id: 'cancer',
                  label: 'Cancer'
                },
                {
                  id: 'cancerBladderCancer',
                  label: 'Cancer - Bladder cancer'
                },
                {
                  id: 'cancerBloodAndBoneMarrowCancers',
                  label: 'Cancer - Blood and bone marrow cancers'
                },
                {
                  id: 'cancerBrainCancers',
                  label: 'Cancer - Brain cancers'
                },
                {
                  id: 'cancerBreastCancer',
                  label: 'Cancer - Breast cancer'
                },
                {
                  id: 'cancerCervicalCancer',
                  label: 'Cancer - Cervical cancer'
                },
                {
                  id: 'cancerColorectalCancer',
                  label: 'Cancer - Colorectal cancer'
                },
                {
                  id: 'cancerComplicationsOfCancer',
                  label: 'Cancer - Complications of cancer'
                },
                {
                  id: 'cancerEndometrialCancers',
                  label: 'Cancer - Endometrial cancers'
                },
                {
                  id: 'cancerHeadAndNeckCancers',
                  label: 'Cancer - Head and neck cancers'
                },
                {
                  id: 'cancerLiverCancers',
                  label: 'Cancer - Liver cancers'
                },
                {
                  id: 'cancerLungCancer',
                  label: 'Cancer - Lung cancer'
                },
                {
                  id: 'cancerMetastases',
                  label: 'Cancer - Metastases'
                },
                {
                  id: 'cancerOesophagealCancer',
                  label: 'Cancer - Oesophageal cancer'
                },
                {
                  id: 'cancerOvarianCancer',
                  label: 'Cancer - Ovarian cancer'
                },
                {
                  id: 'cancerPancreaticCancer',
                  label: 'Cancer - Pancreatic cancer'
                },
                {
                  id: 'cancerPenileAndTesticularCancer',
                  label: 'Cancer - Penile and testicular cancer'
                },
                {
                  id: 'cancerPeritonealCancer',
                  label: 'Cancer - Peritoneal cancer'
                },
                {
                  id: 'cancerProstateCancer',
                  label: 'Cancer - Prostate cancer'
                },
                {
                  id: 'cancerRenalCancer',
                  label: 'Cancer - Renal cancer'
                },
                {
                  id: 'cancerSarcoma',
                  label: 'Cancer - Sarcoma'
                },
                {
                  id: 'cancerSkinCancer',
                  label: 'Cancer - Skin cancer'
                },
                {
                  id: 'cancerStomachCancer',
                  label: 'Cancer - Stomach cancer'
                },
                {
                  id: 'cancerThyroidCancer',
                  label: 'Cancer - Thyroid cancer'
                },
                {
                  id: 'cancerUpperAirwaysTractCancers',
                  label: 'Cancer - Upper airways tract cancers'
                },
                {
                  id: 'cardiovascularConditions',
                  label: 'Cardiovascular conditions'
                },
                {
                  id: 'cardiovascularConditionsAcuteCoronarySyndromes',
                  label: 'Cardiovascular conditions - Acute coronary syndromes'
                },
                {
                  id: 'cardiovascularConditionsAorticAneurysms',
                  label: 'Cardiovascular conditions - Aortic aneurysms'
                },
                {
                  id: 'cardiovascularConditionsCranialAneurysms',
                  label: 'Cardiovascular conditions - Cranial aneurysms'
                },
                {
                  id: 'cardiovascularConditionsEmbolismAndThrombosis',
                  label: 'Cardiovascular conditions - Embolism and thrombosis'
                },
                {
                  id: 'cardiovascularConditionsHeartFailure',
                  label: 'Cardiovascular conditions - Heart failure'
                },
                {
                  id: 'cardiovascularConditionsHeartRhythmConditions',
                  label: 'Cardiovascular conditions - Heart rhythm conditions'
                },
                {
                  id: 'cardiovascularConditionsHypertension',
                  label: 'Cardiovascular conditions - Hypertension'
                },
                {
                  id: 'cardiovascularConditionsPeripheralCirculatoryConditions',
                  label: 'Cardiovascular conditions - Peripheral circulatory conditions'
                },
                {
                  id: 'cardiovascularConditionsStableAngina',
                  label: 'Cardiovascular conditions - Stable angina'
                },
                {
                  id: 'cardiovascularConditionsStrokeAndTransientIschaemicAttack',
                  label: 'Cardiovascular conditions - Stroke and transient ischaemic attack'
                },
                {
                  id: 'cardiovascularConditionsStructuralHeartDefects',
                  label: 'Cardiovascular conditions - Structural heart defects'
                },
                {
                  id: 'cardiovascularConditionsVaricoseVeins',
                  label: 'Cardiovascular conditions - Varicose veins'
                },
                {
                  id: 'chronicAndNeuropathicPain',
                  label: 'Chronic and neuropathic pain'
                },
                {
                  id: 'chronicFatigueSyndrome',
                  label: 'Chronic fatigue syndrome'
                },
                {
                  id: 'cysticFibrosis',
                  label: 'Cystic fibrosis'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditions',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsAdrenalDysfunction',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Adrenal dysfunction'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsDiabetes',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Diabetes'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsFailureToThrive',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Failure to thrive'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsLipidDisorders',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Lipid disorders'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsMalnutrition',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Malnutrition'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsMetabolicConditions',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Metabolic conditions'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsObesity',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Obesity'
                },
                {
                  id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsThyroidDisorders',
                  label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Thyroid disorders'
                },
                {
                  id: 'digestiveTractConditions',
                  label: 'Digestive tract conditions'
                },
                {
                  id: 'digestiveTractConditionsCholelithiasisAndCholecystitis',
                  label: 'Digestive tract conditions - Cholelithiasis and cholecystitis'
                },
                {
                  id: 'digestiveTractConditionsCoeliacDisease',
                  label: 'Digestive tract conditions - Coeliac disease'
                },
                {
                  id: 'digestiveTractConditionsConstipation',
                  label: 'Digestive tract conditions - Constipation'
                },
                {
                  id: 'digestiveTractConditionsDiarrhoeaAndVomiting',
                  label: 'Digestive tract conditions - Diarrhoea and vomiting'
                },
                {
                  id: 'digestiveTractConditionsDiverticularDisease',
                  label: 'Digestive tract conditions - Diverticular disease'
                },
                {
                  id: 'digestiveTractConditionsFaecalIncontinence',
                  label: 'Digestive tract conditions - Faecal incontinence'
                },
                {
                  id: 'digestiveTractConditionsGastroOesophagealRefluxIncludingBarrettsOesophagus',
                  label: "Digestive tract conditions - Gastro-oesophageal reflux, including Barrett's oesophagus"
                },
                {
                  id: 'digestiveTractConditionsGastroparesis',
                  label: 'Digestive tract conditions - Gastroparesis'
                },
                {
                  id: 'digestiveTractConditionsHaemorrhoidsAndOtherAnalConditions',
                  label: 'Digestive tract conditions - Haemorrhoids and other anal conditions'
                },
                {
                  id: 'digestiveTractConditionsHernia',
                  label: 'Digestive tract conditions - Hernia'
                },
                {
                  id: 'digestiveTractConditionsInflammatoryBowelDisease',
                  label: 'Digestive tract conditions - Inflammatory bowel disease'
                },
                {
                  id: 'digestiveTractConditionsIrritableBowelSyndrome',
                  label: 'Digestive tract conditions - Irritable bowel syndrome'
                },
                {
                  id: 'digestiveTractConditionsLowerGastrointestinalLesions',
                  label: 'Digestive tract conditions - Lower gastrointestinal lesions'
                },
                {
                  id: 'digestiveTractConditionsPancreatitis',
                  label: 'Digestive tract conditions - Pancreatitis'
                },
                {
                  id: 'digestiveTractConditionsUpperGastrointestinalBleeding',
                  label: 'Digestive tract conditions - Upper gastrointestinal bleeding'
                },
                {
                  id: 'earNoseAndThroatConditions',
                  label: 'Ear, nose and throat conditions'
                },
                {
                  id: 'eyeConditions',
                  label: 'Eye conditions'
                },
                {
                  id: 'fertilityPregnancyAndChildbirth',
                  label: 'Fertility, pregnancy and childbirth'
                },
                {
                  id: 'fertilityPregnancyAndChildbirthContraception',
                  label: 'Fertility, pregnancy and childbirth - Contraception'
                },
                {
                  id: 'fertilityPregnancyAndChildbirthFertility',
                  label: 'Fertility, pregnancy and childbirth - Fertility'
                },
                {
                  id: 'fertilityPregnancyAndChildbirthIntrapartumCare',
                  label: 'Fertility, pregnancy and childbirth - Intrapartum care'
                },
                {
                  id: 'fertilityPregnancyAndChildbirthPostnatalCare',
                  label: 'Fertility, pregnancy and childbirth - Postnatal care'
                },
                {
                  id: 'fertilityPregnancyAndChildbirthPregnancy',
                  label: 'Fertility, pregnancy and childbirth - Pregnancy'
                },
                {
                  id: 'fertilityPregnancyAndChildbirthTerminationOfPregnancyServices',
                  label: 'Fertility, pregnancy and childbirth - Termination of pregnancy services'
                },
                {
                  id: 'gynaecologicalConditions',
                  label: 'Gynaecological conditions'
                },
                {
                  id: 'gynaecologicalConditionsEndometriosisAndFibroids',
                  label: 'Gynaecological conditions - Endometriosis and fibroids'
                },
                {
                  id: 'gynaecologicalConditionsHeavyMenstrualBleeding',
                  label: 'Gynaecological conditions - Heavy menstrual bleeding'
                },
                {
                  id: 'gynaecologicalConditionsMenopause',
                  label: 'Gynaecological conditions - Menopause'
                },
                {
                  id: 'gynaecologicalConditionsUterineProlapse',
                  label: 'Gynaecological conditions - Uterine prolapse'
                },
                {
                  id: 'gynaecologicalConditionsVaginalConditions',
                  label: 'Gynaecological conditions - Vaginal conditions'
                },
                {
                  id: 'infections',
                  label: 'Infections'
                },
                {
                  id: 'infectionsAntimicrobialStewardship',
                  label: 'Infections - Antimicrobial stewardship'
                },
                {
                  id: 'infectionsBitesAndStings',
                  label: 'Infections - Bites and stings'
                },
                {
                  id: 'infectionsCovid19',
                  label: 'Infections - COVID-19'
                },
                {
                  id: 'infectionsFeverishIllness',
                  label: 'Infections - Feverish illness'
                },
                {
                  id: 'infectionsHealthcareAssociatedInfections',
                  label: 'Infections - Healthcare-associated infections'
                },
                {
                  id: 'infectionsHivAndAids',
                  label: 'Infections - HIV and AIDS'
                },
                {
                  id: 'infectionsInfluenza',
                  label: 'Infections - Influenza'
                },
                {
                  id: 'infectionsMeningitisAndMeningococcalSepticaemia',
                  label: 'Infections - Meningitis and meningococcal septicaemia'
                },
                {
                  id: 'infectionsSepsis',
                  label: 'Infections - Sepsis'
                },
                {
                  id: 'infectionsSkinInfections',
                  label: 'Infections - Skin infections'
                },
                {
                  id: 'infectionsTuberculosis',
                  label: 'Infections - Tuberculosis'
                },
                {
                  id: 'injuriesAccidentsAndWounds',
                  label: 'Injuries, accidents and wounds'
                },
                {
                  id: 'kidneyConditions',
                  label: 'Kidney conditions'
                },
                {
                  id: 'kidneyConditionsAcuteKidneyInjury',
                  label: 'Kidney conditions - Acute kidney injury'
                },
                {
                  id: 'kidneyConditionsChronicKidneyDisease',
                  label: 'Kidney conditions - Chronic kidney disease'
                },
                {
                  id: 'kidneyConditionsRenalStones',
                  label: 'Kidney conditions - Renal stones'
                },
                {
                  id: 'liverConditions',
                  label: 'Liver conditions'
                },
                {
                  id: 'liverConditionsChronicLiverDisease',
                  label: 'Liver conditions - Chronic liver disease'
                },
                {
                  id: 'liverConditionsHepatitis',
                  label: 'Liver conditions - Hepatitis'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditions',
                  label: 'Mental health and behavioural conditions'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsAddiction',
                  label: 'Mental health and behavioural conditions - Addiction'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsAlcoholUseDisorders',
                  label: 'Mental health and behavioural conditions - Alcohol-use disorders'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsAnxiety',
                  label: 'Mental health and behavioural conditions - Anxiety'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsAttentionDeficitDisorder',
                  label: 'Mental health and behavioural conditions - Attention deficit disorder'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsAutism',
                  label: 'Mental health and behavioural conditions - Autism'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsBipolarDisorder',
                  label: 'Mental health and behavioural conditions - Bipolar disorder'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsDelirium',
                  label: 'Mental health and behavioural conditions - Delirium'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsDementia',
                  label: 'Mental health and behavioural conditions - Dementia'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsDepression',
                  label: 'Mental health and behavioural conditions - Depression'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsDrugMisuse',
                  label: 'Mental health and behavioural conditions - Drug misuse'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsEatingDisorders',
                  label: 'Mental health and behavioural conditions - Eating disorders'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsMentalHealthServices',
                  label: 'Mental health and behavioural conditions - Mental health services'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsPersonalityDisorders',
                  label: 'Mental health and behavioural conditions - Personality disorders'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsPsychosisAndSchizophrenia',
                  label: 'Mental health and behavioural conditions - Psychosis and schizophrenia'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsSelfHarm',
                  label: 'Mental health and behavioural conditions - Self-harm'
                },
                {
                  id: 'mentalHealthAndBehaviouralConditionsSuicidePrevention',
                  label: 'Mental health and behavioural conditions - Suicide prevention'
                },
                {
                  id: 'multipleLongTermConditions',
                  label: 'Multiple long-term conditions'
                },
                {
                  id: 'musculoskeletalConditions',
                  label: 'Musculoskeletal conditions'
                },
                {
                  id: 'musculoskeletalConditionsArthritis',
                  label: 'Musculoskeletal conditions - Arthritis'
                },
                {
                  id: 'musculoskeletalConditionsFractures',
                  label: 'Musculoskeletal conditions - Fractures'
                },
                {
                  id: 'musculoskeletalConditionsHipConditions',
                  label: 'Musculoskeletal conditions - Hip conditions'
                },
                {
                  id: 'musculoskeletalConditionsJointReplacement',
                  label: 'Musculoskeletal conditions - Joint replacement'
                },
                {
                  id: 'musculoskeletalConditionsKneeConditions',
                  label: 'Musculoskeletal conditions - Knee conditions'
                },
                {
                  id: 'musculoskeletalConditionsLowBackPain',
                  label: 'Musculoskeletal conditions - Low back pain'
                },
                {
                  id: 'musculoskeletalConditionsMaxillofacialConditions',
                  label: 'Musculoskeletal conditions - Maxillofacial conditions'
                },
                {
                  id: 'musculoskeletalConditionsOsteoporosis',
                  label: 'Musculoskeletal conditions - Osteoporosis'
                },
                {
                  id: 'musculoskeletalConditionsSpinalConditions',
                  label: 'Musculoskeletal conditions - Spinal conditions'
                },
                {
                  id: 'neurologicalConditions',
                  label: 'Neurological conditions'
                },
                {
                  id: 'neurologicalConditionsEpilepsy',
                  label: 'Neurological conditions - Epilepsy'
                },
                {
                  id: 'neurologicalConditionsHeadaches',
                  label: 'Neurological conditions - Headaches'
                },
                {
                  id: 'neurologicalConditionsMetastaticSpinalCordCompression',
                  label: 'Neurological conditions - Metastatic spinal cord compression'
                },
                {
                  id: 'neurologicalConditionsMotorNeuroneDisease',
                  label: 'Neurological conditions - Motor neurone disease'
                },
                {
                  id: 'neurologicalConditionsMultipleSclerosis',
                  label: 'Neurological conditions - Multiple sclerosis'
                },
                {
                  id: 'neurologicalConditionsParkinsonsDiseaseTremorAndDystonia',
                  label: "Neurological conditions - Parkinson's disease, tremor and dystonia"
                },
                {
                  id: 'neurologicalConditionsSpasticity',
                  label: 'Neurological conditions - Spasticity'
                },
                {
                  id: 'neurologicalConditionsTransientLossOfConsciousness',
                  label: 'Neurological conditions - Transient loss of consciousness'
                },
                {
                  id: 'oralAndDentalHealth',
                  label: 'Oral and dental health'
                },
                {
                  id: 'respiratoryConditions',
                  label: 'Respiratory conditions'
                },
                {
                  id: 'respiratoryConditionsAsthma',
                  label: 'Respiratory conditions - Asthma'
                },
                {
                  id: 'respiratoryConditionsChronicObstructivePulmonaryDisease',
                  label: 'Respiratory conditions - Chronic obstructive pulmonary disease'
                },
                {
                  id: 'respiratoryConditionsCysticFibrosis',
                  label: 'Respiratory conditions - Cystic fibrosis'
                },
                {
                  id: 'respiratoryConditionsMesothelioma',
                  label: 'Respiratory conditions - Mesothelioma'
                },
                {
                  id: 'respiratoryConditionsPneumonia',
                  label: 'Respiratory conditions - Pneumonia'
                },
                {
                  id: 'respiratoryConditionsPulmonaryFibrosis',
                  label: 'Respiratory conditions - Pulmonary fibrosis'
                },
                {
                  id: 'respiratoryConditionsRespiratoryInfections',
                  label: 'Respiratory conditions - Respiratory infections'
                },
                {
                  id: 'skinConditions',
                  label: 'Skin conditions'
                },
                {
                  id: 'skinConditionsAcne',
                  label: 'Skin conditions - Acne'
                },
                {
                  id: 'skinConditionsDiabeticFoot',
                  label: 'Skin conditions - Diabetic foot'
                },
                {
                  id: 'skinConditionsEczema',
                  label: 'Skin conditions - Eczema'
                },
                {
                  id: 'skinConditionsPressureUlcers',
                  label: 'Skin conditions - Pressure ulcers'
                },
                {
                  id: 'skinConditionsPsoriasis',
                  label: 'Skin conditions - Psoriasis'
                },
                {
                  id: 'skinConditionsWoundManagement',
                  label: 'Skin conditions - Wound management'
                },
                {
                  id: 'sleepAndSleepConditions',
                  label: 'Sleep and sleep conditions'
                },
                {
                  id: 'urologicalConditions',
                  label: 'Urological conditions'
                },
                {
                  id: 'urologicalConditionsLowerUrinaryTractSymptoms',
                  label: 'Urological conditions - Lower urinary tract symptoms'
                },
                {
                  id: 'urologicalConditionsUrinaryIncontinence',
                  label: 'Urological conditions - Urinary incontinence'
                },
                {
                  id: 'urologicalConditionsUrinaryTractInfection',
                  label: 'Urological conditions - Urinary tract infection'
                }
              ]
            },
            {
              id: 'estimatedCarbonReductionSavings',
              dataType: 'radio-group',
              label: 'Have you estimated the carbon reduction or savings that your innovation will bring?',
              description:
                '<p>All NHS suppliers will be expected to provide the carbon footprint associated with the use of their innovation, as outlined in the <a href={{urls.DELIVERING_A_NET_ZERO_NHS}} target="_blank" rel="noopener noreferrer">Delivering a Net Zero NHS report (opens in a new window)</a>.</p><p>If this is something you are unsure of, the NHS Innovation Service can support you with this.</p>',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'notYet',
                  label: 'Not yet, but I have an idea'
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            },
            {
              id: 'estimatedCarbonReductionSavingsDescriptionA',
              dataType: 'textarea',
              label: 'Provide the estimates and how this was calculated',
              lengthLimit: 'xl',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.estimatedCarbonReductionSavings == 'yes'"
            },
            {
              id: 'estimatedCarbonReductionSavingsDescriptionB',
              dataType: 'textarea',
              label: 'Explain how you plan to calculate carbon reduction savings',
              lengthLimit: 'xl',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.estimatedCarbonReductionSavings == 'notYet'"
            },
            {
              id: 'carbonReductionPlan',
              dataType: 'radio-group',
              label: 'Do you have or are you working on a carbon reduction plan (CRP)?',
              description:
                'All NHS suppliers will require a carbon reduction plan (CRP), as outlined in the <a href="{{urls.SUPPLIERS}}" target="_blank" rel="noopener noreferrer">NHS Suppliers Roadmap plan (opens in a new window)</a>.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes, I have one'
                },
                {
                  id: 'workingOn',
                  label: 'I am working on one'
                },
                {
                  id: 'no',
                  label: 'No, I do not have one'
                }
              ]
            },
            {
              id: 'keyHealthInequalities',
              dataType: 'checkbox-array',
              label: 'Which key health inequalities does your innovation impact?',
              description:
                '<p>Core20PLUS5 is a national NHS England approach to support the reduction of health inequalities, defining target populations and clinical areas that require improvement.</p><p>More information is available on the <a href={{urls.CORE20PLUS5}} target="_blank" rel="noopener noreferrer">Core20PLUS5 web page (opens in a new window)</a>.</p>',
              validations: {
                isRequired: 'Choose at least one item'
              },
              items: [
                {
                  id: 'maternity',
                  label: 'Maternity'
                },
                {
                  id: 'severMentalIllness',
                  label: 'Severe mental illness'
                },
                {
                  id: 'chronicRespiratoryDisease',
                  label: 'Chronic respiratory disease'
                },
                {
                  id: 'earlyCancerDiagnosis',
                  label: 'Early cancer diagnosis'
                },
                {
                  id: 'hypertensionCaseFinding',
                  label: 'Hypertension case finding and optimal management and lipid optimal management'
                },
                {
                  type: 'separator'
                },
                {
                  id: 'none',
                  label: 'None of those listed',
                  exclusive: true
                }
              ]
            },
            {
              id: 'completedHealthInequalitiesImpactAssessment',
              dataType: 'radio-group',
              label: 'Have you completed a health inequalities impact assessment?',
              description:
                '<p>By this, we mean a document or template which assesses the impact of your innovation on health inequalities and on those with protected characteristics. Health inequalities are the unfair and avoidable differences in health across the population, and between different groups within society.</p><p>An example of a completed health inequalities impact assessment can be found on <a href={{urls.EQUALITY_AND_HEALTH_INEQUALITIES_IMPACT_ASSESSMENT_EHIA}} target="_blank" rel="noopener noreferrer">NHS England\'s web page (opens in a new window)</a>.</p>',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            }
          ]
        },
        {
          id: 'evidenceOfEffectiveness',
          title: 'Evidence of impact and benefit',
          questions: [
            {
              id: 'hasEvidence',
              dataType: 'radio-group',
              label: 'Do you have any evidence to show the impact or benefits of your innovation?',
              description: "You'll have the opportunity to add evidence at the end of this section.",
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'notYet',
                  label: 'Not yet'
                }
              ]
            },
            {
              id: 'currentlyCollectingEvidence',
              dataType: 'radio-group',
              label: 'Are you currently collecting evidence, or have plans to collect evidence?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            },
            {
              id: 'summaryOngoingEvidenceGathering',
              dataType: 'textarea',
              label:
                'Write a short summary of your ongoing or planned evidence gathering, including the IRAS number if known.',
              description:
                'An IRAS ID is a unique identifier, which is generated by IRAS when you first create a project. It is the accepted common study identifier, allowing research to be traced across its study lifecycle. For more information visit the <a href={{urls.MY_RESEARCH_PROJECT}} target="_blank" rel="noopener noreferrer">IRAS website (opens in a new window)</a>.',
              lengthLimit: 'l',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.currentlyCollectingEvidence == 'yes'"
            },
            {
              id: 'needsSupportAnyArea',
              dataType: 'checkbox-array',
              label: 'Do you need support with any of these areas?',
              validations: {
                isRequired: 'Choose at least one item'
              },
              items: [
                {
                  id: 'researchGovernance',
                  label: 'Research governance, including research ethics approvals'
                },
                {
                  id: 'dataSharing',
                  label: 'Accessing and sharing health and care data'
                },
                {
                  id: 'confidentialPatientData',
                  label: 'Use of confidential patient data'
                },
                {
                  id: 'approvalDataStudies',
                  label: 'Approval of data studies'
                },
                {
                  id: 'understandingLaws',
                  label: 'Understanding the laws that regulate the use of health and care data'
                },
                {
                  type: 'separator'
                },
                {
                  id: 'doNotNeedSupport',
                  label: 'No, I do not need support',
                  exclusive: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'marketResearchAndCurrentCarePathway',
      title: 'Market research and current care pathway',
      subSections: [
        {
          id: 'marketResearch',
          title: 'Market research',
          questions: [
            {
              id: 'hasMarketResearch',
              dataType: 'radio-group',
              label:
                'Have you conducted market research to determine the demand and need for your innovation in the UK?',
              description:
                'By this, we mean any research you have done to determine the market opportunity for your innovation. You will be able to explain any testing you have done with users later in the record.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'inProgress',
                  label: "I'm currently doing market research"
                },
                {
                  id: 'notYet',
                  label: 'Not yet'
                }
              ]
            },
            {
              id: 'marketResearch',
              dataType: 'textarea',
              label: 'Describe the market research you have done, or are doing, within the UK market',
              description:
                'This could include a mix of interviews, focus groups, patient record forms, surveys, ethnography, or other market research methods.',
              lengthLimit: 'l',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.hasMarketResearch != 'notYet'"
            },
            {
              id: 'optionBestDescribesInnovation',
              dataType: 'radio-group',
              label: 'Which option best describes your innovation?',
              validations: {
                isRequired: 'Choose one option'
              },
              condition: "data.hasMarketResearch != 'notYet'",
              items: [
                {
                  id: 'oneOffInnovation',
                  label: 'A one-off innovation, or the first of its kind'
                },
                {
                  id: 'betterAlternative',
                  label: 'A better alternative to those that already exist'
                },
                {
                  id: 'equivalentAlternative',
                  label: 'An equivalent alternative to those that already exist'
                },
                {
                  id: 'costEffectAlternative',
                  label: 'A more cost-effect alternative to those that already exist'
                },
                {
                  id: 'notSure',
                  label: 'I am not sure'
                }
              ]
            },
            {
              id: 'whatCompetitorsAlternativesExist',
              dataType: 'textarea',
              label: 'What competitors or alternatives exist, or how is the problem addressed in current practice?',
              description: 'Include how your innovation is different to the alternatives in the market.',
              lengthLimit: 'l',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.hasMarketResearch != 'notYet'"
            }
          ]
        },
        {
          id: 'currentCarePathway',
          title: 'Current care pathway',
          questions: [
            {
              id: 'innovationPathwayKnowledge',
              dataType: 'radio-group',
              label: 'Does your innovation relate to a current NHS care pathway?',
              description:
                '<p>An NHS care pathway outlines the entire patient journey and the actions taken in different parts of the healthcare system. It\'s key to understand the existing routines of clinical and care professionals, administrators and others who will be impacted by your innovation.</p><p>If your innovation does not play a role in the delivery of care, select "does not form part of a care pathway".</p>',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'pathwayExistsAndChanged',
                  label: 'There is a pathway, and my innovation changes it'
                },
                {
                  id: 'pathwayExistsAndFits',
                  label: 'There is a pathway, and my innovation fits in to it'
                },
                {
                  id: 'noPathway',
                  label: 'There is no current care pathway'
                },
                {
                  id: 'dontKnow',
                  label: 'I do not know'
                },
                {
                  id: 'notPartPathway',
                  label: 'Does not form part of a care pathway'
                }
              ]
            },
            {
              id: 'potentialPathway',
              dataType: 'textarea',
              label: 'Describe the potential care pathway with your innovation in use',
              description:
                'Focus on any areas that will be impacted by introducing your innovation to the care pathway.',
              lengthLimit: 'm',
              validations: {
                isRequired: 'A description is required'
              },
              condition:
                "data.innovationPathwayKnowledge != 'dontKnow' and data.innovationPathwayKnowledge != 'notPartPathway'"
            }
          ]
        }
      ]
    },
    {
      id: 'testingWithUsers',
      title: 'Testing with users',
      subSections: [
        {
          id: 'testingWithUsers',
          title: 'Testing with users',
          questions: [
            {
              id: 'involvedUsersDesignProcess',
              dataType: 'radio-group',
              label: 'Have you involved users in the design process?',
              description:
                'This includes involving patients or the public, carers, clinicians or administrators in the design process, including people with different accessibility needs.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'oneOffInnovation',
                  label: 'A one-off innovation, or the first of its kind'
                },
                {
                  id: 'betterAlternative',
                  label: 'A better alternative to those that already exist'
                },
                {
                  id: 'equivalentAlternative',
                  label: 'An equivalent alternative to those that already exist'
                },
                {
                  id: 'costEffectAlternative',
                  label: 'A more cost-effect alternative to those that already exist'
                },
                {
                  id: 'notSure',
                  label: 'I am not sure'
                }
              ]
            },
            {
              id: 'testedWithIntendedUsers',
              dataType: 'radio-group',
              label: 'Have you tested your innovation with its intended users in a real life setting?',
              description: 'Do not include any testing you have done with users in a controlled setting.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'inProgress',
                  label: 'I am in the process of testing with users'
                },
                {
                  id: 'notYet',
                  label: 'Not yet'
                }
              ]
            },
            {
              id: 'intendedUserGroupsEngaged',
              dataType: 'checkbox-array',
              label: 'Which groups of intended users have you engaged with?',
              validations: {
                isRequired: 'Choose at least one group'
              },
              items: [
                {
                  id: 'clinicalSocialCareWorkingInsideUk',
                  label: 'Clinical or social care professionals working in the UK health and social care system'
                },
                {
                  id: 'clinicalSocialCareWorkingOutsideUk',
                  label: 'Clinical or social care professionals working outside the UK'
                },
                {
                  id: 'nonClinicalHealthcare',
                  label: 'Non-clinical healthcare staff'
                },
                {
                  id: 'patients',
                  label: 'Patients'
                },
                {
                  id: 'serviceUsers',
                  label: 'Service users'
                },
                {
                  id: 'carers',
                  label: 'Carers'
                },
                {
                  id: 'other',
                  label: 'Other',
                  conditional: {
                    id: 'otherIntendedUserGroupsEngaged',
                    dataType: 'text',
                    label: 'Other group',
                    validations: {
                      isRequired: 'Other group description is required',
                      maxLength: 100
                    }
                  }
                }
              ]
            },
            {
              id: 'userTests',
              dataType: 'fields-group',
              label: 'What kind of testing with users have you done?',
              description:
                'This can include any testing you have done with people who would use your innovation, for example patients, nurses or administrative staff.',
              field: {
                id: 'kind',
                dataType: 'text',
                label: 'User test',
                validations: {
                  isRequired: 'Required',
                  maxLength: 100
                }
              },
              addNewLabel: 'Add new user test',
              addQuestion: {
                id: 'feedback',
                dataType: 'textarea',
                label: 'Describe the testing and feedback for {{item.kind}}',
                description:
                  'Provide a brief summary of the method and key findings. You can upload any documents that showcase your user testing next.',
                validations: {
                  isRequired: 'A description is required'
                },
                lengthLimit: 's'
              }
            }
          ]
        }
      ]
    },
    {
      id: 'regulationsStandardsCertificationsAndIntellectualProperty',
      title: 'Regulations, standards, certifications and intellectual property',
      subSections: [
        {
          id: 'regulationsAndStandards',
          title: 'Regulatory approvals, standards and certifications',
          questions: [
            {
              id: 'hasRegulationKnowledge',
              dataType: 'radio-group',
              label: 'Do you know which regulations, standards and certifications apply to your innovation?',
              description:
                'Find out more about <a href="{{urls.INNOVATION_GUIDES_REGULATION}}" target="_blank" rel="noopener noreferrer">regulations (opens in a new window)</a>.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yesAll',
                  label: 'Yes, I know all of them'
                },
                {
                  id: 'yesSome',
                  label: 'Yes, I know some of them'
                },
                {
                  id: 'no',
                  label: 'No'
                },
                {
                  id: 'notRelevant',
                  label: 'Not relevant'
                }
              ]
            },
            {
              id: 'standardsType',
              dataType: 'checkbox-array',
              label: 'Which regulations, standards and certifications apply to your innovation?',
              description:
                'Find out more about <a href="{{urls.UNDERSTANDING_REGULATIONS_MEDICAL_DEVICES}}" target="_blank" rel="noopener noreferrer">UKCA / CE marking (opens in a new window)</a>, <a href="{{urls.UNDERSTANDING_CQC_REGULATIONS}}" target="_blank" rel="noopener noreferrer">CQC registration (opens in a new window)</a>, or <a href={{urls.NHS_DIGITAL_TECHNOLOGY_ASSESSMENT_CRITERIA}} target="_blank" rel="noopener noreferrer">DTAC (opens in a new window)</a>.',
              validations: {
                isRequired: 'Choose at least one option'
              },
              condition: "data.hasRegulationKnowledge != 'no' and data.hasRegulationKnowledge != 'notRelevant'",
              items: [
                {
                  id: 'ceUkcaNonMedical',
                  label: 'Non-medical device',
                  group: 'UKCA / CE'
                },
                {
                  id: 'ceUkcaClassI',
                  label: 'Class I medical device',
                  group: 'UKCA / CE'
                },
                {
                  id: 'ceUkcaClassIiA',
                  label: 'Class IIa medical device',
                  group: 'UKCA / CE'
                },
                {
                  id: 'ceUkcaClassIiB',
                  label: 'Class IIb medical device',
                  group: 'UKCA / CE'
                },
                {
                  id: 'ceUkcaClassIii',
                  label: 'Class III medical device',
                  group: 'UKCA / CE'
                },
                {
                  id: 'ivdGeneral',
                  label: 'IVD general',
                  group: 'In-vitro diagnostics'
                },
                {
                  id: 'ivdSelfTest',
                  label: 'IVD self-test',
                  group: 'In-vitro diagnostics'
                },
                {
                  id: 'ivdAnnexListA',
                  label: 'IVD Annex II List A',
                  group: 'In-vitro diagnostics'
                },
                {
                  id: 'ivdAnnexListB',
                  label: 'IVD Annex II List B',
                  group: 'In-vitro diagnostics'
                },
                {
                  id: 'marketing',
                  label: 'Marketing authorisation for medicines'
                },
                {
                  id: 'cqc',
                  label: 'Care Quality Commission (CQC) registration, as I am providing a regulated activity'
                },
                {
                  id: 'dtac',
                  label: 'Digital Technology Assessment Criteria (DTAC)'
                },
                {
                  id: 'other',
                  label: 'Other',
                  conditional: {
                    id: 'otherRegulationDescription',
                    dataType: 'text',
                    label: 'Other regulations, standards and certifications that apply',
                    validations: {
                      isRequired: 'Other regulations, standards and certifications is required',
                      maxLength: 100
                    }
                  }
                }
              ]
            },
            {
              id: 'standardHasMet',
              dataType: 'connected-radio-group',
              label: 'Do you have a certification for {{item}}',
              connectedQuestion: 'standardsType',
              validations: { 
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'inProgress',
                  label: 'I am actively working towards it'
                },
                {
                  id: 'notYet',
                  label: 'Not yet'
                }
              ]
            }
          ]
        },
        {
          id: 'intellectualProperty',
          title: 'Intellectual property',
          questions: [
            {
              id: 'hasPatents',
              dataType: 'radio-group',
              label: 'Do you have any patents for your innovation?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'hasAtLeastOne',
                  label: 'I have one or more patents',
                  conditional: {
                    id: 'patentNumbers',
                    dataType: 'text',
                    label: 'Patent number(s)',
                    validations: {
                      isRequired: 'Patent number(s) required',
                      maxLength: 100
                    }
                  }
                },
                {
                  id: 'appliedAtLeastOne',
                  label: 'I have applied for one or more patents'
                },
                {
                  id: 'hasNone',
                  label: 'I do not have any patents, but believe I have freedom to operate'
                }
              ]
            },
            {
              id: 'hasOtherIntellectual',
              dataType: 'radio-group',
              label: 'Do you have any other intellectual property for your innovation?',
              description:
                'Find out more about <a href={{urls.INNOVATION_GUIDES_INTELLECTUAL_PROPERTY}} target="_blank" rel="noopener noreferrer">intellectual property (opens in a new window)</a>.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes',
                  conditional: {
                    id: 'otherIntellectual',
                    dataType: 'text',
                    label: 'Type of intellectual property',
                    validations: {
                      isRequired: 'Type of intellectual property is required',
                      maxLength: 100
                    }
                  }
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'revenueModel',
      title: 'Revenue model',
      subSections: [
        {
          id: 'revenueModel',
          title: 'Revenue model',
          questions: [
            {
              id: 'hasRevenueModel',
              dataType: 'radio-group',
              label: 'Do you have a model for generating revenue from your innovation?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                },
                {
                  id: 'dontKnow',
                  label: 'I do not know'
                }
              ]
            },
            {
              id: 'revenues',
              dataType: 'checkbox-array',
              label: 'What is the revenue model for your innovation?',
              validations: {
                isRequired: 'Choose at least one revenue model'
              },
              condition: "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow'",
              items: [
                {
                  id: 'advertising',
                  label: 'Advertising'
                },
                {
                  id: 'directProductSales',
                  label: 'Direct product sales'
                },
                {
                  id: 'feeForService',
                  label: 'Fee for service'
                },
                {
                  id: 'lease',
                  label: 'Lease'
                },
                {
                  id: 'salesOfConsumablesOrAccessories',
                  label: 'Sales of consumables or accessories'
                },
                {
                  id: 'subscription',
                  label: 'Subscription'
                },
                {
                  id: 'other',
                  label: 'Other',
                  conditional: {
                    id: 'otherRevenueDescription',
                    dataType: 'text',
                    label: 'Other revenue model',
                    validations: {
                      isRequired: 'Other revenue model is required',
                      maxLength: 100
                    }
                  }
                }
              ]
            },
            {
              id: 'payingOrganisations',
              dataType: 'textarea',
              label: 'Which NHS or social care organisation and department do you think would pay for the innovation?',
              description: 'Be as specific as you can.',
              lengthLimit: 'm',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow'"
            },
            {
              id: 'benefittingOrganisations',
              dataType: 'textarea',
              label: 'Which NHS or social care organisation and department would benefit from the innovation?',
              description: 'Be as specific as you can.',
              lengthLimit: 'm',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow'"
            },
            {
              id: 'hasFunding',
              dataType: 'radio-group',
              label: 'Have you secured funding for the next stage of development?',
              validations: {
                isRequired: 'Choose one option'
              },
              condition: "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow'",
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                },
                {
                  id: 'notRelevant',
                  label: 'Not relevant'
                }
              ]
            },
            {
              id: 'fundingDescription',
              dataType: 'textarea',
              label: 'Describe the funding you have secured for the next stage of development',
              description:
                'For example, venture capital, angel investor, seed funding, grant funding, government funding or similar.',
              lengthLimit: 's',
              validations: {
                isRequired: 'A description is required'
              },
              condition:
                "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow' and data.hasFunding != 'no' and data.hasFunding != 'notRelevant'"
            }
          ]
        }
      ]
    },
    {
      id: 'costAndSavings',
      title: 'Cost and savings',
      subSections: [
        {
          id: 'costOfInnovation',
          title: 'Cost of your innovation',
          questions: [
            {
              id: 'hasCostKnowledge',
              dataType: 'radio-group',
              label: 'Do you know the cost of your innovation?',
              description:
                'By cost, we mean the cost to the NHS or any care organisation that would implement your innovation. Support organisations will use this to calculate cost effectiveness.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'detailedEstimate',
                  label: 'Yes, I have a detailed estimate'
                },
                {
                  id: 'roughIdea',
                  label: 'Yes, I have a rough idea'
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            },
            {
              id: 'costDescription',
              dataType: 'textarea',
              label: 'What is the cost of your innovation?',
              description:
                '<p>Include the relevant metric such as a flat capital cost or cost per patient, cost per unit or cost per procedure. Include any costs associated with implementation and resources.</p><p>For example, £10 based on 500 units per site. £345 per procedure and a typical patient requires two procedures.</p>',
              lengthLimit: 'm',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.hasCostKnowledge != 'no'"
            },
            {
              id: 'patientsRange',
              dataType: 'radio-group',
              label: 'Roughly how many patients would be eligible for your innovation in the UK?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'upTo10000',
                  label: 'Up to 10,000 per year'
                },
                {
                  id: 'between10000And500000',
                  label: '10,000 to half a million per year'
                },
                {
                  id: 'moreThan500000',
                  label: 'More than half a million per year'
                },
                {
                  id: 'notSure',
                  label: 'I am not sure'
                },
                {
                  id: 'notRelevant',
                  label: 'Not relevant to my innovation'
                }
              ]
            },
            {
              id: 'eligibilityCriteria',
              dataType: 'textarea',
              label: 'What is the eligibility criteria for your innovation?',
              description:
                '<p>For example, users need to be over a certain age, or have a certain medical history or current health status.</p><p>Answer "not relevant" if your innovation does not have any eligibility criteria.</p>',
              lengthLimit: 'm',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.patientsRange != 'notRelevant'"
            },
            {
              id: 'sellExpectations',
              dataType: 'textarea',
              label: 'How many units of your innovation would you expect to sell in the UK per year?',
              lengthLimit: 's',
              validations: {
                isRequired: 'A description is required'
              }
            },
            {
              id: 'usageExpectations',
              dataType: 'textarea',
              label: 'Approximately how long do you expect each unit of your innovation to be in use?',
              description:
                "By this we mean the shelf life of the product, or the product's lifespan. This can include the lifespan of any components such as batteries.",
              lengthLimit: 'm',
              validations: {
                isRequired: 'A description is required'
              }
            },
            {
              id: 'costComparison',
              dataType: 'radio-group',
              label:
                'What are the costs associated with the use of your innovation, compared to current practice in the UK?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'cheaper',
                  label: 'My innovation is cheaper to purchase'
                },
                {
                  id: 'costsMoreWithSavings',
                  label:
                    'My innovation costs more to purchase, but has greater benefits that will lead to overall cost savings'
                },
                {
                  id: 'costsMore',
                  label:
                    'My innovation costs more to purchase and has greater benefits, but will lead to higher costs overall'
                },
                {
                  id: 'notSure',
                  label: 'I am not sure'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      subSections: [
        {
          id: 'deployment',
          title: 'Deployment',
          questions: [
            {
              id: 'hasDeployPlan',
              dataType: 'radio-group',
              label: 'Is your innovation ready for wider adoption across the health and care system?',
              description:
                'Find out more about <a href={{urls.INNOVATION_GUIDES_COMISSIONING_AND_ADOPTION}} target="_blank" rel="noopener noreferrer">commissioning and adoption (opens in a new window)</a>.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            },
            {
              id: 'isDeployed',
              dataType: 'radio-group',
              label: 'Has your innovation been deployed in a NHS or care setting?',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                }
              ]
            },
            {
              id: 'stepDeploymentPlans',
              dataType: 'fields-group',
              label: 'Where have you deployed your innovation?',
              description: 'Provide the name of the organisation and the department, if possible.',
              condition: "data.isDeployed != 'no'",
              field: {
                id: 'organizationDepartment',
                dataType: 'text',
                label: 'Organisation and department',
                validations: {
                  isRequired: 'Organisation and department are required',
                  maxLength: 100
                }
              },
              addNewLabel: 'Add new organisations and department'
            },
            {
              id: 'commercialBasis',
              dataType: 'textarea',
              label: 'What was the commercial basis for deployment?',
              description:
                "For example, did you provide your innovation for free or was it purchased? Or was it part funded by yourself and the NHS area in which it's being deployed?",
              lengthLimit: 'xl',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.isDeployed != 'no'"
            },
            {
              id: 'organisationDeploymentAffect',
              dataType: 'textarea',
              label: 'How did the deployment of your innovation affect the organisation(s)?',
              description: 'For example, which job roles were affected and how was the care pathway redesigned?',
              lengthLimit: 'xl',
              validations: {
                isRequired: 'A description is required'
              },
              condition: "data.isDeployed != 'no'"
            },
            {
              id: 'hasResourcesToScale',
              dataType: 'radio-group',
              label: 'Does your team have the resources for scaling up to national deployment?',
              description: 'This includes having a team with the right combination of skills and knowledge.',
              validations: {
                isRequired: 'Choose one option'
              },
              items: [
                {
                  id: 'yes',
                  label: 'Yes'
                },
                {
                  id: 'no',
                  label: 'No'
                },
                {
                  id: 'notSure',
                  label: 'I am not sure'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
// {
//   sections: [
//     {
//       id: 'aboutYourInnovation',
//       title: 'About your innovation',
//       subSections: [
//         {
//           id: 'innovationDescription',
//           title: 'Description of innovation',
//           questions: [
//             {
//               id: 'name',
//               dataType: 'text',
//               label: 'What is the name of your innovation?',
//               description: 'Enter the name of your innovation with a maximum of 100 characters',
//               validations: {
//                 isRequired: 'Innovation name is required',
//                 maxLength: 100
//               }
//             },
//             {
//               id: 'description',
//               dataType: 'textarea',
//               label: 'Provide a short description of your innovation',
//               description:
//                 'Provide a high-level overview of your innovation. You will have the opportunity to explain its impact, target population, testing and revenue model later in the innovation record.',
//               lengthLimit: 's',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//             },
//             {
//               id: 'officeLocation',
//               dataType: 'radio-group',
//               label: 'Where is your head office located?',
//               description:
//                 '<p>If your head office is overseas but you have a UK office, use the UK address.</p><p>If you are not part of a company or organisation, put where you are based.</p><p>We ask this to identify the organisations and people who are in the best position to support you.</p>',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'england',
//                   label: 'England'
//                 },
//                 {
//                   id: 'scotland',
//                   label: 'Scotland'
//                 },
//                 {
//                   id: 'wales',
//                   label: 'Wales'
//                 },
//                 {
//                   id: 'northernIreland',
//                   label: 'Northern Ireland'
//                 },
//                 {
//                   type: 'separator'
//                 },
//                 {
//                   id: 'basedOutsideUk',
//                   label: "I'm based outside of the UK"
//                 }
//               ]
//             },
//             {
//               id: 'postcode',
//               dataType: 'text',
//               label: 'What is your head office postcode?',
//               validations: {
//                 isRequired: 'Postcode is required',
//                 maxLength: 8,
//                 postcodeFormat: true
//               },
//               condition: "data.officeLocation != 'basedOutsideUk'"
//             },
//             {
//               id: 'countryLocation',
//               dataType: 'autocomplete-array',
//               label: 'Which country is your head office located in?',
//               validations: {
//                 isRequired: 'You must choose one country',
//                 max: {
//                   length: 1,
//                   errorMessage: 'Only 1 country is allowed'
//                 }
//               },
//               condition: "data.officeLocation == 'basedOutsideUk'",
//               items: [
//                 {
//                   id: 'afghanistan',
//                   label: 'Afghanistan'
//                 },
//                 {
//                   id: 'albania',
//                   label: 'Albania'
//                 },
//                 {
//                   id: 'algeria',
//                   label: 'Algeria'
//                 },
//                 {
//                   id: 'andorra',
//                   label: 'Andorra'
//                 },
//                 {
//                   id: 'angola',
//                   label: 'Angola'
//                 },
//                 {
//                   id: 'antiguaAndBarbuda',
//                   label: 'Antigua and Barbuda'
//                 },
//                 {
//                   id: 'argentina',
//                   label: 'Argentina'
//                 },
//                 {
//                   id: 'armenia',
//                   label: 'Armenia'
//                 },
//                 {
//                   id: 'australia',
//                   label: 'Australia'
//                 },
//                 {
//                   id: 'austria',
//                   label: 'Austria'
//                 },
//                 {
//                   id: 'azerbaijan',
//                   label: 'Azerbaijan'
//                 },
//                 {
//                   id: 'bahamas',
//                   label: 'Bahamas'
//                 },
//                 {
//                   id: 'bahrain',
//                   label: 'Bahrain'
//                 },
//                 {
//                   id: 'bangladesh',
//                   label: 'Bangladesh'
//                 },
//                 {
//                   id: 'barbados',
//                   label: 'Barbados'
//                 },
//                 {
//                   id: 'belarus',
//                   label: 'Belarus'
//                 },
//                 {
//                   id: 'belgium',
//                   label: 'Belgium'
//                 },
//                 {
//                   id: 'belize',
//                   label: 'Belize'
//                 },
//                 {
//                   id: 'benin',
//                   label: 'Benin'
//                 },
//                 {
//                   id: 'bhutan',
//                   label: 'Bhutan'
//                 },
//                 {
//                   id: 'bolivia',
//                   label: 'Bolivia'
//                 },
//                 {
//                   id: 'bosniaAndHerzegovina',
//                   label: 'Bosnia and Herzegovina'
//                 },
//                 {
//                   id: 'botswana',
//                   label: 'Botswana'
//                 },
//                 {
//                   id: 'brazil',
//                   label: 'Brazil'
//                 },
//                 {
//                   id: 'brunei',
//                   label: 'Brunei'
//                 },
//                 {
//                   id: 'bulgaria',
//                   label: 'Bulgaria'
//                 },
//                 {
//                   id: 'burkinaFaso',
//                   label: 'Burkina Faso'
//                 },
//                 {
//                   id: 'burundi',
//                   label: 'Burundi'
//                 },
//                 {
//                   id: 'coteDIvoire',
//                   label: "Côte d'Ivoire"
//                 },
//                 {
//                   id: 'caboVerde',
//                   label: 'Cabo Verde'
//                 },
//                 {
//                   id: 'cambodia',
//                   label: 'Cambodia'
//                 },
//                 {
//                   id: 'cameroon',
//                   label: 'Cameroon'
//                 },
//                 {
//                   id: 'canada',
//                   label: 'Canada'
//                 },
//                 {
//                   id: 'centralAfricanRepublic',
//                   label: 'Central African Republic'
//                 },
//                 {
//                   id: 'chad',
//                   label: 'Chad'
//                 },
//                 {
//                   id: 'chile',
//                   label: 'Chile'
//                 },
//                 {
//                   id: 'china',
//                   label: 'China'
//                 },
//                 {
//                   id: 'colombia',
//                   label: 'Colombia'
//                 },
//                 {
//                   id: 'comoros',
//                   label: 'Comoros'
//                 },
//                 {
//                   id: 'congo',
//                   label: 'Congo (Congo-Brazzaville)'
//                 },
//                 {
//                   id: 'costaRica',
//                   label: 'Costa Rica'
//                 },
//                 {
//                   id: 'croatia',
//                   label: 'Croatia'
//                 },
//                 {
//                   id: 'cuba',
//                   label: 'Cuba'
//                 },
//                 {
//                   id: 'cyprus',
//                   label: 'Cyprus'
//                 },
//                 {
//                   id: 'czechia',
//                   label: 'Czechia (Czech Republic)'
//                 },
//                 {
//                   id: 'democraticRepublicOfTheCongo',
//                   label: 'Democratic Republic of the Congo'
//                 },
//                 {
//                   id: 'denmark',
//                   label: 'Denmark'
//                 },
//                 {
//                   id: 'djibouti',
//                   label: 'Djibouti'
//                 },
//                 {
//                   id: 'dominica',
//                   label: 'Dominica'
//                 },
//                 {
//                   id: 'dominicanRepublic',
//                   label: 'Dominican Republic'
//                 },
//                 {
//                   id: 'ecuador',
//                   label: 'Ecuador'
//                 },
//                 {
//                   id: 'egypt',
//                   label: 'Egypt'
//                 },
//                 {
//                   id: 'elSalvador',
//                   label: 'El Salvador'
//                 },
//                 {
//                   id: 'equatorialGuinea',
//                   label: 'Equatorial Guinea'
//                 },
//                 {
//                   id: 'eritrea',
//                   label: 'Eritrea'
//                 },
//                 {
//                   id: 'estonia',
//                   label: 'Estonia'
//                 },
//                 {
//                   id: 'eswatini',
//                   label: 'Eswatini (fmr. "Swaziland")'
//                 },
//                 {
//                   id: 'ethiopia',
//                   label: 'Ethiopia'
//                 },
//                 {
//                   id: 'fiji',
//                   label: 'Fiji'
//                 },
//                 {
//                   id: 'finland',
//                   label: 'Finland'
//                 },
//                 {
//                   id: 'france',
//                   label: 'France'
//                 },
//                 {
//                   id: 'gabon',
//                   label: 'Gabon'
//                 },
//                 {
//                   id: 'gambia',
//                   label: 'Gambia'
//                 },
//                 {
//                   id: 'georgia',
//                   label: 'Georgia'
//                 },
//                 {
//                   id: 'germany',
//                   label: 'Germany'
//                 },
//                 {
//                   id: 'ghana',
//                   label: 'Ghana'
//                 },
//                 {
//                   id: 'greece',
//                   label: 'Greece'
//                 },
//                 {
//                   id: 'grenada',
//                   label: 'Grenada'
//                 },
//                 {
//                   id: 'guatemala',
//                   label: 'Guatemala'
//                 },
//                 {
//                   id: 'guinea',
//                   label: 'Guinea'
//                 },
//                 {
//                   id: 'guineaBissau',
//                   label: 'Guinea-Bissau'
//                 },
//                 {
//                   id: 'guyana',
//                   label: 'Guyana'
//                 },
//                 {
//                   id: 'haiti',
//                   label: 'Haiti'
//                 },
//                 {
//                   id: 'holySee',
//                   label: 'Holy See'
//                 },
//                 {
//                   id: 'honduras',
//                   label: 'Honduras'
//                 },
//                 {
//                   id: 'hungary',
//                   label: 'Hungary'
//                 },
//                 {
//                   id: 'iceland',
//                   label: 'Iceland'
//                 },
//                 {
//                   id: 'india',
//                   label: 'India'
//                 },
//                 {
//                   id: 'indonesia',
//                   label: 'Indonesia'
//                 },
//                 {
//                   id: 'iran',
//                   label: 'Iran'
//                 },
//                 {
//                   id: 'iraq',
//                   label: 'Iraq'
//                 },
//                 {
//                   id: 'ireland',
//                   label: 'Ireland'
//                 },
//                 {
//                   id: 'israel',
//                   label: 'Israel'
//                 },
//                 {
//                   id: 'italy',
//                   label: 'Italy'
//                 },
//                 {
//                   id: 'jamaica',
//                   label: 'Jamaica'
//                 },
//                 {
//                   id: 'japan',
//                   label: 'Japan'
//                 },
//                 {
//                   id: 'jordan',
//                   label: 'Jordan'
//                 },
//                 {
//                   id: 'kazakhstan',
//                   label: 'Kazakhstan'
//                 },
//                 {
//                   id: 'kenya',
//                   label: 'Kenya'
//                 },
//                 {
//                   id: 'kiribati',
//                   label: 'Kiribati'
//                 },
//                 {
//                   id: 'kuwait',
//                   label: 'Kuwait'
//                 },
//                 {
//                   id: 'kyrgyzstan',
//                   label: 'Kyrgyzstan'
//                 },
//                 {
//                   id: 'laos',
//                   label: 'Laos'
//                 },
//                 {
//                   id: 'latvia',
//                   label: 'Latvia'
//                 },
//                 {
//                   id: 'lebanon',
//                   label: 'Lebanon'
//                 },
//                 {
//                   id: 'lesotho',
//                   label: 'Lesotho'
//                 },
//                 {
//                   id: 'liberia',
//                   label: 'Liberia'
//                 },
//                 {
//                   id: 'libya',
//                   label: 'Libya'
//                 },
//                 {
//                   id: 'liechtenstein',
//                   label: 'Liechtenstein'
//                 },
//                 {
//                   id: 'lithuania',
//                   label: 'Lithuania'
//                 },
//                 {
//                   id: 'luxembourg',
//                   label: 'Luxembourg'
//                 },
//                 {
//                   id: 'madagascar',
//                   label: 'Madagascar'
//                 },
//                 {
//                   id: 'malawi',
//                   label: 'Malawi'
//                 },
//                 {
//                   id: 'malaysia',
//                   label: 'Malaysia'
//                 },
//                 {
//                   id: 'maldives',
//                   label: 'Maldives'
//                 },
//                 {
//                   id: 'mali',
//                   label: 'Mali'
//                 },
//                 {
//                   id: 'malta',
//                   label: 'Malta'
//                 },
//                 {
//                   id: 'marshallIslands',
//                   label: 'Marshall Islands'
//                 },
//                 {
//                   id: 'mauritania',
//                   label: 'Mauritania'
//                 },
//                 {
//                   id: 'mauritius',
//                   label: 'Mauritius'
//                 },
//                 {
//                   id: 'mexico',
//                   label: 'Mexico'
//                 },
//                 {
//                   id: 'micronesia',
//                   label: 'Micronesia'
//                 },
//                 {
//                   id: 'moldova',
//                   label: 'Moldova'
//                 },
//                 {
//                   id: 'monaco',
//                   label: 'Monaco'
//                 },
//                 {
//                   id: 'mongolia',
//                   label: 'Mongolia'
//                 },
//                 {
//                   id: 'montenegro',
//                   label: 'Montenegro'
//                 },
//                 {
//                   id: 'morocco',
//                   label: 'Morocco'
//                 },
//                 {
//                   id: 'mozambique',
//                   label: 'Mozambique'
//                 },
//                 {
//                   id: 'myanmar',
//                   label: 'Myanmar (formerly Burma)'
//                 },
//                 {
//                   id: 'namibia',
//                   label: 'Namibia'
//                 },
//                 {
//                   id: 'nauru',
//                   label: 'Nauru'
//                 },
//                 {
//                   id: 'nepal',
//                   label: 'Nepal'
//                 },
//                 {
//                   id: 'netherlands',
//                   label: 'Netherlands'
//                 },
//                 {
//                   id: 'newZealand',
//                   label: 'New Zealand'
//                 },
//                 {
//                   id: 'nicaragua',
//                   label: 'Nicaragua'
//                 },
//                 {
//                   id: 'niger',
//                   label: 'Niger'
//                 },
//                 {
//                   id: 'nigeria',
//                   label: 'Nigeria'
//                 },
//                 {
//                   id: 'northKorea',
//                   label: 'North Korea'
//                 },
//                 {
//                   id: 'northMacedonia',
//                   label: 'North Macedonia'
//                 },
//                 {
//                   id: 'norway',
//                   label: 'Norway'
//                 },
//                 {
//                   id: 'oman',
//                   label: 'Oman'
//                 },
//                 {
//                   id: 'pakistan',
//                   label: 'Pakistan'
//                 },
//                 {
//                   id: 'palau',
//                   label: 'Palau'
//                 },
//                 {
//                   id: 'palestineState',
//                   label: 'Palestine State'
//                 },
//                 {
//                   id: 'panama',
//                   label: 'Panama'
//                 },
//                 {
//                   id: 'papuaNewGuinea',
//                   label: 'Papua New Guinea'
//                 },
//                 {
//                   id: 'paraguay',
//                   label: 'Paraguay'
//                 },
//                 {
//                   id: 'peru',
//                   label: 'Peru'
//                 },
//                 {
//                   id: 'philippines',
//                   label: 'Philippines'
//                 },
//                 {
//                   id: 'poland',
//                   label: 'Poland'
//                 },
//                 {
//                   id: 'portugal',
//                   label: 'Portugal'
//                 },
//                 {
//                   id: 'qatar',
//                   label: 'Qatar'
//                 },
//                 {
//                   id: 'romania',
//                   label: 'Romania'
//                 },
//                 {
//                   id: 'russia',
//                   label: 'Russia'
//                 },
//                 {
//                   id: 'rwanda',
//                   label: 'Rwanda'
//                 },
//                 {
//                   id: 'saintKittsAndNevis',
//                   label: 'Saint Kitts and Nevis'
//                 },
//                 {
//                   id: 'saintLucia',
//                   label: 'Saint Lucia'
//                 },
//                 {
//                   id: 'saintVincentAndTheGrenadines',
//                   label: 'Saint Vincent and the Grenadines'
//                 },
//                 {
//                   id: 'samoa',
//                   label: 'Samoa'
//                 },
//                 {
//                   id: 'sanMarino',
//                   label: 'San Marino'
//                 },
//                 {
//                   id: 'saoTomeAndPrincipe',
//                   label: 'Sao Tome and Principe'
//                 },
//                 {
//                   id: 'saudiArabia',
//                   label: 'Saudi Arabia'
//                 },
//                 {
//                   id: 'senegal',
//                   label: 'Senegal'
//                 },
//                 {
//                   id: 'serbia',
//                   label: 'Serbia'
//                 },
//                 {
//                   id: 'seychelles',
//                   label: 'Seychelles'
//                 },
//                 {
//                   id: 'sierraLeone',
//                   label: 'Sierra Leone'
//                 },
//                 {
//                   id: 'singapore',
//                   label: 'Singapore'
//                 },
//                 {
//                   id: 'slovakia',
//                   label: 'Slovakia'
//                 },
//                 {
//                   id: 'slovenia',
//                   label: 'Slovenia'
//                 },
//                 {
//                   id: 'solomonIslands',
//                   label: 'Solomon Islands'
//                 },
//                 {
//                   id: 'somalia',
//                   label: 'Somalia'
//                 },
//                 {
//                   id: 'southAfrica',
//                   label: 'South Africa'
//                 },
//                 {
//                   id: 'southKorea',
//                   label: 'South Korea'
//                 },
//                 {
//                   id: 'southSudan',
//                   label: 'South Sudan'
//                 },
//                 {
//                   id: 'spain',
//                   label: 'Spain'
//                 },
//                 {
//                   id: 'sriLanka',
//                   label: 'Sri Lanka'
//                 },
//                 {
//                   id: 'sudan',
//                   label: 'Sudan'
//                 },
//                 {
//                   id: 'suriname',
//                   label: 'Suriname'
//                 },
//                 {
//                   id: 'sweden',
//                   label: 'Sweden'
//                 },
//                 {
//                   id: 'switzerland',
//                   label: 'Switzerland'
//                 },
//                 {
//                   id: 'syria',
//                   label: 'Syria'
//                 },
//                 {
//                   id: 'tajikistan',
//                   label: 'Tajikistan'
//                 },
//                 {
//                   id: 'tanzania',
//                   label: 'Tanzania'
//                 },
//                 {
//                   id: 'thailand',
//                   label: 'Thailand'
//                 },
//                 {
//                   id: 'timorLeste',
//                   label: 'Timor-Leste'
//                 },
//                 {
//                   id: 'togo',
//                   label: 'Togo'
//                 },
//                 {
//                   id: 'tonga',
//                   label: 'Tonga'
//                 },
//                 {
//                   id: 'trinidadAndTobago',
//                   label: 'Trinidad and Tobago'
//                 },
//                 {
//                   id: 'tunisia',
//                   label: 'Tunisia'
//                 },
//                 {
//                   id: 'turkey',
//                   label: 'Turkey'
//                 },
//                 {
//                   id: 'turkmenistan',
//                   label: 'Turkmenistan'
//                 },
//                 {
//                   id: 'tuvalu',
//                   label: 'Tuvalu'
//                 },
//                 {
//                   id: 'uganda',
//                   label: 'Uganda'
//                 },
//                 {
//                   id: 'ukraine',
//                   label: 'Ukraine'
//                 },
//                 {
//                   id: 'unitedArabEmirates',
//                   label: 'United Arab Emirates'
//                 },
//                 {
//                   id: 'unitedKingdom',
//                   label: 'United Kingdom'
//                 },
//                 {
//                   id: 'unitedStatesOfAmerica',
//                   label: 'United States of America'
//                 },
//                 {
//                   id: 'uruguay',
//                   label: 'Uruguay'
//                 },
//                 {
//                   id: 'uzbekistan',
//                   label: 'Uzbekistan'
//                 },
//                 {
//                   id: 'vanuatu',
//                   label: 'Vanuatu'
//                 },
//                 {
//                   id: 'venezuela',
//                   label: 'Venezuela'
//                 },
//                 {
//                   id: 'vietnam',
//                   label: 'Vietnam'
//                 },
//                 {
//                   id: 'yemen',
//                   label: 'Yemen'
//                 },
//                 {
//                   id: 'zambia',
//                   label: 'Zambia'
//                 },
//                 {
//                   id: 'zimbabwe',
//                   label: 'Zimbabwe'
//                 }
//               ]
//             },
//             {
//               id: 'hasWebsite',
//               dataType: 'radio-group',
//               label: 'Does your innovation have a website?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes',
//                   conditional: {
//                     id: 'website',
//                     dataType: 'text',
//                     label: 'Website',
//                     validations: {
//                       isRequired: 'Website url is required',
//                       maxLength: 100,
//                       urlFormat: true
//                     }
//                   }
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             },
//             {
//               id: 'categories',
//               dataType: 'checkbox-array',
//               label: 'Select all the categories that can be used to describe your innovation',
//               validations: {
//                 isRequired: 'Choose at least one category'
//               },
//               items: [
//                 {
//                   id: 'medicalDevice',
//                   label: 'Medical device'
//                 },
//                 {
//                   id: 'inVitroDiagnostic',
//                   label: 'In vitro diagnostic'
//                 },
//                 {
//                   id: 'pharmaceutical',
//                   label: 'Pharmaceutical'
//                 },
//                 {
//                   id: 'digital',
//                   label: 'Digital (including apps, platforms, software)'
//                 },
//                 {
//                   id: 'ai',
//                   label: 'Artificial intelligence (AI)'
//                 },
//                 {
//                   id: 'education',
//                   label: 'Education or training of workforce'
//                 },
//                 {
//                   id: 'ppe',
//                   label: 'Personal protective equipment (PPE)'
//                 },
//                 {
//                   id: 'modelsCare',
//                   label: 'Models of care and clinical pathways'
//                 },
//                 {
//                   id: 'estatesFacilities',
//                   label: 'Estates and facilities'
//                 },
//                 {
//                   id: 'travelTransport',
//                   label: 'Travel and transport'
//                 },
//                 {
//                   id: 'foodNutrition',
//                   label: 'Food and nutrition'
//                 },
//                 {
//                   id: 'dataMonitoring',
//                   label: 'Data and monitoring'
//                 },
//                 {
//                   id: 'other',
//                   label: 'Other',
//                   conditional: {
//                     id: 'otherCategoryDescription',
//                     dataType: 'text',
//                     label: 'Other category',
//                     validations: {
//                       isRequired: 'Other category description is required',
//                       maxLength: 100
//                     }
//                   }
//                 }
//               ]
//             },
//             {
//               id: 'mainCategory',
//               dataType: 'radio-group',
//               label: 'Select a primary category to describe your innovation',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [{ itemsFromAnswer: 'categories' }]
//             },
//             {
//               id: 'areas',
//               dataType: 'checkbox-array',
//               label: 'Is your innovation relevant to any of the following areas?',
//               description:
//                 'We ask this to identify the organisations and people who are in the best position to support you.',
//               items: [
//                 {
//                   id: 'covid19',
//                   label: 'COVID-19'
//                 },
//                 {
//                   id: 'dataAnalyticsAndResearch',
//                   label: 'Data, analytics and research'
//                 },
//                 {
//                   id: 'digitalisingSystem',
//                   label: 'Digitalising the system'
//                 },
//                 {
//                   id: 'improvingSystemFlow',
//                   label: 'Improving system flow'
//                 },
//                 {
//                   id: 'independenceAndPrevention',
//                   label: 'Independence and prevention'
//                 },
//                 {
//                   id: 'operationalExcellence',
//                   label: 'Operational excellence'
//                 },
//                 {
//                   id: 'patientActivationAndSelfCare',
//                   label: 'Patient activation and self-care'
//                 },
//                 {
//                   id: 'patientSafety',
//                   label: 'Patient safety and quality improvement'
//                 },
//                 {
//                   id: 'workforceResourceOptimisation',
//                   label: 'Workforce resource optimisation'
//                 },
//                 {
//                   id: 'netZeroGreenerInnovation',
//                   label: 'Net zero NHS or greener innovation'
//                 }
//               ]
//             },
//             {
//               id: 'careSettings',
//               dataType: 'checkbox-array',
//               label: 'In which care settings is your innovation relevant?',
//               validations: {
//                 isRequired: 'Choose at least one category'
//               },
//               items: [
//                 {
//                   id: 'academia',
//                   label: 'Academia'
//                 },
//                 {
//                   id: 'acuteTrustsInpatient',
//                   label: 'Acute trust - inpatient'
//                 },
//                 {
//                   id: 'acuteTrustsOutpatient',
//                   label: 'Acute trust - outpatient'
//                 },
//                 {
//                   id: 'ambulance',
//                   label: 'Ambulance'
//                 },
//                 {
//                   id: 'careHomesCareSetting',
//                   label: 'Care homes or care setting'
//                 },
//                 {
//                   id: 'endLifeCare',
//                   label: 'End of life care (EOLC)'
//                 },
//                 {
//                   id: 'ics',
//                   label: 'ICS'
//                 },
//                 {
//                   id: 'industry',
//                   label: 'Industry'
//                 },
//                 {
//                   id: 'localAuthorityEducation',
//                   label: 'Local authority - education'
//                 },
//                 {
//                   id: 'mentalHealth',
//                   label: 'Mental health'
//                 },
//                 {
//                   id: 'pharmacy',
//                   label: 'Pharmacies'
//                 },
//                 {
//                   id: 'primaryCare',
//                   label: 'Primary care'
//                 },
//                 {
//                   id: 'socialCare',
//                   label: 'Social care'
//                 },
//                 {
//                   id: 'thirdSectorOrganisations',
//                   label: 'Third sector organisations'
//                 },
//                 {
//                   id: 'urgentAndEmergency',
//                   label: 'Urgent and emergency'
//                 },
//                 {
//                   id: 'other',
//                   label: 'Other',
//                   conditional: {
//                     id: 'otherCareSetting',
//                     dataType: 'text',
//                     label: 'Other care setting',
//                     validations: {
//                       isRequired: 'Other care setting description is required',
//                       maxLength: 100
//                     }
//                   }
//                 }
//               ]
//             },
//             {
//               id: 'mainPurpose',
//               dataType: 'radio-group',
//               label: 'What is the main purpose of your innovation?',
//               description:
//                 'We ask this to identify the organisations and people who are in the best position to support you.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'preventCondition',
//                   label: 'Preventing a condition or symptom from happening or worsening'
//                 },
//                 {
//                   id: 'predictCondition',
//                   label: 'Predicting the occurence of a condition or symptom'
//                 },
//                 {
//                   id: 'diagnoseCondition',
//                   label: 'Diagnosing a condition'
//                 },
//                 {
//                   id: 'monitorCondition',
//                   label: 'Monitoring a condition, treatment or therapy'
//                 },
//                 {
//                   id: 'provideTreatment',
//                   label: 'Providing treatment or therapy'
//                 },
//                 {
//                   id: 'manageCondition',
//                   label: 'Managing a condition'
//                 },
//                 {
//                   id: 'enablingCare',
//                   label: 'Enabling care, services or communication'
//                 },
//                 {
//                   id: 'risksClimateChange',
//                   label:
//                     'Supporting the NHS to mitigate the risks or effects of climate change and severe weather conditions'
//                 }
//               ]
//             },
//             {
//               id: 'supportDescription',
//               dataType: 'textarea',
//               label: 'What support are you seeking from the Innovation Service?',
//               description:
//                 '<p>For example, support with clinical trials, product development, real-world evidence, regulatory advice, or adoption.</p><p>You will have the opportunity to explain how your innovation works and its benefits later in the record</p>',
//               lengthLimit: 'xl',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//             },
//             {
//               id: 'currentlyReceivingSupport',
//               dataType: 'textarea',
//               label: 'Are you currently receiving any support for your innovation?',
//               description:
//                 'This can include any UK funding to support the development of your innovation, or any support you are currently receiving from <a href={{URLS.ORGANISATIONS_BEHIND_THE_SERVICE}} target="_blank" rel="noopener noreferrer">NHS Innovation Service organisations (opens in a new window)</a>.',
//               lengthLimit: 'xl',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//             },
//             {
//               id: 'involvedAACProgrammes',
//               dataType: 'checkbox-array',
//               label: 'Are you involved with any Accelerated Access Collaborative programmes?',
//               description: 'Select all that apply, or select no, if not relevant.',
//               validations: {
//                 isRequired: 'Choose at least one category'
//               },
//               items: [
//                 {
//                   id: 'no',
//                   label: 'No',
//                   exclusive: true
//                 },
//                 {
//                   type: 'separator'
//                 },
//                 {
//                   id: 'healthInnovationNetwork',
//                   label: 'Health Innovation Network'
//                 },
//                 {
//                   id: 'artificialIntelligenceInHealthAndCareAward',
//                   label: 'Artificial Intelligence in Health and Care Award'
//                 },
//                 {
//                   id: 'clinicalEntrepreneurProgramme',
//                   label: 'Clinical Entrepreneur Programme'
//                 },
//                 {
//                   id: 'earlyAccessToMedicinesScheme',
//                   label: 'Early Access to Medicines Scheme'
//                 },
//                 {
//                   id: 'innovationForHealthcareInequalitiesProgramme',
//                   label: 'Innovation for Healthcare Inequalities Programme'
//                 },
//                 {
//                   id: 'innovationAndTechnologyPaymentProgramme',
//                   label: 'Innovation and Technology Payment Programme'
//                 },
//                 {
//                   id: 'nhsInnovationAccelerator',
//                   label: 'NHS Innovation Accelerator'
//                 },
//                 {
//                   id: 'nhsInsightsPrioritisationProgramme',
//                   label: 'NHS Insights Prioritisation Programme'
//                 },
//                 {
//                   id: 'pathwayTransformationFund',
//                   label: 'Pathway Transformation Fund'
//                 },
//                 {
//                   id: 'rapidUptakeProductsProgramme',
//                   label: 'Rapid Uptake Products Programme'
//                 },
//                 {
//                   id: 'smallBusinessResearchInitiativeForHealthcare',
//                   label: 'Small Business Research Initiative for Healthcare'
//                 },
//                 {
//                   id: 'testBeds',
//                   label: 'Test beds'
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'valueProposition',
//       title: 'Value proposition',
//       subSections: [
//         {
//           id: 'understandingOfNeeds',
//           title: 'Detailed understanding of needs and benefits',
//           questions: [
//             {
//               id: 'problemsTackled',
//               dataType: 'textarea',
//               label: 'What problem is your innovation trying to solve?',
//               description:
//                 "<p>Include the current consequences of the problem.</p><p>For example, the process of checking a patient's pulse to determine if there is atrial fibrillation using a finger and a watch is inherently inaccurate. Using this method approximately 25% of patients are not referred to secondary care who should be (false negative) and 15% of patients who are referred are referred unnecessarily (false positive). For those patients who are not picked up at this stage, their underlying disease will progress before being correctly diagnosed.</p>",
//               lengthLimit: 'l',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//             },
//             {
//               id: 'howInnovationWork',
//               dataType: 'textarea',
//               label: 'Give an overview of how your innovation works',
//               description:
//                 '<p>If this is or might be a medical device, include the <a href={{URLS.MEDICAL_DEVICES_INTENDED_PURPOSE_STATEMENT}} target="_blank" rel="noopener noreferrer">intended purpose statement (opens in a new window)</a>.</p><p>For example, GPs will identify patients with suspected atrial fibrillation from their history and reported symptoms. This innovation is a portable device that patients wear over a 7-day period. The device will monitor the patient’s heart rate continuously whilst they are wearing it. GPs will need to be trained in using the device and interpreting the results. GP practices will need to store the device and consumables.</p>',
//               lengthLimit: 'l',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//             },
//             {
//               id: 'hasProductServiceOrPrototype',
//               dataType: 'radio-group',
//               label: 'Do you have a working product, service or prototype?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             },
//             {
//               id: 'benefitsOrImpact',
//               dataType: 'checkbox-array',
//               label: 'What are the benefits or impact of your innovation?',
//               items: [
//                 {
//                   id: 'reducesMortality',
//                   label: 'Reduces mortality',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'reducesNeedForFurtherTreatment',
//                   label: 'Reduces need for further treatment',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'reducesAdverseEvents',
//                   label: 'Reduces adverse events',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'enablesEarlierOrMoreAccurateDiagnosis',
//                   label: 'Enables earlier or more accurate diagnosis',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'reducesRisksSideEffectsOrComplications',
//                   label: 'Reduces risks, side effects or complications',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'preventsAConditionOccurringOrExacerbating',
//                   label: 'Prevents a condition occurring or exacerbating',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'avoidsATestProcedureOrUnnecessaryTreatment',
//                   label: 'Avoids a test, procedure or unnecessary treatment',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'enablesATestProcedureOrTreatmentToBeDoneNonInvasively',
//                   label: 'Enables a test, procedure or treatment to be done non-invasively',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'increasesSelfManagement',
//                   label: 'Increases self-management',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'increasesQualityOfLife',
//                   label: 'Increases quality of life',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'enablesSharedCare',
//                   label: 'Enables shared care',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'alleviatesPain',
//                   label: 'Alleviates pain',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'otherBenefitsForPatientsAndPeople',
//                   label: 'Other benefits for patients and people',
//                   group: 'Benefits for patients and people'
//                 },
//                 {
//                   id: 'reducesTheLengthOfStayOrEnablesEarlierDischarge',
//                   label: 'Reduces the length of stay or enables earlier discharge',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'reducesNeedForAdultOrPaediatricCriticalCare',
//                   label: 'Reduces need for adult or paediatric critical care',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'reducesEmergencyAdmissions',
//                   label: 'Reduces emergency admissions',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'changesDeliveryOfCareFromSecondaryCareForExampleHospitalsToPrimaryCareForExampleGpOrCommunityServices',
//                   label:
//                     'Changes delivery of care from secondary care(for example hospitals) to primary care(for example GP or community services)',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'changeInDeliveryOfCareFromInpatientToDayCase',
//                   label: 'Change in delivery of care from inpatient to day case',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'increasesCompliance',
//                   label: 'Increases compliance',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'improvesPatientManagementOrCoordinationOfCareOrServices',
//                   label: 'Improves patient management or coordination of care or services',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'reducesReferrals',
//                   label: 'Reduces referrals',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'takesLessTime',
//                   label: 'Takes less time',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'usesNoStaffOrALowerGradeOfStaff',
//                   label: 'Uses no staff or a lower grade of staff',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'leadsToFewerAppointments',
//                   label: 'Leads to fewer appointments',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'isCostSaving',
//                   label: 'Is cost saving',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'increasesEfficiency',
//                   label: 'Increases efficiency',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'improvesPerformance',
//                   label: 'Improves performance',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'reducesCarbonEmissionsAndSupportsTheNhsToAchieveNetZero',
//                   label: 'Reduces carbon emissions and supports the NHS to achieve net zero',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'otherEnvironmentalBenefits',
//                   label: 'Other environmental benefits',
//                   group: 'Benefits for the NHS and social care'
//                 },
//                 {
//                   id: 'otherBenefitsForTheNhsAndSocialCare',
//                   label: 'Other benefits for the NHS and social care',
//                   group: 'Benefits for the NHS and social care'
//                 }
//               ]
//             },
//             {
//               id: 'impactDiseaseCondition',
//               dataType: 'radio-group',
//               label: 'Does your innovation impact a disease or condition?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             },
//             {
//               id: 'diseasesConditionsImpact',
//               dataType: 'autocomplete-array',
//               label: 'What diseases or conditions does your innovation impact?',
//               description: 'Start typing to view conditions. You can select as many conditions as you like.',
//               validations: {
//                 isRequired: 'You must choose at least one disease or condition'
//               },
//               condition: "data.impactDiseaseCondition == 'yes'",
//               items: [
//                 {
//                   id: 'bloodAndImmuneSystemConditions',
//                   label: 'Blood and immune system conditions'
//                 },
//                 {
//                   id: 'bloodAndImmuneSystemConditionsAllergies',
//                   label: 'Blood and immune system conditions - Allergies'
//                 },
//                 {
//                   id: 'bloodAndImmuneSystemConditionsAnaphylaxis',
//                   label: 'Blood and immune system conditions - Anaphylaxis'
//                 },
//                 {
//                   id: 'bloodAndImmuneSystemConditionsBloodConditions',
//                   label: 'Blood and immune system conditions - Blood conditions'
//                 },
//                 {
//                   id: 'bloodAndImmuneSystemConditionsLymphoedema',
//                   label: 'Blood and immune system conditions - Lymphoedema'
//                 },
//                 {
//                   id: 'bloodAndImmuneSystemConditionsSystemicLupusErythematosus',
//                   label: 'Blood and immune system conditions - Systemic lupus erythematosus'
//                 },
//                 {
//                   id: 'cancer',
//                   label: 'Cancer'
//                 },
//                 {
//                   id: 'cancerBladderCancer',
//                   label: 'Cancer - Bladder cancer'
//                 },
//                 {
//                   id: 'cancerBloodAndBoneMarrowCancers',
//                   label: 'Cancer - Blood and bone marrow cancers'
//                 },
//                 {
//                   id: 'cancerBrainCancers',
//                   label: 'Cancer - Brain cancers'
//                 },
//                 {
//                   id: 'cancerBreastCancer',
//                   label: 'Cancer - Breast cancer'
//                 },
//                 {
//                   id: 'cancerCervicalCancer',
//                   label: 'Cancer - Cervical cancer'
//                 },
//                 {
//                   id: 'cancerColorectalCancer',
//                   label: 'Cancer - Colorectal cancer'
//                 },
//                 {
//                   id: 'cancerComplicationsOfCancer',
//                   label: 'Cancer - Complications of cancer'
//                 },
//                 {
//                   id: 'cancerEndometrialCancers',
//                   label: 'Cancer - Endometrial cancers'
//                 },
//                 {
//                   id: 'cancerHeadAndNeckCancers',
//                   label: 'Cancer - Head and neck cancers'
//                 },
//                 {
//                   id: 'cancerLiverCancers',
//                   label: 'Cancer - Liver cancers'
//                 },
//                 {
//                   id: 'cancerLungCancer',
//                   label: 'Cancer - Lung cancer'
//                 },
//                 {
//                   id: 'cancerMetastases',
//                   label: 'Cancer - Metastases'
//                 },
//                 {
//                   id: 'cancerOesophagealCancer',
//                   label: 'Cancer - Oesophageal cancer'
//                 },
//                 {
//                   id: 'cancerOvarianCancer',
//                   label: 'Cancer - Ovarian cancer'
//                 },
//                 {
//                   id: 'cancerPancreaticCancer',
//                   label: 'Cancer - Pancreatic cancer'
//                 },
//                 {
//                   id: 'cancerPenileAndTesticularCancer',
//                   label: 'Cancer - Penile and testicular cancer'
//                 },
//                 {
//                   id: 'cancerPeritonealCancer',
//                   label: 'Cancer - Peritoneal cancer'
//                 },
//                 {
//                   id: 'cancerProstateCancer',
//                   label: 'Cancer - Prostate cancer'
//                 },
//                 {
//                   id: 'cancerRenalCancer',
//                   label: 'Cancer - Renal cancer'
//                 },
//                 {
//                   id: 'cancerSarcoma',
//                   label: 'Cancer - Sarcoma'
//                 },
//                 {
//                   id: 'cancerSkinCancer',
//                   label: 'Cancer - Skin cancer'
//                 },
//                 {
//                   id: 'cancerStomachCancer',
//                   label: 'Cancer - Stomach cancer'
//                 },
//                 {
//                   id: 'cancerThyroidCancer',
//                   label: 'Cancer - Thyroid cancer'
//                 },
//                 {
//                   id: 'cancerUpperAirwaysTractCancers',
//                   label: 'Cancer - Upper airways tract cancers'
//                 },
//                 {
//                   id: 'cardiovascularConditions',
//                   label: 'Cardiovascular conditions'
//                 },
//                 {
//                   id: 'cardiovascularConditionsAcuteCoronarySyndromes',
//                   label: 'Cardiovascular conditions - Acute coronary syndromes'
//                 },
//                 {
//                   id: 'cardiovascularConditionsAorticAneurysms',
//                   label: 'Cardiovascular conditions - Aortic aneurysms'
//                 },
//                 {
//                   id: 'cardiovascularConditionsCranialAneurysms',
//                   label: 'Cardiovascular conditions - Cranial aneurysms'
//                 },
//                 {
//                   id: 'cardiovascularConditionsEmbolismAndThrombosis',
//                   label: 'Cardiovascular conditions - Embolism and thrombosis'
//                 },
//                 {
//                   id: 'cardiovascularConditionsHeartFailure',
//                   label: 'Cardiovascular conditions - Heart failure'
//                 },
//                 {
//                   id: 'cardiovascularConditionsHeartRhythmConditions',
//                   label: 'Cardiovascular conditions - Heart rhythm conditions'
//                 },
//                 {
//                   id: 'cardiovascularConditionsHypertension',
//                   label: 'Cardiovascular conditions - Hypertension'
//                 },
//                 {
//                   id: 'cardiovascularConditionsPeripheralCirculatoryConditions',
//                   label: 'Cardiovascular conditions - Peripheral circulatory conditions'
//                 },
//                 {
//                   id: 'cardiovascularConditionsStableAngina',
//                   label: 'Cardiovascular conditions - Stable angina'
//                 },
//                 {
//                   id: 'cardiovascularConditionsStrokeAndTransientIschaemicAttack',
//                   label: 'Cardiovascular conditions - Stroke and transient ischaemic attack'
//                 },
//                 {
//                   id: 'cardiovascularConditionsStructuralHeartDefects',
//                   label: 'Cardiovascular conditions - Structural heart defects'
//                 },
//                 {
//                   id: 'cardiovascularConditionsVaricoseVeins',
//                   label: 'Cardiovascular conditions - Varicose veins'
//                 },
//                 {
//                   id: 'chronicAndNeuropathicPain',
//                   label: 'Chronic and neuropathic pain'
//                 },
//                 {
//                   id: 'chronicFatigueSyndrome',
//                   label: 'Chronic fatigue syndrome'
//                 },
//                 {
//                   id: 'cysticFibrosis',
//                   label: 'Cystic fibrosis'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditions',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsAdrenalDysfunction',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Adrenal dysfunction'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsDiabetes',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Diabetes'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsFailureToThrive',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Failure to thrive'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsLipidDisorders',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Lipid disorders'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsMalnutrition',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Malnutrition'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsMetabolicConditions',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Metabolic conditions'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsObesity',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Obesity'
//                 },
//                 {
//                   id: 'diabetesAndOtherEndocrinalNutritionalAndMetabolicConditionsThyroidDisorders',
//                   label: 'Diabetes and other endocrinal, nutritional and metabolic conditions - Thyroid disorders'
//                 },
//                 {
//                   id: 'digestiveTractConditions',
//                   label: 'Digestive tract conditions'
//                 },
//                 {
//                   id: 'digestiveTractConditionsCholelithiasisAndCholecystitis',
//                   label: 'Digestive tract conditions - Cholelithiasis and cholecystitis'
//                 },
//                 {
//                   id: 'digestiveTractConditionsCoeliacDisease',
//                   label: 'Digestive tract conditions - Coeliac disease'
//                 },
//                 {
//                   id: 'digestiveTractConditionsConstipation',
//                   label: 'Digestive tract conditions - Constipation'
//                 },
//                 {
//                   id: 'digestiveTractConditionsDiarrhoeaAndVomiting',
//                   label: 'Digestive tract conditions - Diarrhoea and vomiting'
//                 },
//                 {
//                   id: 'digestiveTractConditionsDiverticularDisease',
//                   label: 'Digestive tract conditions - Diverticular disease'
//                 },
//                 {
//                   id: 'digestiveTractConditionsFaecalIncontinence',
//                   label: 'Digestive tract conditions - Faecal incontinence'
//                 },
//                 {
//                   id: 'digestiveTractConditionsGastroOesophagealRefluxIncludingBarrettsOesophagus',
//                   label: "Digestive tract conditions - Gastro-oesophageal reflux, including Barrett's oesophagus"
//                 },
//                 {
//                   id: 'digestiveTractConditionsGastroparesis',
//                   label: 'Digestive tract conditions - Gastroparesis'
//                 },
//                 {
//                   id: 'digestiveTractConditionsHaemorrhoidsAndOtherAnalConditions',
//                   label: 'Digestive tract conditions - Haemorrhoids and other anal conditions'
//                 },
//                 {
//                   id: 'digestiveTractConditionsHernia',
//                   label: 'Digestive tract conditions - Hernia'
//                 },
//                 {
//                   id: 'digestiveTractConditionsInflammatoryBowelDisease',
//                   label: 'Digestive tract conditions - Inflammatory bowel disease'
//                 },
//                 {
//                   id: 'digestiveTractConditionsIrritableBowelSyndrome',
//                   label: 'Digestive tract conditions - Irritable bowel syndrome'
//                 },
//                 {
//                   id: 'digestiveTractConditionsLowerGastrointestinalLesions',
//                   label: 'Digestive tract conditions - Lower gastrointestinal lesions'
//                 },
//                 {
//                   id: 'digestiveTractConditionsPancreatitis',
//                   label: 'Digestive tract conditions - Pancreatitis'
//                 },
//                 {
//                   id: 'digestiveTractConditionsUpperGastrointestinalBleeding',
//                   label: 'Digestive tract conditions - Upper gastrointestinal bleeding'
//                 },
//                 {
//                   id: 'earNoseAndThroatConditions',
//                   label: 'Ear, nose and throat conditions'
//                 },
//                 {
//                   id: 'eyeConditions',
//                   label: 'Eye conditions'
//                 },
//                 {
//                   id: 'fertilityPregnancyAndChildbirth',
//                   label: 'Fertility, pregnancy and childbirth'
//                 },
//                 {
//                   id: 'fertilityPregnancyAndChildbirthContraception',
//                   label: 'Fertility, pregnancy and childbirth - Contraception'
//                 },
//                 {
//                   id: 'fertilityPregnancyAndChildbirthFertility',
//                   label: 'Fertility, pregnancy and childbirth - Fertility'
//                 },
//                 {
//                   id: 'fertilityPregnancyAndChildbirthIntrapartumCare',
//                   label: 'Fertility, pregnancy and childbirth - Intrapartum care'
//                 },
//                 {
//                   id: 'fertilityPregnancyAndChildbirthPostnatalCare',
//                   label: 'Fertility, pregnancy and childbirth - Postnatal care'
//                 },
//                 {
//                   id: 'fertilityPregnancyAndChildbirthPregnancy',
//                   label: 'Fertility, pregnancy and childbirth - Pregnancy'
//                 },
//                 {
//                   id: 'fertilityPregnancyAndChildbirthTerminationOfPregnancyServices',
//                   label: 'Fertility, pregnancy and childbirth - Termination of pregnancy services'
//                 },
//                 {
//                   id: 'gynaecologicalConditions',
//                   label: 'Gynaecological conditions'
//                 },
//                 {
//                   id: 'gynaecologicalConditionsEndometriosisAndFibroids',
//                   label: 'Gynaecological conditions - Endometriosis and fibroids'
//                 },
//                 {
//                   id: 'gynaecologicalConditionsHeavyMenstrualBleeding',
//                   label: 'Gynaecological conditions - Heavy menstrual bleeding'
//                 },
//                 {
//                   id: 'gynaecologicalConditionsMenopause',
//                   label: 'Gynaecological conditions - Menopause'
//                 },
//                 {
//                   id: 'gynaecologicalConditionsUterineProlapse',
//                   label: 'Gynaecological conditions - Uterine prolapse'
//                 },
//                 {
//                   id: 'gynaecologicalConditionsVaginalConditions',
//                   label: 'Gynaecological conditions - Vaginal conditions'
//                 },
//                 {
//                   id: 'infections',
//                   label: 'Infections'
//                 },
//                 {
//                   id: 'infectionsAntimicrobialStewardship',
//                   label: 'Infections - Antimicrobial stewardship'
//                 },
//                 {
//                   id: 'infectionsBitesAndStings',
//                   label: 'Infections - Bites and stings'
//                 },
//                 {
//                   id: 'infectionsCovid19',
//                   label: 'Infections - COVID-19'
//                 },
//                 {
//                   id: 'infectionsFeverishIllness',
//                   label: 'Infections - Feverish illness'
//                 },
//                 {
//                   id: 'infectionsHealthcareAssociatedInfections',
//                   label: 'Infections - Healthcare-associated infections'
//                 },
//                 {
//                   id: 'infectionsHivAndAids',
//                   label: 'Infections - HIV and AIDS'
//                 },
//                 {
//                   id: 'infectionsInfluenza',
//                   label: 'Infections - Influenza'
//                 },
//                 {
//                   id: 'infectionsMeningitisAndMeningococcalSepticaemia',
//                   label: 'Infections - Meningitis and meningococcal septicaemia'
//                 },
//                 {
//                   id: 'infectionsSepsis',
//                   label: 'Infections - Sepsis'
//                 },
//                 {
//                   id: 'infectionsSkinInfections',
//                   label: 'Infections - Skin infections'
//                 },
//                 {
//                   id: 'infectionsTuberculosis',
//                   label: 'Infections - Tuberculosis'
//                 },
//                 {
//                   id: 'injuriesAccidentsAndWounds',
//                   label: 'Injuries, accidents and wounds'
//                 },
//                 {
//                   id: 'kidneyConditions',
//                   label: 'Kidney conditions'
//                 },
//                 {
//                   id: 'kidneyConditionsAcuteKidneyInjury',
//                   label: 'Kidney conditions - Acute kidney injury'
//                 },
//                 {
//                   id: 'kidneyConditionsChronicKidneyDisease',
//                   label: 'Kidney conditions - Chronic kidney disease'
//                 },
//                 {
//                   id: 'kidneyConditionsRenalStones',
//                   label: 'Kidney conditions - Renal stones'
//                 },
//                 {
//                   id: 'liverConditions',
//                   label: 'Liver conditions'
//                 },
//                 {
//                   id: 'liverConditionsChronicLiverDisease',
//                   label: 'Liver conditions - Chronic liver disease'
//                 },
//                 {
//                   id: 'liverConditionsHepatitis',
//                   label: 'Liver conditions - Hepatitis'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditions',
//                   label: 'Mental health and behavioural conditions'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsAddiction',
//                   label: 'Mental health and behavioural conditions - Addiction'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsAlcoholUseDisorders',
//                   label: 'Mental health and behavioural conditions - Alcohol-use disorders'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsAnxiety',
//                   label: 'Mental health and behavioural conditions - Anxiety'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsAttentionDeficitDisorder',
//                   label: 'Mental health and behavioural conditions - Attention deficit disorder'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsAutism',
//                   label: 'Mental health and behavioural conditions - Autism'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsBipolarDisorder',
//                   label: 'Mental health and behavioural conditions - Bipolar disorder'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsDelirium',
//                   label: 'Mental health and behavioural conditions - Delirium'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsDementia',
//                   label: 'Mental health and behavioural conditions - Dementia'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsDepression',
//                   label: 'Mental health and behavioural conditions - Depression'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsDrugMisuse',
//                   label: 'Mental health and behavioural conditions - Drug misuse'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsEatingDisorders',
//                   label: 'Mental health and behavioural conditions - Eating disorders'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsMentalHealthServices',
//                   label: 'Mental health and behavioural conditions - Mental health services'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsPersonalityDisorders',
//                   label: 'Mental health and behavioural conditions - Personality disorders'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsPsychosisAndSchizophrenia',
//                   label: 'Mental health and behavioural conditions - Psychosis and schizophrenia'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsSelfHarm',
//                   label: 'Mental health and behavioural conditions - Self-harm'
//                 },
//                 {
//                   id: 'mentalHealthAndBehaviouralConditionsSuicidePrevention',
//                   label: 'Mental health and behavioural conditions - Suicide prevention'
//                 },
//                 {
//                   id: 'multipleLongTermConditions',
//                   label: 'Multiple long-term conditions'
//                 },
//                 {
//                   id: 'musculoskeletalConditions',
//                   label: 'Musculoskeletal conditions'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsArthritis',
//                   label: 'Musculoskeletal conditions - Arthritis'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsFractures',
//                   label: 'Musculoskeletal conditions - Fractures'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsHipConditions',
//                   label: 'Musculoskeletal conditions - Hip conditions'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsJointReplacement',
//                   label: 'Musculoskeletal conditions - Joint replacement'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsKneeConditions',
//                   label: 'Musculoskeletal conditions - Knee conditions'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsLowBackPain',
//                   label: 'Musculoskeletal conditions - Low back pain'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsMaxillofacialConditions',
//                   label: 'Musculoskeletal conditions - Maxillofacial conditions'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsOsteoporosis',
//                   label: 'Musculoskeletal conditions - Osteoporosis'
//                 },
//                 {
//                   id: 'musculoskeletalConditionsSpinalConditions',
//                   label: 'Musculoskeletal conditions - Spinal conditions'
//                 },
//                 {
//                   id: 'neurologicalConditions',
//                   label: 'Neurological conditions'
//                 },
//                 {
//                   id: 'neurologicalConditionsEpilepsy',
//                   label: 'Neurological conditions - Epilepsy'
//                 },
//                 {
//                   id: 'neurologicalConditionsHeadaches',
//                   label: 'Neurological conditions - Headaches'
//                 },
//                 {
//                   id: 'neurologicalConditionsMetastaticSpinalCordCompression',
//                   label: 'Neurological conditions - Metastatic spinal cord compression'
//                 },
//                 {
//                   id: 'neurologicalConditionsMotorNeuroneDisease',
//                   label: 'Neurological conditions - Motor neurone disease'
//                 },
//                 {
//                   id: 'neurologicalConditionsMultipleSclerosis',
//                   label: 'Neurological conditions - Multiple sclerosis'
//                 },
//                 {
//                   id: 'neurologicalConditionsParkinsonsDiseaseTremorAndDystonia',
//                   label: "Neurological conditions - Parkinson's disease, tremor and dystonia"
//                 },
//                 {
//                   id: 'neurologicalConditionsSpasticity',
//                   label: 'Neurological conditions - Spasticity'
//                 },
//                 {
//                   id: 'neurologicalConditionsTransientLossOfConsciousness',
//                   label: 'Neurological conditions - Transient loss of consciousness'
//                 },
//                 {
//                   id: 'oralAndDentalHealth',
//                   label: 'Oral and dental health'
//                 },
//                 {
//                   id: 'respiratoryConditions',
//                   label: 'Respiratory conditions'
//                 },
//                 {
//                   id: 'respiratoryConditionsAsthma',
//                   label: 'Respiratory conditions - Asthma'
//                 },
//                 {
//                   id: 'respiratoryConditionsChronicObstructivePulmonaryDisease',
//                   label: 'Respiratory conditions - Chronic obstructive pulmonary disease'
//                 },
//                 {
//                   id: 'respiratoryConditionsCysticFibrosis',
//                   label: 'Respiratory conditions - Cystic fibrosis'
//                 },
//                 {
//                   id: 'respiratoryConditionsMesothelioma',
//                   label: 'Respiratory conditions - Mesothelioma'
//                 },
//                 {
//                   id: 'respiratoryConditionsPneumonia',
//                   label: 'Respiratory conditions - Pneumonia'
//                 },
//                 {
//                   id: 'respiratoryConditionsPulmonaryFibrosis',
//                   label: 'Respiratory conditions - Pulmonary fibrosis'
//                 },
//                 {
//                   id: 'respiratoryConditionsRespiratoryInfections',
//                   label: 'Respiratory conditions - Respiratory infections'
//                 },
//                 {
//                   id: 'skinConditions',
//                   label: 'Skin conditions'
//                 },
//                 {
//                   id: 'skinConditionsAcne',
//                   label: 'Skin conditions - Acne'
//                 },
//                 {
//                   id: 'skinConditionsDiabeticFoot',
//                   label: 'Skin conditions - Diabetic foot'
//                 },
//                 {
//                   id: 'skinConditionsEczema',
//                   label: 'Skin conditions - Eczema'
//                 },
//                 {
//                   id: 'skinConditionsPressureUlcers',
//                   label: 'Skin conditions - Pressure ulcers'
//                 },
//                 {
//                   id: 'skinConditionsPsoriasis',
//                   label: 'Skin conditions - Psoriasis'
//                 },
//                 {
//                   id: 'skinConditionsWoundManagement',
//                   label: 'Skin conditions - Wound management'
//                 },
//                 {
//                   id: 'sleepAndSleepConditions',
//                   label: 'Sleep and sleep conditions'
//                 },
//                 {
//                   id: 'urologicalConditions',
//                   label: 'Urological conditions'
//                 },
//                 {
//                   id: 'urologicalConditionsLowerUrinaryTractSymptoms',
//                   label: 'Urological conditions - Lower urinary tract symptoms'
//                 },
//                 {
//                   id: 'urologicalConditionsUrinaryIncontinence',
//                   label: 'Urological conditions - Urinary incontinence'
//                 },
//                 {
//                   id: 'urologicalConditionsUrinaryTractInfection',
//                   label: 'Urological conditions - Urinary tract infection'
//                 }
//               ]
//             },
//             {
//               id: 'estimatedCarbonReductionSavings',
//               dataType: 'radio-group',
//               label: 'Have you estimated the carbon reduction or savings that your innovation will bring?',
//               description:
//                 '<p>All NHS suppliers will be expected to provide the carbon footprint associated with the use of their innovation, as outlined in the <a href={{URLS.DELIVERING_A_NET_ZERO_NHS}} target="_blank" rel="noopener noreferrer">Delivering a Net Zero NHS report (opens in a new window)</a>.</p><p>If this is something you are unsure of, the NHS Innovation Service can support you with this.</p>',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'notYet',
//                   label: 'Not yet, but I have an idea'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             },
//             {
//               id: 'estimatedCarbonReductionSavingsDescriptionA',
//               dataType: 'textarea',
//               label: 'Provide the estimates and how this was calculated',
//               lengthLimit: 'xl',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.estimatedCarbonReductionSavings == 'yes'"
//             },
//             {
//               id: 'estimatedCarbonReductionSavingsDescriptionB',
//               dataType: 'textarea',
//               label: 'Explain how you plan to calculate carbon reduction savings',
//               lengthLimit: 'xl',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.estimatedCarbonReductionSavings == 'notYet'"
//             },
//             {
//               id: 'carbonReductionPlan',
//               dataType: 'radio-group',
//               label: 'Do you have or are you working on a carbon reduction plan (CRP)?',
//               description:
//                 'All NHS suppliers will require a carbon reduction plan (CRP), as outlined in the <a href="{{URLS.SUPPLIERS}}" target="_blank" rel="noopener noreferrer">NHS Suppliers Roadmap plan (opens in a new window)</a>.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes, I have one'
//                 },
//                 {
//                   id: 'workingOn',
//                   label: 'I am working on one'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No, I do not have one'
//                 }
//               ]
//             },
//             {
//               id: 'keyHealthInequalities',
//               dataType: 'checkbox-array',
//               label: 'Which key health inequalities does your innovation impact?',
//               description:
//                 '<p>Core20PLUS5 is a national NHS England approach to support the reduction of health inequalities, defining target populations and clinical areas that require improvement.</p><p>More information is available on the <a href={{URLS.CORE20PLUS5}} target="_blank" rel="noopener noreferrer">Core20PLUS5 web page (opens in a new window)</a>.</p>',
//               validations: {
//                 isRequired: 'Choose at least one item'
//               },
//               items: [
//                 {
//                   id: 'maternity',
//                   label: 'Maternity'
//                 },
//                 {
//                   id: 'severMentalIllness',
//                   label: 'Severe mental illness'
//                 },
//                 {
//                   id: 'chronicRespiratoryDisease',
//                   label: 'Chronic respiratory disease'
//                 },
//                 {
//                   id: 'earlyCancerDiagnosis',
//                   label: 'Early cancer diagnosis'
//                 },
//                 {
//                   id: 'hypertensionCaseFinding',
//                   label: 'Hypertension case finding and optimal management and lipid optimal management'
//                 },
//                 {
//                   type: 'separator'
//                 },
//                 {
//                   id: 'none',
//                   label: 'None of those listed',
//                   exclusive: true
//                 }
//               ]
//             },
//             {
//               id: 'completedHealthInequalitiesImpactAssessment',
//               dataType: 'radio-group',
//               label: 'Have you completed a health inequalities impact assessment?',
//               description:
//                 '<p>By this, we mean a document or template which assesses the impact of your innovation on health inequalities and on those with protected characteristics. Health inequalities are the unfair and avoidable differences in health across the population, and between different groups within society.</p><p>An example of a completed health inequalities impact assessment can be found on <a href={{URLS.EQUALITY_AND_HEALTH_INEQUALITIES_IMPACT_ASSESSMENT_EHIA}} target="_blank" rel="noopener noreferrer">NHS England\'s web page (opens in a new window)</a>.</p>',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           id: 'evidenceOfEffectiveness',
//           title: 'Evidence of impact and benefit',
//           questions: [
//             {
//               id: 'hasEvidence',
//               dataType: 'radio-group',
//               label: 'Do you have any evidence to show the impact or benefits of your innovation?',
//               description: "You'll have the opportunity to add evidence at the end of this section.",
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'notYet',
//                   label: 'Not yet'
//                 }
//               ]
//             },
//             {
//               id: 'currentlyCollectingEvidence',
//               dataType: 'radio-group',
//               label: 'Are you currently collecting evidence, or have plans to collect evidence?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             },
//             {
//               id: 'summaryOngoingEvidenceGathering',
//               dataType: 'textarea',
//               label:
//                 'Write a short summary of your ongoing or planned evidence gathering, including the IRAS number if known.',
//               description:
//                 'An IRAS ID is a unique identifier, which is generated by IRAS when you first create a project. It is the accepted common study identifier, allowing research to be traced across its study lifecycle. For more information visit the <a href={{URLS.MY_RESEARCH_PROJECT}} target="_blank" rel="noopener noreferrer">IRAS website (opens in a new window)</a>.',
//               lengthLimit: 'l',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.currentlyCollectingEvidence == 'yes'"
//             },
//             {
//               id: 'needsSupportAnyArea',
//               dataType: 'checkbox-array',
//               label: 'Do you need support with any of these areas?',
//               validations: {
//                 isRequired: 'Choose at least one item'
//               },
//               items: [
//                 {
//                   id: 'researchGovernance',
//                   label: 'Research governance, including research ethics approvals'
//                 },
//                 {
//                   id: 'dataSharing',
//                   label: 'Accessing and sharing health and care data'
//                 },
//                 {
//                   id: 'confidentialPatientData',
//                   label: 'Use of confidential patient data'
//                 },
//                 {
//                   id: 'approvalDataStudies',
//                   label: 'Approval of data studies'
//                 },
//                 {
//                   id: 'understandingLaws',
//                   label: 'Understanding the laws that regulate the use of health and care data'
//                 },
//                 {
//                   type: 'separator'
//                 },
//                 {
//                   id: 'doNotNeedSupport',
//                   label: 'No, I do not need support',
//                   exclusive: true
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'marketResearchAndCurrentCarePathway',
//       title: 'Market research and current care pathway',
//       subSections: [
//         {
//           id: 'marketResearch',
//           title: 'Market research',
//           questions: [
//             {
//               id: 'hasMarketResearch',
//               dataType: 'radio-group',
//               label:
//                 'Have you conducted market research to determine the demand and need for your innovation in the UK?',
//               description:
//                 'By this, we mean any research you have done to determine the market opportunity for your innovation. You will be able to explain any testing you have done with users later in the record.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'inProgress',
//                   label: "I'm currently doing market research"
//                 },
//                 {
//                   id: 'notYet',
//                   label: 'Not yet'
//                 }
//               ]
//             },
//             {
//               id: 'marketResearch',
//               dataType: 'textarea',
//               label: 'Describe the market research you have done, or are doing, within the UK market',
//               description:
//                 'This could include a mix of interviews, focus groups, patient record forms, surveys, ethnography, or other market research methods.',
//               lengthLimit: 'l',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.hasMarketResearch != 'notYet'"
//             },
//             {
//               id: 'optionBestDescribesInnovation',
//               dataType: 'radio-group',
//               label: 'Which option best describes your innovation?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               condition: "data.hasMarketResearch != 'notYet'",
//               items: [
//                 {
//                   id: 'oneOffInnovation',
//                   label: 'A one-off innovation, or the first of its kind'
//                 },
//                 {
//                   id: 'betterAlternative',
//                   label: 'A better alternative to those that already exist'
//                 },
//                 {
//                   id: 'equivalentAlternative',
//                   label: 'An equivalent alternative to those that already exist'
//                 },
//                 {
//                   id: 'costEffectAlternative',
//                   label: 'A more cost-effect alternative to those that already exist'
//                 },
//                 {
//                   id: 'notSure',
//                   label: 'I am not sure'
//                 }
//               ]
//             },
//             {
//               id: 'whatCompetitorsAlternativesExist',
//               dataType: 'textarea',
//               label: 'What competitors or alternatives exist, or how is the problem addressed in current practice?',
//               description: 'Include how your innovation is different to the alternatives in the market.',
//               lengthLimit: 'l',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.hasMarketResearch != 'notYet'"
//             }
//           ]
//         },
//         {
//           id: 'currentCarePathway',
//           title: 'Current care pathway',
//           questions: [
//             {
//               id: 'innovationPathwayKnowledge',
//               dataType: 'radio-group',
//               label: 'Does your innovation relate to a current NHS care pathway?',
//               description:
//                 '<p>An NHS care pathway outlines the entire patient journey and the actions taken in different parts of the healthcare system. It\'s key to understand the existing routines of clinical and care professionals, administrators and others who will be impacted by your innovation.</p><p>If your innovation does not play a role in the delivery of care, select "does not form part of a care pathway".</p>',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'pathwayExistsAndChanged',
//                   label: 'There is a pathway, and my innovation changes it'
//                 },
//                 {
//                   id: 'pathwayExistsAndFits',
//                   label: 'There is a pathway, and my innovation fits in to it'
//                 },
//                 {
//                   id: 'noPathway',
//                   label: 'There is no current care pathway'
//                 },
//                 {
//                   id: 'dontKnow',
//                   label: 'I do not know'
//                 },
//                 {
//                   id: 'notPartPathway',
//                   label: 'Does not form part of a care pathway'
//                 }
//               ]
//             },
//             {
//               id: 'potentialPathway',
//               dataType: 'textarea',
//               label: 'Describe the potential care pathway with your innovation in use',
//               description:
//                 'Focus on any areas that will be impacted by introducing your innovation to the care pathway.',
//               lengthLimit: 'm',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition:
//                 "data.innovationPathwayKnowledge != 'dontKnow' and data.innovationPathwayKnowledge != 'notPartPathway'"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'testingWithUsers',
//       title: 'Testing with users',
//       subSections: [
//         {
//           id: 'testingWithUsers',
//           title: 'Testing with users',
//           questions: [
//             {
//               id: 'involvedUsersDesignProcess',
//               dataType: 'radio-group',
//               label: 'Have you involved users in the design process?',
//               description:
//                 'This includes involving patients or the public, carers, clinicians or administrators in the design process, including people with different accessibility needs.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'inProgress',
//                   label: 'I am in the process of involving users in the design'
//                 },
//                 {
//                   id: 'notYet',
//                   label: 'Not yet'
//                 }
//               ]
//             },
//             {
//               id: 'testedWithIntendedUsers',
//               dataType: 'radio-group',
//               label: 'Have you tested your innovation with its intended users in a real life setting?',
//               description: 'Do not include any testing you have done with users in a controlled setting.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'inProgress',
//                   label: 'I am in the process of testing with users'
//                 },
//                 {
//                   id: 'notYet',
//                   label: 'Not yet'
//                 }
//               ]
//             },
//             {
//               id: 'intendedUserGroupsEngaged',
//               dataType: 'checkbox-array',
//               label: 'Which groups of intended users have you engaged with?',
//               validations: {
//                 isRequired: 'Choose at least one group'
//               },
//               items: [
//                 {
//                   id: 'clinicalSocialCareWorkingInsideUk',
//                   label: 'Clinical or social care professionals working in the UK health and social care system'
//                 },
//                 {
//                   id: 'clinicalSocialCareWorkingOutsideUk',
//                   label: 'Clinical or social care professionals working outside the UK'
//                 },
//                 {
//                   id: 'nonClinicalHealthcare',
//                   label: 'Non-clinical healthcare staff'
//                 },
//                 {
//                   id: 'patients',
//                   label: 'Patients'
//                 },
//                 {
//                   id: 'serviceUsers',
//                   label: 'Service users'
//                 },
//                 {
//                   id: 'carers',
//                   label: 'Carers'
//                 },
//                 {
//                   id: 'other',
//                   label: 'Other',
//                   conditional: {
//                     id: 'otherIntendedUserGroupsEngaged',
//                     dataType: 'text',
//                     label: 'Other group',
//                     validations: {
//                       isRequired: 'Other group description is required',
//                       maxLength: 100
//                     }
//                   }
//                 }
//               ]
//             },
//             {
//               id: 'userTests',
//               dataType: 'fields-group',
//               label: 'What kind of testing with users have you done?',
//               description:
//                 'This can include any testing you have done with people who would use your innovation, for example patients, nurses or administrative staff.',
//               field: {
//                 id: 'kind',
//                 dataType: 'text',
//                 label: 'User test',
//                 validations: {
//                   isRequired: 'Required',
//                   maxLength: 100
//                 }
//               },
//               addNewLabel: 'Add new user test',
//               addQuestion: {
//                 id: 'feedback',
//                 dataType: 'textarea',
//                 label: 'Describe the testing and feedback for {{question}}',
//                 description:
//                   'Provide a brief summary of the method and key findings. You can upload any documents that showcase your user testing next.',
//                 validations: {
//                   isRequired: 'A description is required'
//                 },
//                 lengthLimit: 's'
//               }
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'regulationsStandardsCertificationsAndIntellectualProperty',
//       title: 'Regulations, standards, certifications and intellectual property',
//       subSections: [
//         {
//           id: 'regulationsAndStandards',
//           title: 'Regulatory approvals, standards and certifications',
//           questions: [
//             {
//               id: 'hasRegulationKnowledge',
//               dataType: 'radio-group',
//               label: 'Do you know which regulations, standards and certifications apply to your innovation?',
//               description:
//                 'Find out more about <a href="{{URLS.INNOVATION_GUIDES_REGULATION}}" target="_blank" rel="noopener noreferrer">regulations (opens in a new window)</a>.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yesAll',
//                   label: 'Yes, I know all of them'
//                 },
//                 {
//                   id: 'yesSome',
//                   label: 'Yes, I know some of them'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 },
//                 {
//                   id: 'notRelevant',
//                   label: 'Not relevant'
//                 }
//               ]
//             },
//             {
//               id: 'standardsType',
//               dataType: 'checkbox-array',
//               label: 'Which regulations, standards and certifications apply to your innovation?',
//               description:
//                 'Find out more about <a href="{{URLS.UNDERSTANDING_REGULATIONS_MEDICAL_DEVICES}}" target="_blank" rel="noopener noreferrer">UKCA / CE marking (opens in a new window)</a>, <a href="{{URLS.UNDERSTANDING_CQC_REGULATIONS}}" target="_blank" rel="noopener noreferrer">CQC registration (opens in a new window)</a>, or <a href={{URLS.NHS_DIGITAL_TECHNOLOGY_ASSESSMENT_CRITERIA}} target="_blank" rel="noopener noreferrer">DTAC (opens in a new window)</a>.',
//               validations: {
//                 isRequired: 'Choose at least one option'
//               },
//               condition: "data.hasRegulationKnowledge != 'no' and data.hasRegulationKnowledge != 'notRelevant'",
//               items: [
//                 {
//                   id: 'ceUkcaNonMedical',
//                   label: 'Non-medical device',
//                   group: 'UKCA / CE'
//                 },
//                 {
//                   id: 'ceUkcaClassI',
//                   label: 'Class I medical device',
//                   group: 'UKCA / CE'
//                 },
//                 {
//                   id: 'ceUkcaClassIiA',
//                   label: 'Class IIa medical device',
//                   group: 'UKCA / CE'
//                 },
//                 {
//                   id: 'ceUkcaClassIiB',
//                   label: 'Class IIb medical device',
//                   group: 'UKCA / CE'
//                 },
//                 {
//                   id: 'ceUkcaClassIii',
//                   label: 'Class III medical device',
//                   group: 'UKCA / CE'
//                 },
//                 {
//                   id: 'ivdGeneral',
//                   label: 'IVD general',
//                   group: 'In-vitro diagnostics'
//                 },
//                 {
//                   id: 'ivdSelfTest',
//                   label: 'IVD self-test',
//                   group: 'In-vitro diagnostics'
//                 },
//                 {
//                   id: 'ivdAnnexListA',
//                   label: 'IVD Annex II List A',
//                   group: 'In-vitro diagnostics'
//                 },
//                 {
//                   id: 'ivdAnnexListB',
//                   label: 'IVD Annex II List B',
//                   group: 'In-vitro diagnostics'
//                 },
//                 {
//                   id: 'marketing',
//                   label: 'Marketing authorisation for medicines'
//                 },
//                 {
//                   id: 'cqc',
//                   label: 'Care Quality Commission (CQC) registration, as I am providing a regulated activity'
//                 },
//                 {
//                   id: 'dtac',
//                   label: 'Digital Technology Assessment Criteria (DTAC)'
//                 },
//                 {
//                   id: 'other',
//                   label: 'Other',
//                   conditional: {
//                     id: 'otherRegulationDescription',
//                     dataType: 'text',
//                     label: 'Other regulations, standards and certifications that apply',
//                     validations: {
//                       isRequired: 'Other regulations, standards and certifications is required',
//                       maxLength: 100
//                     }
//                   }
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           id: 'intellectualProperty',
//           title: 'Intellectual property',
//           questions: [
//             {
//               id: 'hasPatents',
//               dataType: 'radio-group',
//               label: 'Do you have any patents for your innovation?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'hasAtLeastOne',
//                   label: 'I have one or more patents',
//                   conditional: {
//                     id: 'patentNumbers',
//                     dataType: 'text',
//                     label: 'Patent number(s)',
//                     validations: {
//                       isRequired: 'Patent number(s) required',
//                       maxLength: 100
//                     }
//                   }
//                 },
//                 {
//                   id: 'appliedAtLeastOne',
//                   label: 'I have applied for one or more patents'
//                 },
//                 {
//                   id: 'hasNone',
//                   label: 'I do not have any patents, but believe I have freedom to operate'
//                 }
//               ]
//             },
//             {
//               id: 'hasOtherIntellectual',
//               dataType: 'radio-group',
//               label: 'Do you have any other intellectual property for your innovation?',
//               description:
//                 'Find out more about <a href={{URLS.INNOVATION_GUIDES_INTELLECTUAL_PROPERTY}} target="_blank" rel="noopener noreferrer">intellectual property (opens in a new window)</a>.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes',
//                   conditional: {
//                     id: 'otherIntellectual',
//                     dataType: 'text',
//                     label: 'Type of intellectual property',
//                     validations: {
//                       isRequired: 'Type of intellectual property is required',
//                       maxLength: 100
//                     }
//                   }
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'revenueModel',
//       title: 'Revenue model',
//       subSections: [
//         {
//           id: 'revenueModel',
//           title: 'Revenue model',
//           questions: [
//             {
//               id: 'hasRevenueModel',
//               dataType: 'radio-group',
//               label: 'Do you have a model for generating revenue from your innovation?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 },
//                 {
//                   id: 'dontKnow',
//                   label: 'I do not know'
//                 }
//               ]
//             },
//             {
//               id: 'revenues',
//               dataType: 'checkbox-array',
//               label: 'What is the revenue model for your innovation?',
//               validations: {
//                 isRequired: 'Choose at least one revenue model'
//               },
//               // condition: "data.hasRevenueModel !== 'no' && data.hasRevenueModel !== 'dontKnow'",
//               items: [
//                 {
//                   id: 'advertising',
//                   label: 'Advertising'
//                 },
//                 {
//                   id: 'directProductSales',
//                   label: 'Direct product sales'
//                 },
//                 {
//                   id: 'feeForService',
//                   label: 'Fee for service'
//                 },
//                 {
//                   id: 'lease',
//                   label: 'Lease'
//                 },
//                 {
//                   id: 'salesOfConsumablesOrAccessories',
//                   label: 'Sales of consumables or accessories'
//                 },
//                 {
//                   id: 'subscription',
//                   label: 'Subscription'
//                 },
//                 {
//                   id: 'other',
//                   label: 'Other',
//                   conditional: {
//                     id: 'otherRevenueDescription',
//                     dataType: 'text',
//                     label: 'Other revenue model',
//                     validations: {
//                       isRequired: 'Other revenue model is required',
//                       maxLength: 100
//                     }
//                   }
//                 }
//               ]
//             },
//             {
//               id: 'payingOrganisations',
//               dataType: 'textarea',
//               label: 'Which NHS or social care organisation and department do you think would pay for the innovation?',
//               description: 'Be as specific as you can.',
//               lengthLimit: 'm',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//               // condition: "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow'"
//             },
//             {
//               id: 'benefittingOrganisations',
//               dataType: 'textarea',
//               label: 'Which NHS or social care organisation and department would benefit from the innovation?',
//               description: 'Be as specific as you can.',
//               lengthLimit: 'm',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//               // condition: "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow'"
//             },
//             {
//               id: 'hasFunding',
//               dataType: 'radio-group',
//               label: 'Have you secured funding for the next stage of development?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               // condition: "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow'",
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 },
//                 {
//                   id: 'notRelevant',
//                   label: 'Not relevant'
//                 }
//               ]
//             },
//             {
//               id: 'fundingDescription',
//               dataType: 'textarea',
//               label: 'Describe the funding you have secured for the next stage of development',
//               description:
//                 'For example, venture capital, angel investor, seed funding, grant funding, government funding or similar.',
//               lengthLimit: 's',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//               // condition:
//               // "data.hasRevenueModel != 'no' and data.hasRevenueModel != 'dontKnow' and data.hasFunding != 'no' and data.hasFunding != 'notRelevant'"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'costAndSavings',
//       title: 'Cost and savings',
//       subSections: [
//         {
//           id: 'costOfInnovation',
//           title: 'Cost of your innovation',
//           questions: [
//             {
//               id: 'hasCostKnowledge',
//               dataType: 'radio-group',
//               label: 'Do you know the cost of your innovation?',
//               description:
//                 'By cost, we mean the cost to the NHS or any care organisation that would implement your innovation. Support organisations will use this to calculate cost effectiveness.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'detailedEstimate',
//                   label: 'Yes, I have a detailed estimate'
//                 },
//                 {
//                   id: 'roughIdea',
//                   label: 'Yes, I have a rough idea'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             },
//             {
//               id: 'costDescription',
//               dataType: 'textarea',
//               label: 'What is the cost of your innovation?',
//               description:
//                 '<p>Include the relevant metric such as a flat capital cost or cost per patient, cost per unit or cost per procedure. Include any costs associated with implementation and resources.</p><p>For example, £10 based on 500 units per site. £345 per procedure and a typical patient requires two procedures.</p>',
//               lengthLimit: 'm',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.hasCostKnowledge != 'no'"
//             },
//             {
//               id: 'patientsRange',
//               dataType: 'radio-group',
//               label: 'Roughly how many patients would be eligible for your innovation in the UK?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'upTo10000',
//                   label: 'Up to 10,000 per year'
//                 },
//                 {
//                   id: 'between10000And500000',
//                   label: '10,000 to half a million per year'
//                 },
//                 {
//                   id: 'moreThan500000',
//                   label: 'More than half a million per year'
//                 },
//                 {
//                   id: 'notSure',
//                   label: 'I am not sure'
//                 },
//                 {
//                   id: 'notRelevant',
//                   label: 'Not relevant to my innovation'
//                 }
//               ]
//             },
//             {
//               id: 'eligibilityCriteria',
//               dataType: 'textarea',
//               label: 'What is the eligibility criteria for your innovation?',
//               description:
//                 '<p>For example, users need to be over a certain age, or have a certain medical history or current health status.</p><p>Answer "not relevant" if your innovation does not have any eligibility criteria.</p>',
//               lengthLimit: 'm',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.patientsRange != 'notRelevant'"
//             },
//             {
//               id: 'sellExpectations',
//               dataType: 'textarea',
//               label: 'How many units of your innovation would you expect to sell in the UK per year?',
//               lengthLimit: 's',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//             },
//             {
//               id: 'usageExpectations',
//               dataType: 'textarea',
//               label: 'Approximately how long do you expect each unit of your innovation to be in use?',
//               description:
//                 "By this we mean the shelf life of the product, or the product's lifespan. This can include the lifespan of any components such as batteries.",
//               lengthLimit: 'm',
//               validations: {
//                 isRequired: 'A description is required'
//               }
//             },
//             {
//               id: 'costComparison',
//               dataType: 'radio-group',
//               label:
//                 'What are the costs associated with the use of your innovation, compared to current practice in the UK?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'cheaper',
//                   label: 'My innovation is cheaper to purchase'
//                 },
//                 {
//                   id: 'costsMoreWithSavings',
//                   label:
//                     'My innovation costs more to purchase, but has greater benefits that will lead to overall cost savings'
//                 },
//                 {
//                   id: 'costsMore',
//                   label:
//                     'My innovation costs more to purchase and has greater benefits, but will lead to higher costs overall'
//                 },
//                 {
//                   id: 'notSure',
//                   label: 'I am not sure'
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'deployment',
//       title: 'Deployment',
//       subSections: [
//         {
//           id: 'deployment',
//           title: 'Deployment',
//           questions: [
//             {
//               id: 'hasDeployPlan',
//               dataType: 'radio-group',
//               label: 'Is your innovation ready for wider adoption across the health and care system?',
//               description:
//                 'Find out more about <a href={{URLS.INNOVATION_GUIDES_COMISSIONING_AND_ADOPTION}} target="_blank" rel="noopener noreferrer">commissioning and adoption (opens in a new window)</a>.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             },
//             {
//               id: 'isDeployed',
//               dataType: 'radio-group',
//               label: 'Has your innovation been deployed in a NHS or care setting?',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 }
//               ]
//             },
//             {
//               id: 'stepDeploymentPlans',
//               dataType: 'fields-group',
//               label: 'Where have you deployed your innovation?',
//               description: 'Provide the name of the organisation and the department, if possible.',
//               condition: "data.isDeployed != 'no'",
//               field: {
//                 id: 'organizationDepartment',
//                 dataType: 'text',
//                 label: 'Organisation and department',
//                 validations: {
//                   isRequired: 'Organisation and department are required',
//                   maxLength: 100
//                 }
//               },
//               addNewLabel: 'Add new organisations and department'
//             },
//             {
//               id: 'commercialBasis',
//               dataType: 'textarea',
//               label: 'What was the commercial basis for deployment?',
//               description:
//                 "For example, did you provide your innovation for free or was it purchased? Or was it part funded by yourself and the NHS area in which it's being deployed?",
//               lengthLimit: 'xl',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.isDeployed != 'no'"
//             },
//             {
//               id: 'organisationDeploymentAffect',
//               dataType: 'textarea',
//               label: 'How did the deployment of your innovation affect the organisation(s)?',
//               description: 'For example, which job roles were affected and how was the care pathway redesigned?',
//               lengthLimit: 'xl',
//               validations: {
//                 isRequired: 'A description is required'
//               },
//               condition: "data.isDeployed != 'no'"
//             },
//             {
//               id: 'hasResourcesToScale',
//               dataType: 'radio-group',
//               label: 'Does your team have the resources for scaling up to national deployment?',
//               description: 'This includes having a team with the right combination of skills and knowledge.',
//               validations: {
//                 isRequired: 'Choose one option'
//               },
//               items: [
//                 {
//                   id: 'yes',
//                   label: 'Yes'
//                 },
//                 {
//                   id: 'no',
//                   label: 'No'
//                 },
//                 {
//                   id: 'notSure',
//                   label: 'I am not sure'
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// };
