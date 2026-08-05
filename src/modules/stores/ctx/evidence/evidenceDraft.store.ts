import { Injectable, signal, computed } from '@angular/core';

import { UpsertInnovationDocumentType } from '@modules/shared/services/innovation-documents.service';
import { GetInnovationEvidenceDTO } from '../innovation/innovation.models';

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

  private emptyDraft(): EvidenceDraftType {
    return {
      evidence: {},
      documents: [],
      createdAt: Date.now()
    };
  }

  initDraft(initial?: Partial<GetInnovationEvidenceDTO>) {
    this._draft.set({
      evidence: initial ?? {},
      documents: [],
      createdAt: Date.now()
    });
  }

  updateEvidenceId(evidenceId?: string) {
    this._draft.update(d =>
      d
        ? {
            ...d,
            evidenceId
          }
        : null
    );
  }

  updateEvidence(partial: Partial<GetInnovationEvidenceDTO>) {
    const draft = this._draft() ?? this.emptyDraft();

    this._draft.update(d => ({
      ...(d ?? draft),
      evidence: partial
    }));
  }

  addDocument(doc: UpsertInnovationDocumentType) {
    const draft = this._draft() ?? this.emptyDraft();

    this._draft.update(d => ({
      ...(d ?? draft),
      documents: [...(d ?? draft).documents, doc]
    }));
  }

  removeDocument(index: number) {
    this._draft.update(d =>
      d
        ? {
            ...d,
            documents: d.documents.filter((_, i) => i !== index)
          }
        : null
    );
  }

  clearDraft() {
    this._draft.set(null);
  }

  clearDocuments() {
    this._draft.update(d =>
      d
        ? {
            ...d,
            documents: []
          }
        : null
    );
  }

  updateAllDocumentContexts(evidenceId: string) {
    this._draft.update(d =>
      d
        ? {
            ...d,
            documents: d.documents.map(doc => ({
              ...doc,
              context: {
                ...doc.context,
                id: evidenceId
              }
            }))
          }
        : null
    );
  }
}
