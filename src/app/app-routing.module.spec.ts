import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { Router, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

import { PageNotFoundComponent } from '@modules/shared/pages/not-found.component';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

const triageInnovatorPackModule: Promise<any> = import('@triage-innovator-pack-feature-module/triage-innovator-pack.module');

describe.skip('app-routing.module', () => {

  let router: Router;

  beforeAll(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterModule.forRoot([
          { path: 'not-found', component: PageNotFoundComponent },
          { path: 'triage-innovator-pack', loadChildren: () => triageInnovatorPackModule.then(m => m.TriageInnovatorPackModule) }
        ]),
        AppRoutingModule,
        StoresModule,
        SharedModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });

    router = TestBed.inject(Router);

  });

  it(`should navigate to '/not-found'`, fakeAsync(() => {

    router.navigate(['/some-url']);
    tick();

    expect(location.pathname).toBe('/not-found');

  }));

  it(`should navigate to '/triage-innovator-pack'`, fakeAsync(() => {

    router.navigate(['/triage-innovator-pack']);
    tick();

    expect(location.pathname).toBe('/triage-innovator-pack');

  }));

  it(`should navigate to '/triage-innovator-pack' when '' is passed in as a path`, fakeAsync(() => {

    router.navigate(['']);
    tick();

    expect(location.pathname).toBe('/triage-innovator-pack');

  }));



});
