import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormEngineHelper } from '../engine/helpers/form-engine.helper';
import { ActivatedRoute } from '@angular/router';
import { EvidenceDraftService } from '@modules/stores/ctx/evidence/evidenceDraft.store';
import { UpsertInnovationDocumentType } from '@modules/shared/services/innovation-documents.service';

@Component({
  selector: 'theme-form-supporting-documents-list-info',
  templateUrl: './supporting-documents-list-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSupportingDocumentListComponent implements OnInit, DoCheck {
  @Input() id?: string;
  @Input() arrayName = '';
  @Input() label?: string;
  @Input() description?: string;
  @Input() pageUniqueField? = true;
  @Input() supportingDocumentsList?: UpsertInnovationDocumentType[] = [];

  hasError = false;
  error: { message: string; params: Record<string, string> } = { message: '', params: {} };

  baseUrl: string;
  innovationId: string;

  // Form controls.
  get parentFieldControl(): AbstractControl | null {
    return this.injector.get(ControlContainer).control;
  }
  get fieldGroupControl(): FormGroup {
    return this.parentFieldControl?.get(this.arrayName) as FormGroup;
  }

  get fieldArrayControl(): FormArray {
    return this.parentFieldControl?.get(this.arrayName) as FormArray;
  }

  get fieldArrayValues(): { id: string; name: string; url: string }[] {
    return this.fieldArrayControl.value as { id: string; name: string; url: string }[];
  }

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
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private evidenceDraftService: EvidenceDraftService
  ) {
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.baseUrl = `/innovator/innovations/${this.innovationId}`;
  }

  ngOnInit(): void {
    const draftDocuments = this.evidenceDraftService.documents();

    if (draftDocuments.length) {
      this.supportingDocumentsList = [
        ...(this.supportingDocumentsList ?? []),
        ...this.evidenceDraftService.documents()
      ];

      this.fieldArrayControl.clear();
      this.supportingDocumentsList.forEach(d => {
        this.fieldArrayControl.push(
          new FormGroup({
            id: new FormControl(''),
            name: new FormControl(d.name),
            size: new FormControl(d.file?.size),
            extension: new FormControl(d.file?.extension),
            url: new FormControl('')
          })
        );
      });
    }
  }

  ngDoCheck(): void {
    this.hasError = this.fieldGroupControl.invalid && (this.fieldGroupControl.touched || this.fieldGroupControl.dirty);
    this.error = this.hasError
      ? FormEngineHelper.getValidationMessage(this.fieldGroupControl.errors)
      : { message: '', params: {} };
    this.cdr.detectChanges();
  }
}
