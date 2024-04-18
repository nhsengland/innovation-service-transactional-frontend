import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormArray, FormControl, FormEngineParameterModel, FormGroup } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';

import { AccessorService } from '../../../services/accessor.service';

import { ActivatedRoute } from '@angular/router';
import { SupportLogType } from '@modules/shared/services/innovations.dtos';
import { AuthenticationStore } from '@modules/stores';

type OrganisationInformation = {
  displayName: string;
  acronym: string;
  link: string;
  supportInformation: {
    title: string;
    bulletPoints: string[];
    footnote?: string;
  }[];
  programmes?: string[];
};

@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-support-status-suggest',
  templateUrl: './organisations-support-status-suggest.component.html'
})
export class InnovationSupportOrganisationsSupportStatusSuggestComponent extends CoreComponent implements OnInit {
  private supportUpdateSideEffect = false;

  stepNumber: number;
  innovation: ContextInnovationType;

  form: FormGroup<{
    organisation: FormControl<null | string>;
    units?: FormArray<FormControl<string>>;
    comment: FormControl<null | string>;
  }> = new FormGroup(
    {
      organisation: new FormControl<null | string>(null, [
        CustomValidators.required('Select an organisation and click continue')
      ]),
      comment: new FormControl<string>(
        '',
        CustomValidators.required(
          'Describe why you think this innovation would benefit from support from this organisation and click confirm'
        )
      )
    },
    { updateOn: 'blur' }
  );

  previousOrganisationsSuggestions: { [key: string]: string[] } = {};

  organisations: OrganisationsListDTO[] = [];
  organisationsToSuggest: (OrganisationsListDTO & { description: string | undefined })[] = [];

  organisationItems: Required<FormEngineParameterModel>['items'] = [];
  unitsItems: Required<FormEngineParameterModel>['items'] = [];

  chosenUnits: {
    organisation: { name: string; acronym: string; information?: OrganisationInformation };
    unitsNames: string[];
    values: string[];
  } = { organisation: { name: '', acronym: '' }, unitsNames: [], values: [] };

  submitButton = { isActive: true, label: 'Confirm' };

