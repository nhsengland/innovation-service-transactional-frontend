import { Injectable, signal, computed } from '@angular/core';

import { UpsertInnovationDocumentType } from "@modules/shared/services/innovation-documents.service";
import { GetInnovationEvidenceDTO } from "../innovation/innovation.models";

export type EvidenceDraftType = {
  evidence: Partial<GetInnovationEvidenceDTO>;
  documents: UpsertInnovationDocumentType[];
  createdAt: number;
};


@Injectable({ providedIn: 'root' })
export class EvidenceDraftService {
  // ---- STATE ----
  private readonly _draft = signal<EvidenceDraftType | null>(null);

  // ---- SELECTORS (computed) ----
  readonly draft = computed(() => this._draft());

  readonly evidence = computed(() => this._draft()?.evidence ?? null);

  readonly documents = computed(() => this._draft()?.documents ?? []);

  readonly isEmpty = computed(() => !this._draft());

  initDraft(initial?: Partial<GetInnovationEvidenceDTO>) {
    this._draft.set({
      evidence: initial ?? {},
      documents: [],
      createdAt: Date.now()
    });
  }

  updateEvidence(partial: Partial<GetInnovationEvidenceDTO>) {
    console.log('partial', partial)
    this._draft.update(d => ({
      ...d!,
      evidence: partial
    }));
  }

  addDocument(doc: UpsertInnovationDocumentType) {
    this._draft.update(d => ({
      ...d!,
      documents: [...d!.documents, doc]
    }));
  }

  removeDocument(index: number) {
    this._draft.update(d => ({
      ...d!,
      documents: d!.documents.filter((_, i) => i !== index)
    }));
  }

  clearDraft() {
    this._draft.set(null);
  }

  updateAllDocumentContexts(evidenceId: string) {
  this._draft.update(d => ({
    ...d!,
    documents: d!.documents.map(doc => ({
      ...doc,
      context: {
        ...doc.context,
        id: evidenceId
      }
    }))
  }));
}
}