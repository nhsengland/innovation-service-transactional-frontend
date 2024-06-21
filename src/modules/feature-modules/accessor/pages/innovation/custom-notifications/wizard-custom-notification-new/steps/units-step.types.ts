import { Organisation } from './organisations-step.types';

export type Unit = { id: string; name: string };

export type UnitsStepInputType = {
  selectedOrganisationsWithUnits: Organisation[];
  selectedUnits: Unit[];
};

export type UnitsStepOutputType = {
  selectedUnits: Unit[];
};
