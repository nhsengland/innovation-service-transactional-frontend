import { catalogAreas, catalogCarbonReductionPlan, catalogCareSettings, catalogCategory, catalogEvidenceType, catalogCostComparison, catalogEvidenceSubmitType, catalogHasCostKnowledge, catalogHasPatents, catalogHasRegulationKnowledge, catalogIntendedUserGroupsEngaged, catalogInvolvedAACProgrammes, catalogKeyHealthInequalities, catalogMainPurpose, catalogNeedsSupportAnyArea, catalogOptionBestDescribesInnovation, catalogPathwayKnowledge, catalogPatientRange, catalogRevenues, catalogStandardsType, catalogYesInProgressNotYet, catalogYesNo, catalogYesNoNotRelevant, catalogYesNoNotSure, catalogYesNotYet, catalogYesNotYetNo, catalogHasRevenueModel } from './catalog.types';

export type DocumentType202304 = {
  version: '202304';
  INNOVATION_DESCRIPTION: {
    name: string,
    description?: string,
    postcode?: string,
    countryName?: string,
    website?: string, // New field.
    categories?: catalogCategory[], // Items list changed.
    otherCategoryDescription?: string,
    mainCategory?: catalogCategory,
    areas?: catalogAreas[], // Items list changed.
    careSettings?: catalogCareSettings[], // Items list changed.
    otherCareSetting?: string,
    mainPurpose?: catalogMainPurpose, // Items list changed.
    supportDescription?: string, // Renamed from "moreSupportDescription" field.
    currentlyReceivingSupport?: string, // New field.
    involvedAACProgrammes?: catalogInvolvedAACProgrammes[] // New field.
  },
  UNDERSTANDING_OF_NEEDS: {
    problemsTackled?: string, // Moved from section VALUE_PROPOSITION
    howInnovationWork?: string, // New field.
    benefitsOrImpact?: string[], // New field.
    impactDiseaseCondition?: catalogYesNo, // New field.
    diseasesConditionsImpact?: string[],
    estimatedCarbonReductionSavings?: catalogYesNotYetNo, // New field.
    estimatedCarbonReductionSavingsDescription?: string, // New field.
    carbonReductionPlan?: catalogCarbonReductionPlan, // New field.
    keyHealthInequalities?: catalogKeyHealthInequalities[], // New field.
    completedHealthInequalitiesImpactAssessment?: catalogYesNo // New field.
  },
  EVIDENCE_OF_EFFECTIVENESS: {
    hasEvidence?: catalogYesNotYet,
    currentlyCollectingEvidence?: catalogYesNo,
    summaryOngoingEvidenceGathering?: string,
    needsSupportAnyArea?: catalogNeedsSupportAnyArea[]
  },
  MARKET_RESEARCH: {
    hasMarketResearch?: catalogYesInProgressNotYet,
    marketResearch?: string,
    optionBestDescribesInnovation?: catalogOptionBestDescribesInnovation, // New field.
    whatCompetitorsAlternativesExist?: string // New field.
  },
  CURRENT_CARE_PATHWAY: {
    innovationPathwayKnowledge?: catalogPathwayKnowledge, // Moved from section 5.1 and items list changed.
    potentialPathway?: string // Moved from section 5.1.
  },
  TESTING_WITH_USERS: {
    involvedUsersDesignProcess?: catalogYesInProgressNotYet, // New field.
    testedWithIntendedUsers?: string, // Renamed from section 5.2, "hasTests" field.
    intendedUserGroupsEngaged?: catalogIntendedUserGroupsEngaged[],
    otherIntendedUserGroupsEngaged?: string
    userTests?: { // Moved from section 5.2.
      kind: string,
      feedback?: string
    }[]
  },
  REGULATIONS_AND_STANDARDS: {
    hasRegulationKnowledge?: catalogHasRegulationKnowledge,
    standards?: {
      type: catalogStandardsType,
      hasMet?: catalogYesInProgressNotYet
    }[],
    otherRegulationDescription?: string
  },
  INTELLECTUAL_PROPERTY: {
    hasPatents?: catalogHasPatents,
    patentNumbers?: string, // New field.
    hasOtherIntellectual?: catalogYesNo,
    otherIntellectual?: string
  },
  REVENUE_MODEL: {
    hasRevenueModel?: catalogHasRevenueModel,
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
    eligibilityCriteria?: string,
    sellExpectations?: string,
    usageExpectations?: string,
    costComparison?: catalogCostComparison // Moved from COMPARATIVE_COST_BENEFIT section.
  },
  DEPLOYMENT: { // Renamed from IMPLEMENTATION_PLAN section.
    hasDeployPlan?: catalogYesNo,
    isDeployed?: catalogYesNo,
    deploymentPlans?: string[],
    commercialBasis?: string, // New field.
    organisationDeploymentAffect?: string // New field.
    hasResourcesToScale?: catalogYesNoNotSure
  },
  evidences?: {
    id: string,
    evidenceSubmitType: catalogEvidenceSubmitType, // Similar to previous "evidenceType", but with a new list of options.
    evidenceType?: catalogEvidenceType, // Previous clinicalEvidenteType field.
    description?: string,
    summary: string
  }[]
};
