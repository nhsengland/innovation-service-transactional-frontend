import { HttpContextToken } from '@angular/common/http';

// Background scan checks handle authentication failures without interrupting navigation.
export const SKIP_UNAUTHORIZED_RECOVERY = new HttpContextToken<boolean>(() => false);
