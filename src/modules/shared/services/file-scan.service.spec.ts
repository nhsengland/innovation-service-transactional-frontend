import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, PLATFORM_ID } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ApiInInterceptor } from '@modules/core/interceptors/api-in.interceptor';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { AppInjector } from '@modules/core/injectors/app-injector';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { CtxStore } from '@modules/stores';
import { FileScanService } from './file-scan.service';
import { FileScanState, FileScanStatus } from './file-scan.types';

describe('FileScanService production polling', () => {
  let service: FileScanService;
  let http: HttpTestingController;
  let userId: string;
  const url = 'https://unit.test/v1/innovation/files/file/scan-status';
  const status = (scanState: FileScanState): FileScanStatus => ({
    id: 'file',
    scanState,
    canDownload: scanState === 'ready'
  });

  beforeEach(() => {
    userId = 'user-1';
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInInterceptor, multi: true },
        { provide: EnvironmentVariablesStore, useValue: { API_INNOVATIONS_URL: 'https://unit.test' } },
        { provide: TranslateService, useValue: {} },
        { provide: NGXLogger, useValue: {} },
        { provide: CtxStore, useValue: { user: { getUserId: () => userId } } }
      ]
    });
    AppInjector.setInjector(TestBed.inject(Injector));
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FileScanService);
  });

  afterEach(() => http.verify());

  it.each<FileScanState>([
    'ready',
    'legacy_allowed',
    'rejected',
    'delayed',
    'scan_failed',
    'not_scanned',
    'removed',
    'unavailable'
  ])(
    'emits terminal %s once, completes and removes active cache',
    fakeAsync((state: FileScanState) => {
      const stream = service.watch('innovation', 'file');
      const next = jest.fn();
      const complete = jest.fn();
      stream.subscribe({ next, complete });
      tick(0);
      const request = http.expectOne(url);
      expect(request.request.method).toBe('GET');
      request.flush(status(state));
      expect(next).toHaveBeenCalledWith(status(state));
      expect(complete).toHaveBeenCalledTimes(1);
      tick(6000);
      http.expectNone(url);
      expect(service.watch('innovation', 'file')).not.toBe(stream);
    })
  );

  it('polls scanning every three seconds and never overlaps a pending request', fakeAsync(() => {
    const next = jest.fn();
    const subscription = service.watch('innovation', 'file').subscribe(next);
    tick(0);
    const first = http.expectOne(url);
    tick(9000);
    http.expectNone(url);
    first.flush(status('scanning'));
    tick(2999);
    http.expectNone(url);
    tick(1);
    http.expectOne(url).flush(status('ready'));
    expect(next.mock.calls.map(call => call[0].scanState)).toEqual(['scanning', 'ready']);
    expect(subscription.closed).toBe(true);
  }));

  it('shares one request until the final consumer unsubscribes, then cancels it', fakeAsync(() => {
    const stream = service.watch('innovation', 'file');
    expect(service.watch('innovation', 'file')).toBe(stream);
    const a = stream.subscribe();
    const b = stream.subscribe();
    tick(0);
    const request = http.expectOne(url);
    a.unsubscribe();
    expect(request.cancelled).toBe(false);
    b.unsubscribe();
    expect(request.cancelled).toBe(true);
    expect(service.watch('innovation', 'file')).not.toBe(stream);
    tick(6000);
    http.expectNone(url);
  }));

  it('emits delayed at five minutes and cancels an in-flight HTTP request', fakeAsync(() => {
    const next = jest.fn();
    const complete = jest.fn();
    service.watch('innovation', 'file').subscribe({ next, complete });
    tick(0);
    const request = http.expectOne(url);
    tick(299999);
    expect(next).not.toHaveBeenCalled();
    tick(1);
    expect(next).toHaveBeenCalledWith(status('delayed'));
    expect(request.cancelled).toBe(true);
    expect(complete).toHaveBeenCalledTimes(1);
  }));

  it.each([401, 403, 404, 500])(
    'turns HTTP %s into a completed unavailable status',
    fakeAsync((code: number) => {
      const next = jest.fn();
      const complete = jest.fn();
      service.watch('innovation', 'file').subscribe({ next, complete });
      tick(0);
      http.expectOne(url).flush({}, { status: code, statusText: 'Test error' });
      expect(next).toHaveBeenCalledWith({ ...status('unavailable'), statusCheckFailed: true });
      expect(complete).toHaveBeenCalledTimes(1);
      tick(6000);
      http.expectNone(url);
    })
  );

  it('keeps the existing retry for ordinary unauthorized API requests', () => {
    const next = jest.fn();
    TestBed.inject(HttpClient).get('/ordinary-api').subscribe(next);
    http.expectOne('/ordinary-api').flush({}, { status: 401, statusText: 'Unauthorized' });
    http.expectOne('/ordinary-api').flush({ retried: true });
    expect(next).toHaveBeenCalledWith({ retried: true });
  });

  it('stops old-user polling on the next tick and separates new-user subscriptions', fakeAsync(() => {
    const old = service.watch('innovation', 'file');
    const next = jest.fn();
    const subscription = old.subscribe(next);
    tick(0);
    http.expectOne(url).flush(status('scanning'));
    userId = 'user-2';
    expect(service.watch('innovation', 'file')).not.toBe(old);
    tick(3000);
    expect(next).toHaveBeenLastCalledWith(status('unavailable'));
    expect(subscription.closed).toBe(true);
    http.expectNone(url);
  }));

  it('blocks an in-flight ready response arriving after the user changes', fakeAsync(() => {
    const next = jest.fn();
    service.watch('innovation', 'file').subscribe(next);
    tick(0);
    const request = http.expectOne(url);
    userId = 'user-2';
    request.flush({ ...status('ready'), url: 'https://unit.test/old-user-download' });
    expect(next).toHaveBeenCalledWith(status('unavailable'));
    expect(next).not.toHaveBeenCalledWith(expect.objectContaining({ canDownload: true }));
  }));
});
