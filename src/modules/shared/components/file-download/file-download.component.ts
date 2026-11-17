import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, PLATFORM_ID, TemplateRef, ViewChild, inject } from '@angular/core';
import { CtxStore } from '@modules/stores';
import { FileScanService } from '@modules/shared/services/file-scan.service';
import { FileDownloadType, FileScanStatus } from '@modules/shared/services/file-scan.types';
import { Subscription, fromEvent, takeUntil } from 'rxjs';

@Component({
  selector: 'shared-file-download',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class.file-scan-stacked]': 'stacked',
    '[class.file-scan-align-end]': 'align === "end"'
  },
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.scss']
})
export class FileDownloadComponent implements OnChanges, OnDestroy {
  @Input() file?: FileDownloadType | null;
  // Must be the persisted database file ID, never the Blob storage ID.
  @Input() fileId?: string;
  @Input() innovationId?: string;
  @Input() label = 'Download';
  @Input() fileName = '';
  @Input() linkClass = '';
  // Render these same controls in the adjacent Actions cell without a second poller.
  @Input() separateActions = false;
  @Input() stacked = true;
  @Input() align: 'start' | 'end' = 'start';
  @ViewChild('fileActions', { static: true }) actionsTemplate!: TemplateRef<unknown>;

  private readonly scans = inject(FileScanService);
  private readonly ctx = inject(CtxStore);
  private readonly platformId = inject(PLATFORM_ID);
  private subscription?: Subscription;
  status: FileDownloadType & { statusCheckFailed?: boolean } = {};

  get canDownload(): boolean {
    return (
      this.status.canDownload === true &&
      !!this.status.url &&
      (this.status.scanState === 'ready' || this.status.scanState === 'legacy_allowed')
    );
  }

  get canRetry(): boolean {
    return (
      !!this.fileId &&
      !this.canDownload &&
      this.status.scanState !== 'scanning' &&
      this.status.scanState !== 'rejected' &&
      this.status.scanState !== 'removed'
    );
  }

  get message(): string {
    if (this.status.statusCheckFailed) return 'Unable to check file status';
    switch (this.status.scanState) {
      case 'ready':
        return this.canDownload ? 'Ready' : 'File unavailable';
      case 'legacy_allowed':
        return this.canDownload ? 'Available' : 'File unavailable';
      case 'scanning':
        return 'Scanning';
      case 'delayed':
        return 'Scan delayed';
      case 'rejected':
        return 'File rejected';
      case 'removed':
        return 'File removed';
      case 'scan_failed':
      case 'not_scanned':
        return 'Unable to scan';
      default:
        return 'File unavailable';
    }
  }

  get badgeColour(): string {
    if (this.status.statusCheckFailed) return 'yellow';
    if (this.canDownload) return this.status.scanState === 'ready' ? 'green' : 'grey';
    switch (this.status.scanState) {
      case 'scanning':
        return 'blue';
      case 'rejected':
        return 'red';
      case 'removed':
        return 'grey';
      default:
        return 'yellow';
    }
  }

  ngOnChanges(): void {
    this.subscription?.unsubscribe();
    this.status = { ...this.file };
    if (this.status.scanState === 'scanning' || !this.status.scanState) this.startPolling();
  }

  retry(): void {
    this.subscription?.unsubscribe();
    this.startPolling();
  }

  private startPolling(): void {
    if (!isPlatformBrowser(this.platformId) || !this.fileId) return;
    const innovationId = this.innovationId || this.ctx.innovation.info().id;
    if (!innovationId) return;
    this.status = { scanState: 'scanning', canDownload: false };
    this.subscription = this.scans
      .watch(innovationId, this.fileId)
      .pipe(takeUntil(fromEvent(window, 'pagehide')))
      .subscribe((status: FileScanStatus) => {
        this.status = status;
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
