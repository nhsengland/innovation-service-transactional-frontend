import { catalogAreas, catalogCarePathway, catalogCareSettings, catalogCategory, catalogClinicalEvidence, catalogCostComparison, catalogEnvironmentalBenefit, catalogEvidenceType, catalogGeneralBenefit, catalogHasCostKnowledge, catalogHasPatents, catalogHasRegulationKnowledge, catalogIntendedUserGroupsEngaged, cataloginvolvedAACProgrammes, catalogMainPurpose, catalogOptionBestDescribesInnovation, catalogPathwayKnowledge, catalogPatientRange, catalogPatientsCitizensBenefit, catalogRevenues, catalogStandardsType, catalogYesInProgressNotYet, catalogYesNo, catalogYesNoNotRelevant, catalogYesNoNotSure, catalogYesNotYetNotSure } from './catalog.types';

export type DocumentType202304 = {
  version: '202304';
  INNOVATION_DESCRIPTION: {
    name: string,
    description?: string,
    postcode?: string,
    countryName?: string,
    website?: string, // New field.
    hasFinalProduct?: catalogYesNo,
    categories?: catalogCategory[], // Items list changed.
    otherCategoryDescription?: string,
    mainCategory?: catalogCategory, // Items list changed.
    otherMainCategoryDescription?: string,
    areas?: catalogAreas[], // Items list changed.
    careSettings?: catalogCareSettings[], // Items list changed.
    otherCareSetting?: string,
    mainPurpose?: catalogMainPurpose, // Items list changed.
    supportDescription?: string, // Renamed from "moreSupportDescription" field.
    currentlyReceivingSupport?: string, // New field.
    involvedAACProgrammes?: cataloginvolvedAACProgrammes[] // New field.
  },
  // VALUE_PROPOSITION: {
  //   hasProblemTackleKnowledge?: catalogYesNotYetNotSure,
  //   problemsTackled?: string,
  //   problemsConsequences?: string,
  //   intervention?: string,
  //   interventionImpact?: string
  // },
  // UNDERSTANDING_OF_NEEDS: {
  //   impactPatients?: boolean,
  //   impactClinicians?: boolean,
  //   subgroups: string[],
  //   cliniciansImpactDetails?: string,
  //   diseasesConditionsImpact?: string[]
  // },
  // UNDERSTANDING_OF_BENEFITS: {
  //   hasBenefits?: catalogYesNotYetNotSure,
  //   patientsCitizensBenefits?: catalogPatientsCitizensBenefit[],
  //   generalBenefits?: catalogGeneralBenefit[],
  //   otherGeneralBenefit?: string,
  //   environmentalBenefits?: catalogEnvironmentalBenefit[],
  //   otherEnvironmentalBenefit?: string,
  //   accessibilityImpactDetails?: string,
  //   accessibilityStepsDetails?: string,
  // },
  // EVIDENCE_OF_EFFECTIVENESS: {
  //   hasEvidence?: catalogYesInProgressNotYet;
  //   evidences?: {
  //     evidenceType: catalogEvidenceType,
  //     clinicalEvidenceType?: catalogClinicalEvidence,
  //     description?: string,
  //     summary?: string,
  //     files?: string[]
  //   }[]
  // },
  MARKET_RESEARCH: {
    hasMarketResearch?: catalogYesInProgressNotYet,
    marketResearch?: string,
    optionBestDescribesInnovation?: catalogOptionBestDescribesInnovation, // New field.
    whatCompetitorsAlternativesExist?: string // New field.
  },
  CURRENT_CARE_PATHWAY: {
    // hasUKPathwayKnowledge?: catalogYesNoNotRelevant,
    innovationPathwayKnowledge?: catalogPathwayKnowledge, // Moved from section 5.1 and items list changed.
    potentialPathway?: string, // Moved from section 5.1.
    // carePathway?: catalogCarePathway
  },
  TESTING_WITH_USERS: {
    involvedUsersDesignProcess?: catalogYesInProgressNotYet,
    testedWithIntendedUsers?: string, // Renamed from section 5.2, "hasTests" field.
    intendedUserGroupsEngaged?: catalogIntendedUserGroupsEngaged[],
    otherIntendedUserGroupsEngaged?: string
    userTests?: { // Moved from section 5.2.
      kind: string,
      feedback?: string
    }[],
    files?: string[] // Moved from section 5.2.
  },
  REGULATIONS_AND_STANDARDS: {
    hasRegulationKnowledge?: catalogHasRegulationKnowledge,
    standards?: {
      type: catalogStandardsType,
      hasMet?: catalogYesInProgressNotYet
    }[],
    otherRegulationDescription?: string,
    files?: string[]
  },
  INTELLECTUAL_PROPERTY: {
    hasPatents?: catalogHasPatents,
    hasOtherIntellectual?: catalogYesNo,
    otherIntellectual?: string
  },
  REVENUE_MODEL: {
    hasRevenueModel?: catalogYesNo,
    revenues?: catalogRevenues[],
    otherRevenueDescription?: string,
    payingOrganisations?: string,
    benefittingOrganisations?: string,
    hasFunding?: catalogYesNoNotRelevant,
    fundingDescription?: string
  },





  

  COST_OF_INNOVATION: {
    hasCostKnowledge?: catalogHasCostKnowledge,
    costDescription?: string,
    patientsRange?: catalogPatientRange,
    sellExpectations?: string,
    usageExpectations?: string
  },
  COMPARATIVE_COST_BENEFIT: {
    hasCostSavingKnowledge?: catalogHasCostKnowledge,
    hasCostCareKnowledge?: catalogHasCostKnowledge,
    costComparison?: catalogCostComparison
  },

  IMPLEMENTATION_PLAN: {
    hasDeployPlan?: catalogYesNo,
    isDeployed?: catalogYesNo,
    deploymentPlans?: {
      name: string,
      commercialBasis: string,
      orgDeploymentAffect: string
    }[],
    hasResourcesToScale?: catalogYesNoNotSure,
    files?: string[]
  }
};
