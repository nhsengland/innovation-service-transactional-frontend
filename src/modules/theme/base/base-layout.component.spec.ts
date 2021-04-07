import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';

import { StoresModule } from '@modules/stores';

import { BaseLayoutComponent } from './base-layout.component';

import { HeaderComponent } from '@modules/theme/components/header/header.component';
import { FooterComponent } from '@modules/theme/components/footer/footer.component';


describe('Theme/Base/BaseLayoutComponent', () => {
  beforeEach( () => {
     TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        StoresModule
      ],
      declarations: [
        BaseLayoutComponent,
        FooterComponent,
        HeaderComponent,
      ]
    }).compileComponents();
  });

  it('should create the componnet', () => {
    const fixture = TestBed.createComponent(BaseLayoutComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
