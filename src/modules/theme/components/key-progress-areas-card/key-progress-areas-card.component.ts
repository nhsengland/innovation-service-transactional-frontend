import { Component, Input } from '@angular/core';
import { PluralTranslatePipe } from '@modules/shared/pipes/plural-translate.pipe';
import { TranslateService } from '@ngx-translate/core';

export type KeyProgressAreasPayloadType = Partial<{
  innovationId: string;
  deploymentCount: number;
  ukcaceCertification: 'YES';
  dtacCertification: 'YES';
  evidenceClinicalOrCare: 'YES';
  evidenceRealWorld: 'YES';
  assessmentRealWorldValidation: 'YES' | 'PARTIALLY';
  evidenceOfImpact: 'YES';
  assessmentEvidenceProveEfficacy: 'YES' | 'PARTIALLY';
  evidenceCostImpact: 'YES';
  workingProduct: 'YES';
  carbonReductionPlan: 'YES';
  htwTerComplete: 'YES';
  niceGuidanceComplete: 'YES';
  scProcurementRouteIdentified: 'YES';
}>;

@Component({
  selector: 'app-key-progress-areas-card',
  templateUrl: './key-progress-areas-card.component.html'
})
export class KeyProgressAreasCardComponent {
  @Input() progressData: KeyProgressAreasPayloadType = {};
  constructor() {}

  progressItems = Object.entries(this.progressData);

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  unsortedKv() {
    return 0;
  }
}
