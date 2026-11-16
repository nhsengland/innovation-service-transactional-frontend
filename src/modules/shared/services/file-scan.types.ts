export type FileScanState =
  | 'legacy_allowed'
  | 'scanning'
  | 'ready'
  | 'rejected'
  | 'delayed'
  | 'scan_failed'
  | 'not_scanned'
  | 'removed'
  | 'unavailable';

export type FileDownloadType = {
  url?: string;
  scanState?: FileScanState;
  canDownload?: boolean;
};

export type FileScanStatus = FileDownloadType & {
  id: string;
  scanState: FileScanState;
  canDownload: boolean;
  retryAfterSeconds?: number;
  statusCheckFailed?: boolean;
};
