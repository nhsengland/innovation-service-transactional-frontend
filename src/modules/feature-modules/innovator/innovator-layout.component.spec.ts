import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovatorModule } from './innovator.module';

import { InnovatorLayoutComponent } from './innovator-layout.component';


describe('FeatureModule/Innovator/InnovatorLayoutComponent tests Suite', () => {

  let component: InnovatorLayoutComponent;
  let fixture: ComponentFixture<InnovatorLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ],
    }).compileComponents();
  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovatorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
