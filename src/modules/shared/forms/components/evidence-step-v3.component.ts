import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  OnInit,
  DoCheck,
  ViewEncapsulation,
  Injector,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorComponent } from '../base/control-value-accessor.connector';
import { ActivatedRoute } from '@angular/router';
import { CtxStore } from '@modules/stores';
import { EvidenceV3Type } from '../engine/models/wizard-engine-irv3-schema.model';
import { FormEngineHelperV3 } from '../engine/helpers/form-engine-v3.helper';

export type EvidenceDTOType = {
  id: string;
  name: string;
  summary: string;
};

@Component({
  selector: 'theme-add-evidences-step',
  templateUrl: 'evidence-step-v3.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEvidencesStepComponent)
    }
  ]
})
export class AddEvidencesStepComponent extends ControlValueAccessorComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField = true;
  @Input() evidencesList: EvidenceDTOType[] = [];

  innovationId: string;
  baseUrl: string;

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

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

  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.baseUrl = `/innovator/innovations/${this.innovationId}/record/sections/EVIDENCE_OF_EFFECTIVENESS`;
  }

  ngOnInit(): void {
    console.log('id:', this.id);
    console.log('innovationId', this.innovationId);
    console.log('this.evidencesList', this.evidencesList);

  }

  ngDoCheck(): void {
    this.hasError = this.fieldControl.invalid && (this.fieldControl.touched || this.fieldControl.dirty);
    this.error = this.hasError
      ? FormEngineHelperV3.getValidationMessage(this.fieldControl.errors)
      : { message: '', params: {} };

    //   this.items
    //     ?.filter(item => item.conditional)
    //     .forEach(item => {
    //       if (item.conditional) {
    //         if (!item.conditional.isHidden && this.isConditionalFieldVisible(item.conditional.id)) {
    //           this.conditionalFormControl(item.conditional.id).setValidators(
    //             FormEngineHelperV3.getParameterValidators(item.conditional)
    //           );
    //         } else {
    //           this.conditionalFormControl(item.conditional.id).setValidators(null);
    //           this.conditionalFormControl(item.conditional.id).reset();
    //         }
    //         this.conditionalFormControl(item.conditional.id).updateValueAndValidity();
    //       }
    //     });

    this.cdr.detectChanges();
  }
}
