import { HttpErrorResponse } from '@angular/common/http';

export type BaseContextType = { expiresAt: number; isStateLoaded: boolean; error?: HttpErrorResponse };
