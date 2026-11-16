import { Component, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { CtxStore } from '@modules/stores';
import { FileScanService } from '@modules/shared/services/file-scan.service';
import { FileScanState, FileScanStatus } from '@modules/shared/services/file-scan.types';
import { FileDownloadComponent } from './file-download.component';

@Component({
  standalone: true,
  imports: [CommonModule, FileDownloadComponent],
  template: `<table>
    <tbody>
      <tr>
        <td>
          <shared-file-download
            #download
            [file]="file"
            fileId="database-file-id"
            fileName="report.pdf"
            [separateActions]="true"
          />
        </td>
        <td><ng-container *ngTemplateOutlet="download.actionsTemplate"></ng-container></td>
      </tr>
    </tbody>
  </table>`
})
class SeparateActionsHostComponent {
  file: FileScanStatus = { id: 'database-file-id', scanState: 'scanning', canDownload: false };
}

describe('FileDownloadComponent production DOM gating', () => {
  let fixture: ComponentFixture<FileDownloadComponent>;
  let component: FileDownloadComponent;
  let result: Subject<FileScanStatus>;
  let watch: jest.Mock;

  beforeEach(() => {
    result = new Subject<FileScanStatus>();
    watch = jest.fn(() => result.asObservable());
    TestBed.configureTestingModule({
      imports: [FileDownloadComponent, SeparateActionsHostComponent],
      providers: [
        { provide: FileScanService, useValue: { watch } },
        { provide: CtxStore, useValue: { innovation: { info: () => ({ id: 'context-innovation' }) } } },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
  });

  function create(state?: FileScanState, canDownload = false, url?: string): void {
    fixture = TestBed.createComponent(FileDownloadComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fileId', 'database-file-id');
    fixture.componentRef.setInput('fileName', 'report.pdf');
    fixture.componentRef.setInput('file', { scanState: state, canDownload, url });
    fixture.detectChanges();
  }

  afterEach(() => fixture?.destroy());

  it('groups status above actions by default, with an explicit inline opt-out', () => {
    create('ready', true, 'https://unit.test/file');
    expect(fixture.nativeElement.classList.contains('file-scan-stacked')).toBe(true);
    fixture.componentRef.setInput('stacked', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('file-scan-stacked')).toBe(false);
    expect(fixture.nativeElement.querySelector('a')).toBeTruthy();
  });

  it('keeps live status and actions in separate cells with one polling subscription', () => {
    const host = TestBed.createComponent(SeparateActionsHostComponent);
    try {
      host.detectChanges();
      const cells = host.nativeElement.querySelectorAll('td');
      expect(watch).toHaveBeenCalledTimes(1);
      expect(result.observers).toHaveLength(1);
      expect(cells[0].querySelector('[role="status"]')).toBeTruthy();
      expect(cells[1].querySelector('[role="status"]')).toBeNull();
      result.next({ id: 'database-file-id', scanState: 'ready', canDownload: true, url: 'https://unit.test/file' });
      host.detectChanges();
      expect(cells[0].querySelector('a')).toBeNull();
      expect(cells[1].querySelector('a')?.getAttribute('href')).toBe('https://unit.test/file');
      host.componentInstance.file = { id: 'database-file-id', scanState: 'unavailable', canDownload: false };
      host.detectChanges();
      expect(cells[0].querySelector('button')).toBeNull();
      cells[1].querySelector('button').click();
      host.detectChanges();
      expect(watch).toHaveBeenCalledTimes(2);
      expect(cells[0].querySelector('.file-scan-spinner')).toBeTruthy();
    } finally {
      host.destroy();
    }
  });

  it.each<FileScanState>(['ready', 'removed', 'rejected', 'delayed'])(
    'places the filename before status when the filename is the label (%s)',
    state => {
      create(state, state === 'ready', state === 'ready' ? 'https://unit.test/file' : undefined);
      fixture.componentRef.setInput('label', 'report.pdf');
      fixture.detectChanges();
      const text = fixture.nativeElement.textContent;
      expect(text.indexOf('report.pdf')).toBeLessThan(text.indexOf(component.message));
    }
  );

  it('shows a visible Ready badge alongside the download action', () => {
    create('ready', true, 'https://unit.test/file');
    const badge = fixture.nativeElement.querySelector('.nhsuk-tag--green');
    expect(badge?.textContent.trim()).toBe('Ready');
    expect(badge?.classList.contains('nhsuk-u-visually-hidden')).toBe(false);
  });

  it('shows a decorative spinner only while scanning and retains a named live status', () => {
    create('scanning');
    expect(fixture.nativeElement.querySelector('.file-scan-spinner')?.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.nativeElement.querySelector('[role="status"]').getAttribute('aria-label')).toContain('report.pdf');
    result.next({ id: 'database-file-id', scanState: 'removed', canDownload: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.file-scan-spinner')).toBeNull();
    expect(fixture.nativeElement.querySelector('.nhsuk-tag--grey')?.textContent.trim()).toBe('File removed');
  });

  it.each<FileScanState>(['legacy_allowed', 'rejected', 'delayed', 'scan_failed', 'not_scanned', 'unavailable'])(
    'renders a visible text badge for %s',
    state => {
      create(state);
      expect(fixture.nativeElement.querySelector('.nhsuk-tag')?.textContent.trim()).toBe(component.message);
    }
  );

  it.each<FileScanState>(['scanning', 'rejected', 'delayed', 'scan_failed', 'not_scanned', 'removed', 'unavailable'])(
    'never renders an anchor for %s, even with a URL and download flag',
    state => {
      create(state, true, 'https://unit.test/file');
      expect(fixture.nativeElement.querySelector('a')).toBeNull();
    }
  );

  it.each<FileScanState>(['ready', 'legacy_allowed'])('requires both URL and explicit permission for %s', state => {
    create(state, true);
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    component.status = { scanState: state, url: 'https://unit.test/file', canDownload: false };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    component.status.canDownload = true;
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor.getAttribute('href')).toBe('https://unit.test/file');
    expect(anchor.getAttribute('aria-label')).toBe('Download report.pdf');
  });

  it('replaces blocked status with an anchor only after a ready response', () => {
    create('scanning');
    expect(watch).toHaveBeenCalledWith('context-innovation', 'database-file-id');
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Scanning');
    result.next({ id: 'database-file-id', scanState: 'ready', canDownload: true, url: 'https://unit.test/ready' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('https://unit.test/ready');
    expect(fixture.nativeElement.querySelector('[aria-live="polite"]')).toBeTruthy();
  });

  it('shows File removed and no download or retry even with stale download permission', () => {
    create('removed', true, 'https://unit.test/stale');
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('File removed');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    expect(watch).not.toHaveBeenCalled();
  });

  it('updates a polling file to removed and stops offering controls', () => {
    create('scanning');
    result.next({ id: 'database-file-id', scanState: 'removed', canDownload: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('File removed');
    expect(fixture.nativeElement.querySelector('a, button')).toBeNull();
  });

  it('retries failed checks through the real rendered button and removes stale links', () => {
    create('unavailable');
    expect(watch).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(watch).toHaveBeenCalledTimes(1);
    expect(component.status.scanState).toBe('scanning');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    result.next({ id: 'database-file-id', scanState: 'unavailable', canDownload: false, statusCheckFailed: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Unable to check file status');
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('does not offer retry while scanning or after rejection', () => {
    create('scanning');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    result.next({ id: 'database-file-id', scanState: 'rejected', canDownload: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('unsubscribes on input changes, pagehide and destruction', () => {
    create('scanning');
    expect(result.observers.length).toBe(1);
    fixture.componentRef.setInput('fileId', 'another-database-id');
    fixture.detectChanges();
    expect(result.observers.length).toBe(1);
    expect(watch).toHaveBeenLastCalledWith('context-innovation', 'another-database-id');
    window.dispatchEvent(new Event('pagehide'));
    expect(result.observers.length).toBe(0);
    component.retry();
    expect(result.observers.length).toBe(1);
    fixture.destroy();
    expect(result.observers.length).toBe(0);
  });

  it('never polls on server rendering', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    create('scanning');
    expect(watch).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });

  it('does not poll without a persisted file ID', () => {
    create('ready', true, 'https://unit.test/file');
    fixture.componentRef.setInput('fileId', undefined);
    fixture.componentRef.setInput('file', { scanState: 'scanning', canDownload: false });
    fixture.detectChanges();
    expect(watch).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });
});
