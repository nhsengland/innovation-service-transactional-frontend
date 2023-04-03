import { catalogAreas, catalogCarePathway, catalogCareSettings, catalogCategory, catalogClinicalEvidence, catalogCostComparison, catalogEnvironmentalBenefit, catalogEvidenceType, catalogGeneralBenefit, catalogHasCostKnowledge, catalogHasPatents, catalogHasRegulationKnowledge, cataloginvolvedAACProgrammes, catalogMainPurpose, catalogPathwayKnowledge, catalogPatientRange, catalogPatientsCitizensBenefit, catalogRevenues, catalogStandardsType, catalogYesInProgressNotYet, catalogYesNo, catalogYesNoNotRelevant, catalogYesNoNotSure, catalogYesNotYetNotSure } from './catalog.types';

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
  VALUE_PROPOSITION: {
    hasProblemTackleKnowledge?: catalogYesNotYetNotSure,
    problemsTackled?: string,
    problemsConsequences?: string,
    intervention?: string,
    interventionImpact?: string
  },
  UNDERSTANDING_OF_NEEDS: {
    impactPatients?: boolean,
    impactClinicians?: boolean,
    subgroups: string[],
    cliniciansImpactDetails?: string,
    diseasesConditionsImpact?: string[]
  },
  UNDERSTANDING_OF_BENEFITS: {
    hasBenefits?: catalogYesNotYetNotSure,
    patientsCitizensBenefits?: catalogPatientsCitizensBenefit[],
    generalBenefits?: catalogGeneralBenefit[],
    otherGeneralBenefit?: string,
    environmentalBenefits?: catalogEnvironmentalBenefit[],
    otherEnvironmentalBenefit?: string,
    accessibilityImpactDetails?: string,
    accessibilityStepsDetails?: string,
  },
  EVIDENCE_OF_EFFECTIVENESS: {
    hasEvidence?: catalogYesInProgressNotYet;
    evidences?: {
      evidenceType: catalogEvidenceType,
      clinicalEvidenceType?: catalogClinicalEvidence,
      description?: string,
      summary?: string,
      files?: string[]
    }[]
  },
  MARKET_RESEARCH: {
    hasMarketResearch?: catalogYesInProgressNotYet;
    marketResearch?: string
  },
  INTELLECTUAL_PROPERTY: {
    hasPatents?: catalogHasPatents,
    hasOtherIntellectual?: catalogYesNo,
    otherIntellectual?: string
  },
  REGULATIONS_AND_STANDARDS: {
    hasRegulationKnowledge?: catalogHasRegulationKnowledge,
    otherRegulationDescription?: string,
    standards?: {
      type: catalogStandardsType,
      hasMet?: catalogYesInProgressNotYet
    }[],
    files?: string[]
  },
  CURRENT_CARE_PATHWAY: {
    hasUKPathwayKnowledge?: catalogYesNoNotRelevant,
    innovationPathwayKnowledge?: catalogPathwayKnowledge,
    potentialPathway?: string,
    carePathway?: catalogCarePathway
  },
  TESTING_WITH_USERS: {
    hasTests: catalogYesInProgressNotYet,
    userTests: {
      kind: string,
      feedback?: string
    }[],
    files?: string[]
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
  REVENUE_MODEL: {
    hasRevenueModel?: catalogYesNo,
    revenues?: catalogRevenues[],
    otherRevenueDescription?: string,
    payingOrganisations?: string,
    benefittingOrganisations?: string,
    hasFunding?: catalogYesNoNotRelevant,
    fundingDescription?: string
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
