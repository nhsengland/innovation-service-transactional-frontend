import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { BaseLayoutComponent } from './base-layout.component';

import { HeaderComponent } from '@modules/theme/components/header/header.component';
import { FooterComponent } from '@modules/theme/components/footer/footer.component';
import { ActivityTimeoutComponent } from '@modules/theme/components/activity-timeout/activity-timeout.component';
import { RouterModule } from '@angular/router';

describe('Theme/Base/BaseLayoutComponent', () => {
  let component: BaseLayoutComponent;
  let fixture: ComponentFixture<BaseLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, HttpClientTestingModule, CoreModule, StoresModule],
      declarations: [BaseLayoutComponent, FooterComponent, HeaderComponent, ActivityTimeoutComponent]
    });
  });

  it('should create the componnet', () => {
    fixture = TestBed.createComponent(BaseLayoutComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });
});
