import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent } from './summary-step.component';

describe('unsaved progress-update document preview', () => {
  let fixture: ComponentFixture<WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        LoggerTestingModule,
        TranslateModule.forRoot(),
        CoreModule,
        StoresModule
      ],
      declarations: [WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    AppInjector.setInjector(TestBed.inject(Injector));
    fixture = TestBed.createComponent(WizardInnovationSupportSummaryProgressUpdateSummaryStepComponent);
    jest.spyOn(fixture.componentInstance, 'ngOnInit').mockImplementation();
  });

  afterEach(() => fixture.destroy());

  it.each([undefined, ''])('shows the save-first explanation for an upload without a download URL (%s)', url => {
    fixture.componentInstance.data.documentFileStep.documentFile = {
      id: 'upload-storage-id',
      name: 'report.csv',
      extension: 'csv',
      url
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('report.csv');
    expect(fixture.nativeElement.textContent).toContain(
      'File uploaded. You can check its security status after saving.'
    );
    expect(fixture.nativeElement.querySelector('shared-file-download')).toBeNull();
  });

  it('keeps the existing download component when a download URL exists', () => {
    fixture.componentInstance.data.documentFileStep.documentFile = {
      id: 'upload-storage-id',
      name: 'report.csv',
      extension: 'csv',
      url: 'https://example.test/file'
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('shared-file-download')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('security status after saving');
  });

  it('hides the document preview when no file was attached', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Uploaded document');
    expect(fixture.nativeElement.textContent).not.toContain('security status after saving');
  });
});