  // Move this variable to a new file when updating the referral criteria page
  organisationsInformation: OrganisationInformation[] = [
    {
      displayName: 'Department for Business and Trade (DBT)',
      acronym: 'DBT',
      link: this.CONSTANTS.URLS.LIFE_SCIENCES_ORGANISATION,
      supportInformation: [
        {
          title: 'DBT can support innovations that are:',
          bulletPoints: [
            'in the later stages of the innovation process',
            'based in the UK, have a product ready for sale and a sense of what overseas markets they intend to enter',
            'based overseas and are interested in direct investment in the UK'
          ]
        },
        {
          title: 'DBT can:',
          bulletPoints: [
            'support UK companies wishing to initiate or expand their exports overseas',
            'support with foreign direct investment (FDI) opportunities, for example investor journey support, location opportunities, understanding tax and other incentives',
            'provide general information on export support, public offer documents and directories',
            "refer the innovator to a DBT International Trade Adviser (ITA), to DBT staff based in overseas posts, to DBT's Investment Services team, to DBT's UK regional and DA partners, or within a DBT Sector team, for example Biopharma, Medtech or Digital Health",
            'support or signpost to opportunities for UK small and medium-sized enterprises (SMEs) seeking to raise venture capital, particularly for fundraising of Series A and beyond'
          ]
        }
      ]
    },
    {
      displayName: 'Health Innovation Network (HIN)',
      acronym: 'HIN',
      link: this.CONSTANTS.URLS.HIN_NETWORK,
      supportInformation: [
        {
          title: 'HINS can support innovations that are:',
          bulletPoints: [
            'close to being adoption-ready',
            'likely to be in scope for an NHS Supply Chain procurement framework',
            'likely to be in scope for health technology appraisal',
            'likely to be in scope for advice and support on export to international markets, or establishing a business base within the UK for international companies',
            'likely to be in scope for other HINs for local adoption (a value proposition and business case have been developed)'
          ]
        }
      ]
    },
    {
      displayName: 'Health Research Authority (HRA)',
      acronym: 'HRA',
      link: this.CONSTANTS.URLS.NHR,
      supportInformation: [
        {
          title: 'HRA can support innovators who are:',
          bulletPoints: [
            'seeking advice on research for all types of technologies, including the legal requirements for using health and care data in the development of data driven research',
            'in early stage, who require guidance on research governance and clinical trial regulation (particularly in relation to public involvement, diversity and inclusion)',
            'seeking clarity on whether their study is defined as research and advice on the research regulatory approval processes'
          ]
        }
      ]
    },
    {
      displayName: 'Health Technology Wales (HTW)',
      acronym: 'HTW',
      link: this.CONSTANTS.URLS.HEALTH_TECHNOLOGY,
      supportInformation: [
        {
          title: 'HTW can support innovations that are:',
          bulletPoints: ['MedTech, devices, digital, care pathways, service models or surgical innovations']
        },
        {
          title: 'HTW can support innovations when:',
          bulletPoints: [
            'regulatory approvals are already in place, or there is evidence that this is underway',
            'they are truly innovative or offers benefits above current standard care',
            'they demonstrate evidence of patient benefit'
          ]
        }
      ],
      programmes: ['Scientific advice commercial programme', 'Scientific advice specialist trial advice']
    },
    {
      displayName: 'Life Sciences Hub Wales',
      acronym: 'LSHW',
      link: this.CONSTANTS.URLS.LSHUBWALES,
      supportInformation: [
        { title: 'Life Sciences Hub Wales can support innovations that:', bulletPoints: ['are based in Wales'] },
        {
          title: 'Life Sciences Hub Wales can support innovators with:',
          bulletPoints: [
            'NHS Wales navigation',
            'NHS Wales digital landscape navigation',
            'Welsh Government policy',
            'healthcare system collaboration focused on preventive medicine and providing care closer to home',
            'investment readiness and business development support',
            'access to science parks',
            'subject expertise and thematic focus groups',
            'digital and AI',
            'precision medicine (advanced therapies, early diagnostics)',
            'user centred design and product design',
            'research and development',
            'academic collaboration',
            'funding support',
            'intellectual property',
            'project management'
          ]
        }
      ],
      programmes: ['Digital Health Ecosystem Wales (DHEW)']
    },
    {
      displayName: 'National Institute for Health and Care Excellence (NICE)',
      acronym: 'NICE',
      link: this.CONSTANTS.URLS.NICE,
      supportInformation: [
        {
          title: 'NICE can support innovations that are:',
          bulletPoints: [
            'medical devices, diagnostic technologies, interventional procedures, pharmaceuticals and digital health',
            'pharmaceutical and healthtech companies seeking to enter the NHS market',
            'preparing for a NICE evaluation, or engagement with NHS payers or commissioners',
            'looking to unpick challenges in the evidence generation process'
          ]
        },
        {
          title: 'NICE can provide guidance when:',
          bulletPoints: [
            'regulatory approvals are in place or there are there are well developed plans in place to achieve this',
            "there is a clear value proposition for NICE's guidance producing programmes",
            'evidence exists to support claim of benefits'
          ]
        }
      ]
    },
    {
      displayName: 'National Institute for Health and Care Research (NIHR)',
      acronym: 'NIHR',
      link: this.CONSTANTS.URLS.NIHR,
      supportInformation: [
        {
          title: 'NIHR can support innovators with:',
          bulletPoints: [
            'research and study design - not just clinical trials',
            'clinical trial and evaluation - identifying and linking to suitable clinical partners, designing and costing research studies and protocols',
            'real-world evidence gathering',
            'health economic analysis',
            'grant funding, and support to identify grant funds and apply for them',
            'provision of patient and clinical data for research',
            'provision of patient samples for research'
          ]
        }
      ]
    },
    {
      displayName: 'NHS Supply Chain',
      acronym: 'NHS-SC',
      link: this.CONSTANTS.URLS.SUPPLY_CHAIN,
      supportInformation: [
        {
          title: 'NHS Supply Chain can support innovations that are:',
          bulletPoints: [
            'medical devices, equipment, consumables, goods and services used by hospitals',
            'digital products that are associated with equipment',
            'products which have a MedTech Funding Mandate',
            'appropriately regulated and certificated, or are likely to achieve this within the next 2 years',
            'new products that can demonstrate clinical effectiveness and key benefits over existing suppliers, for example additional cost savings'
          ]
        },
        {
          title: 'NHS Supply Chain can support innovators by providing information on:',
          bulletPoints: [
            'public procurement regulations that need to be met',
            'the contracts finder',
            'MHRA regulations for public procurement at start of an engagement'
          ]
        }
      ]
    },
    {
      displayName: 'Scottish Health Technologies Group (SHTG)',
      acronym: 'SHTG',
      link: this.CONSTANTS.URLS.SHTG,
      supportInformation: [
        {
          title: 'To receive support from SHTG innovations must be:',
          bulletPoints: [
            'MedTech, devices, digital or diagnostics care pathways*',
            'products with regulatory approval*',
            'products with a well-defined evidence base*',
            'new or innovative solutions'
          ],
          footnote: '*The first three requirements must all be met to receive support'
        }
      ]
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private authenticationStore: AuthenticationStore
  ) {
    super();
    this.innovation = this.stores.context.getInnovation();
    this.stepNumber = 1;
  }

  ngOnInit(): void {
    this.handlePageTitle();
    this.setBackLink('Go back', this.handleGoBack.bind(this));

    this.supportUpdateSideEffect = this.activatedRoute.snapshot.queryParams['entryPoint'] === 'supportUpdate';

    forkJoin([
      this.organisationsService.getOrganisationsList({ unitsInformation: true }),
      this.innovationsService.getInnovationSupportsList(this.innovation.id, false)
    ]).subscribe({
      next: ([organisations, innovationSupports]) => {
        this.organisations = organisations;

        this.previousOrganisationsSuggestions = JSON.parse(sessionStorage.getItem('organisationsSuggestions') || '{}');

        const engagingUnitsIds = innovationSupports
          .filter(support => support.status === 'ENGAGING')
          .map(support => support.organisation.unit.id);

        const userUnitId = this.authenticationStore.getUserContextInfo()?.organisationUnit?.id;

        this.organisationsToSuggest = this.organisations
          .map(org => {
            const newOrg = {
              ...org,
              organisationUnits: org.organisationUnits.filter(
                unit =>
                  ![
                    ...(this.previousOrganisationsSuggestions[this.innovation.id] || []),
                    ...engagingUnitsIds,
                    userUnitId
                  ].includes(unit.id)
              )
            };

            let description = undefined;
            if (org.organisationUnits.length > 1) {
              const totalUnits = newOrg.organisationUnits.length;
              description = `${totalUnits} ${totalUnits > 1 ? 'units' : 'unit'} in this organisation`;
            }

            return { ...newOrg, description };
          })
          .filter(org => org.organisationUnits.length > 0);

        this.organisationItems = this.organisationsToSuggest.map(org => ({
          value: org.id,
          label: `${org.name} (${org.acronym})`,
          description: org.description
        }));

        this.organisationItems.unshift({ value: 'Select an organisation:', label: 'HEADING' });

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onSubmitStep(): void {
    this.resetAlert();

    switch (this.stepNumber) {
      case 1:
        const organisation = this.form.get('organisation');
        if (!organisation?.value) {
          this.setAlertError('You have not selected an organisation', {
            itemsList: [
              {
                title: 'Select an organisation and click continue',
                fieldId: 'organisation1'
              }
            ],
            width: '2.thirds'
          });
          organisation?.markAsTouched();
        } else {
          const chosenOrganisation = this.organisationsToSuggest.find(org => org.id === organisation?.value!)!;

          this.chosenUnits.organisation = {
            name: chosenOrganisation.name,
            acronym: chosenOrganisation.acronym,
            information: this.organisationsInformation.find(org => org.acronym === chosenOrganisation.acronym)
          };

          // Count total number of units inside organisation
          const totalUnits = this.organisations.find(org => org.id === organisation?.value!)!.organisationUnits.length;

          const units = this.form.get('units');
          if (totalUnits > 1) {
            if (!units) {
              this.form.addControl(
                'units',
                new FormArray<FormControl<string>>(
                  [],
                  [CustomValidators.requiredCheckboxArray('Select 1 or more organisation units and click continue')]
                )
              );
            }

            this.unitsItems = chosenOrganisation.organisationUnits.map(unit => ({
              value: unit.id,
              label: unit.name
            }));

            this.unitsItems.unshift({
              value: 'Select the organisation units you want to suggest:',
              label: 'HEADING'
            });

            this.stepNumber = 2;
          } else {
            if (units) {
              this.form.removeControl('units');
              this.chosenUnits.unitsNames = [];
            }

            this.chosenUnits.values = [chosenOrganisation.organisationUnits[0].id];

            this.stepNumber = 3;
          }
        }

        break;

      case 2:
        const units = this.form.get('units');
        if (!units?.value?.length) {
          this.setAlertError('You have not selected an organisation unit', {
            itemsList: [
              {
                title: 'Select 1 or more organisation units and click continue',
                fieldId: 'units1'
              }
            ],
            width: '2.thirds'
          });
          units?.markAsTouched();
        } else {
          this.chosenUnits.unitsNames = this.organisationsToSuggest
            .find(org => org.id === this.form.get('organisation')!.value!)!
            .organisationUnits.filter(unit => units?.value?.includes(unit.id))
            .map(unit => unit.name);

          this.chosenUnits.values = units?.value!;

          this.stepNumber++;
        }

        break;

      default:
        break;
    }

    this.handlePageTitle();
  }

  onSubmit(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('You have not added a description ', {
        itemsList: [
          {
            title:
              'Describe why you think this innovation would benefit from support from this organisation and click confirm',
            fieldId: 'comment'
          }
        ],
        width: '2.thirds'
      });
      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    const body = {
      organisationUnits: this.chosenUnits.values,
      description: this.form.get('comment')?.value || '',
      type: SupportLogType.ACCESSOR_SUGGESTION
    };

    this.accessorService.suggestNewOrganisations(this.innovation.id, body).subscribe({
      next: () => {
        sessionStorage.setItem(
          'organisationsSuggestions',
          JSON.stringify({
            ...this.previousOrganisationsSuggestions,
            [this.innovation.id]: [
              ...(this.previousOrganisationsSuggestions[this.innovation.id] || []),
              ...body.organisationUnits
            ]
          })
        );

        switch (this.chosenUnits.unitsNames.length) {
          case 0:
            this.setRedirectAlertSuccess(
              `You have suggested ${this.chosenUnits.organisation.name} (${this.chosenUnits.organisation.acronym}) to support this innovation`
            );
            break;
          case 1:
            this.setRedirectAlertSuccess(
              `You have suggested ${this.chosenUnits.unitsNames[0]} to support this innovation`
            );
            break;
          case 2:
            this.setRedirectAlertSuccess(
              `You have suggested ${this.chosenUnits.unitsNames[0]} and ${this.chosenUnits.unitsNames[1]} to support this innovation`
            );
            break;
          default:
            this.setRedirectAlertSuccess(`You have suggested these organisation units to support this innovation:`, {
              listStyleType: 'bullet',
              itemsList: this.chosenUnits.unitsNames.map(unitName => {
                return {
                  title: unitName
                };
              })
            });
            break;
        }

        this.handleCancelOrSubmit();
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Confirm' };
        this.setAlertUnknownError();
      }
    });
  }

  handleGoBack() {
    this.resetAlert();
    this.form.markAsUntouched();

    if (this.stepNumber === 1) {
      this.redirectTo(this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovation.id}/support`);
    } else {
      if (this.stepNumber === 3 && this.chosenUnits.unitsNames.length === 0) {
        this.stepNumber = 1;
      } else {
        this.stepNumber--;
      }
    }
    this.handlePageTitle();
  }

  handleCancelOrSubmit() {
    let cancelUrl = this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovation.id}/support`;
    if (this.supportUpdateSideEffect) {
      cancelUrl = `/accessor/innovations/${this.innovation.id}/overview`;
    }
    this.redirectTo(cancelUrl);
  }

  handlePageTitle() {
    if (this.stepNumber === 1) {
      this.setPageTitle(`Suggest an organisation to support ${this.innovation.name}`, { width: '2.thirds' });
    } else if (this.stepNumber === 2) {
      this.setPageTitle(
        `You have selected ${this.chosenUnits.organisation.name} (${this.chosenUnits.organisation.acronym})`,
        { width: '2.thirds' }
      );
    } else {
      this.setPageTitle(`Why are you suggesting this organisation to support?`, { width: '2.thirds' });
    }
  }
}
