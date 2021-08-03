import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule, InnovationService } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { OrganisationSuggestionsCardComponent } from './organisation-suggestion-card.component';


describe('FeatureModules/Innovator/Innovation/DataSharingComponent', () => {

  let component: OrganisationSuggestionsCardComponent;
  let fixture: ComponentFixture<OrganisationSuggestionsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(OrganisationSuggestionsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
