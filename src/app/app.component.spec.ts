import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { StoreModule } from '@modules/stores/store.module';

import { AppComponent } from './app.component';

import { HeaderComponent } from '@modules/theme/components/header/header.component';
import { FooterComponent } from '@modules/theme/components/footer/footer.component';

import { EnvironmentService } from '@modules/stores/environment/environment.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        StoreModule
      ],
      declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
      ],
      providers: [
        EnvironmentService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.titleService.getTitle()).toEqual('NHS Innovation Service');
  });

});
