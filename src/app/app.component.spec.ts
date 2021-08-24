import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { AppComponent } from './app.component';

import { HeaderComponent } from '@modules/theme/components/header/header.component';
import { FooterComponent } from '@modules/theme/components/footer/footer.component';
import { ActivityTimeoutComponent } from '@modules/theme/components/activity-timeout/activity-timeout.component';

import { LoggerService } from '@modules/core/services/logger.service';

describe('AppComponent', () => {

  beforeEach( () => {
     TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ActivityTimeoutComponent
      ]
    });

  });

  it('should create the app', () => {
    spyOn(LoggerService.prototype, 'trackTrace').and.returnValue(null);
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();

  });

});
