import '@modules/core';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerService } from '@modules/core/services/logger.service';
import { FormFileUploadComponent } from './file-upload.component';

describe('upload field security-status preview', () => {
  let fixture: ComponentFixture<FormFileUploadComponent>;
  const file = { id: 'upload-storage-id', name: 'report.csv', extension: 'csv' };

  function render(url?: string): void {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [FormFileUploadComponent],
      providers: [
        { provide: LoggerService, useValue: {} },
        {
          provide: ControlContainer,
          useValue: {
            control: new FormGroup({
              attachment: new FormGroup({
                id: new FormControl(file.id),
                name: new FormControl(file.name),
                extension: new FormControl(file.extension),
                url: new FormControl(url)
              })
            })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(FormFileUploadComponent);
    fixture.componentRef.setInput('groupName', 'attachment');
    fixture.detectChanges();
  }

  afterEach(() => fixture?.destroy());

  it.each([undefined, ''])('explains that the result needs saving when the upload URL is %s', url => {
    render(url);
    expect(fixture.nativeElement.textContent).toContain(file.name);
    expect(fixture.nativeElement.textContent).toContain(
      'File uploaded. You can check its security status after saving.'
    );
    expect(fixture.nativeElement.querySelector('shared-file-download')).toBeNull();
  });

  it('preserves the existing download component when a URL is available', () => {
    render('https://example.test/file');
    expect(fixture.nativeElement.querySelector('shared-file-download')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Save your changes');
  });
});
