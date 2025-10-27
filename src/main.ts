import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) enableProdMode();

function bootstrap() {
  console.log(
    '----------------------------- process.env.OAUTH_CLIENT_SECRET ---------------------------',
    process.env.OAUTH_CLIENT_SECRET
  );
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
