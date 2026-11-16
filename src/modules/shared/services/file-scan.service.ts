import { HttpContext } from '@angular/common/http';
import { SKIP_UNAUTHORIZED_RECOVERY } from '@modules/core/interceptors/http-context-tokens';
import { Injectable } from '@angular/core';
import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import {
  Observable,
  catchError,
  defer,
  exhaustMap,
  finalize,
  map,
  merge,
  of,
  shareReplay,
  take,
  takeWhile,
  timer
} from 'rxjs';
import { FileScanStatus } from './file-scan.types';

@Injectable({ providedIn: 'root' })
export class FileScanService extends CoreService {
  private readonly active = new Map<string, Observable<FileScanStatus>>();

  watch(innovationId: string, fileId: string): Observable<FileScanStatus> {
    const userId = this.ctx.user.getUserId();
    const key = `${userId}/${innovationId}/${fileId}`;
    const existing = this.active.get(key);
    if (existing) return existing;

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/files/:fileId/scan-status')
      .setPathParams({ innovationId, fileId })
      .buildUrl();

    const stream = defer(() =>
      merge(
        timer(0, 3_000).pipe(
          exhaustMap(() =>
            this.ctx.user.getUserId() === userId
              ? this.http
                  .get<FileScanStatus>(url, { context: new HttpContext().set(SKIP_UNAUTHORIZED_RECOVERY, true) })
                  .pipe(take(1))
              : of<FileScanStatus>({ id: fileId, scanState: 'unavailable', canDownload: false })
          )
        ),
        timer(300_000).pipe(map((): FileScanStatus => ({ id: fileId, scanState: 'delayed', canDownload: false })))
      )
    ).pipe(
      // An account can change while HTTP is in flight. Discard its URL
      // and stop polling before any response reaches the new session.
      map(status =>
        this.ctx.user.getUserId() === userId
          ? status
          : ({ id: fileId, scanState: 'unavailable', canDownload: false } as FileScanStatus)
      ),
      // Include the final response, then stop and cancel any in-flight request.
      takeWhile(status => status.scanState === 'scanning', true),
      catchError(() =>
        of<FileScanStatus>({
          id: fileId,
          scanState: 'unavailable',
          canDownload: false,
          statusCheckFailed: true
        })
      ),
      finalize(() => this.active.delete(key)),
      // Share only active polling. Completion/destruction removes the entry;
      // there is no persistent cache of a clean result.
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.active.set(key, stream);
    return stream;
  }
}
