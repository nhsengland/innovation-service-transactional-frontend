import '@modules/core';
import { of, throwError } from 'rxjs';
import { InnovationSectionEditComponent } from '@modules/feature-modules/innovator/pages/innovation/record/section-edit.component';
import { InnovationDataSharingEditComponent } from '@modules/feature-modules/innovator/pages/innovation/record/data-sharing-edit.component';
import { PageInnovationSectionInfoComponent } from '../pages/innovation/sections/section-info.component';

const error = {
  error: {
    error: 'I.0036',
    details: {
      files: [
        {
          section: 'EVIDENCE_OF_EFFECTIVENESS',
          contextId: 'ev',
          contextName: 'Clinical trial',
          filename: 'results.pdf',
          scanState: 'rejected'
        }
      ]
    }
  }
};
const translations = () => ({ subsections: new Map(), questions: new Map() });

describe('required document submission error handling', () => {
  it.each([InnovationSectionEditComponent, PageInnovationSectionInfoComponent])(
    'shows linked file details when section completion is rejected (%p)',
    componentClass => {
      const component = Object.assign(Object.create(componentClass.prototype), {
        innovation: { id: 'innovation' },
        sectionId: 'EVIDENCE_OF_EFFECTIVENESS',
        allowMarkSectionAsComplete: true,
        sectionSummaryData: { sectionInfo: { id: 'EVIDENCE_OF_EFFECTIVENESS' } },
        shouldDeferChangeModeSave: () => false,
        ctx: {
          innovation: { submitSections$: () => throwError(() => error) },
          schema: { getIrSchemaTranslationsMap: translations }
        },
        setAlertError: jest.fn(),
        setAlertUnknownError: jest.fn()
      });
      component.onSubmitSection();
      expect(component.setAlertError).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          itemsList: [
            expect.objectContaining({
              title: expect.stringContaining('results.pdf'),
              description: expect.stringContaining('Malware detected'),
              callback: expect.stringContaining('/evidences/ev')
            })
          ]
        })
      );
      expect(component.setAlertUnknownError).not.toHaveBeenCalled();
    }
  );
  it('shows final submission details and allows retry', () => {
    const component = Object.assign(Object.create(InnovationDataSharingEditComponent.prototype), {
      innovationId: 'innovation',
      form: { valid: true, value: {} },
      ensureNHSEOrganisationIncluded: jest.fn(),
      innovatorService: { submitOrganisationSharing: () => of({}) },
      ctx: {
        innovation: { submitInnovation$: () => throwError(() => error) },
        schema: { getIrSchemaTranslationsMap: translations }
      },
      setAlertError: jest.fn(),
      redirectTo: jest.fn()
    });
    component.onSubmit();
    expect(component.submitButton).toEqual({ isActive: true, label: 'Confirm submission' });
    expect(component.setAlertError).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        itemsList: [expect.objectContaining({ title: expect.stringContaining('Clinical trial') })]
      })
    );
    expect(component.redirectTo).not.toHaveBeenCalled();
  });
});
