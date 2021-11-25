import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Component, Injector, ViewChild } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { OrganisationSuggestionsCardComponent } from './organisation-suggestion-card.component';

import { NotificationsService } from '@modules/shared/services/notifications.service';

import { OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';


@Component({
  template: `<organisation-suggestions-card [suggestions]="suggestions" [shares]="shares"></organisation-suggestions-card>`
})
class HostComponent {

  @ViewChild(OrganisationSuggestionsCardComponent) childComponent?: OrganisationSuggestionsCardComponent;

  suggestions?: OrganisationSuggestionModel;
  shares?: { id: string, status: string }[];

}


describe('FeatureModules/Innovator/Innovation/DataSharingComponent', () => {

  let notificationsService: NotificationsService;

  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        ThemeModule,
        SharedModule
      ],
      declarations: [
        HostComponent,
        OrganisationSuggestionsCardComponent
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    notificationsService = TestBed.inject(NotificationsService);

    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;

  });

  it('should create the component', () => {
    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();
  });

  it('should create the component with empty information', () => {

    hostComponent.suggestions = {
      assessment: {
        id: '',
        suggestedOrganisations: []
      },
      accessors: [{
        organisationUnit: {
          id: '', name: '', acronym: '',
          organisation: { id: '', name: '', acronym: '' }
        },
        suggestedOrganisations: []

      }]
    };

    hostComponent.shares = undefined;

    hostFixture.detectChanges();
    expect(hostComponent).toBeTruthy();

  });

  it('should create the component', () => {

    notificationsService.notifications = { DATA_SHARING: 1 };

    hostComponent.suggestions =
    {
      assessment: {
        id: 'assessmentId01',
        suggestedOrganisations: [{
          id: 'orgId01', name: ' Org name 01', acronym: 'ORG01',
          organisationUnits: [{ id: 'orgUnitId01', name: 'Org unit name 01', acronym: 'ORGu01' }]
        }]
      },
      accessors: [{
        organisationUnit: {
          id: 'orgUnitId01', name: 'Org unit name 01', acronym: 'ORGu01',
          organisation: { id: 'orgId01', name: ' Org name 01', acronym: 'ORG01' }
        },
        suggestedOrganisations: [
          { id: 'orgId02', name: ' Org name 02', acronym: 'ORG02' },
          { id: 'orgId03', name: ' Org name 03', acronym: 'ORG03', }
        ]
      }]
    };

    hostComponent.shares = [
      { id: 'orgId03', status: 'ENGAGING' }
    ];

    hostFixture.detectChanges();
    expect(hostComponent.childComponent?.accessors).toEqual({ organisations: [' Org name 02 (ORG02)'], suggestors: 'Org unit name 01 ORG01' });
    expect(hostComponent.childComponent?.assessments).toEqual({ organisations: [' Org name 01 (ORG01)'] });

  });

});
