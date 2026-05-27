import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppInjector, CoreModule } from '@modules/core';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { StoresModule, CtxStore } from '@modules/stores';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AccessorService } from '../../../services/accessor.service';

import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './organisations-support-status-suggest.component';

describe('InnovationSupportOrganisationsSupportStatusSuggestComponent', () => {
  let component: InnovationSupportOrganisationsSupportStatusSuggestComponent;
  let fixture: ComponentFixture<InnovationSupportOrganisationsSupportStatusSuggestComponent>;

  let activatedRoute: ActivatedRoute;
  let ctx: CtxStore;
  let organisationsService: OrganisationsService;
  let innovationsService: InnovationsService;

  beforeEach(async () => {
    const orgsServiceMock = {
      getOrganisationsList: jest.fn().mockReturnValue(of([]))
    };
    const innoServiceMock = {
      getInnovationSupportsList: jest.fn().mockReturnValue(of([]))
    };
    const accessorServiceMock = {
      suggestNewOrganisations: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [InnovationSupportOrganisationsSupportStatusSuggestComponent],
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, TranslateModule.forRoot()],
      providers: [
        { provide: OrganisationsService, useValue: orgsServiceMock },
        { provide: InnovationsService, useValue: innoServiceMock },
        { provide: AccessorService, useValue: accessorServiceMock }
      ]
    }).compileComponents();

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);
    ctx = TestBed.inject(CtxStore);
    organisationsService = TestBed.inject(OrganisationsService);
    innovationsService = TestBed.inject(InnovationsService);

    // Mock CtxStore signals/computed
    (ctx.innovation as any).info = signal({ id: 'inno1', name: 'Test Innovation' });
    (ctx.user as any).getUserContext = signal({ organisationUnit: { id: 'userUnitId' } });

    (activatedRoute as any).snapshot = {
      queryParams: { entryPoint: 'supportUpdate' }
    };

    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    fixture = TestBed.createComponent(InnovationSupportOrganisationsSupportStatusSuggestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should format radio button label as Parent Name | Unit Name when single unit has different name', () => {
    const mockOrgs = [
      {
        id: 'org1',
        name: 'Parent Org',
        acronym: 'PO',
        isActive: true,
        organisationUnits: [{ id: 'u1', name: 'Different Unit Name', acronym: 'DUN', isActive: true }]
      }
    ];

    (organisationsService.getOrganisationsList as jest.Mock).mockReturnValue(of(mockOrgs));

    component.ngOnInit();
    fixture.detectChanges();

    const mappedItem = component.organisationItems.find(i => i.value === 'org1');
    expect(mappedItem?.label).toBe('Parent Org | Different Unit Name');
  });

  it('should format radio button label as Parent Name when single unit has same name', () => {
    const mockOrgs = [
      {
        id: 'org2',
        name: 'Same Name Org',
        acronym: 'SNO',
        isActive: true,
        organisationUnits: [{ id: 'u2', name: 'Same Name Org', acronym: 'SNO', isActive: true }]
      }
    ];

    (organisationsService.getOrganisationsList as jest.Mock).mockReturnValue(of(mockOrgs));

    component.ngOnInit();
    fixture.detectChanges();

    const mappedItem = component.organisationItems.find(i => i.value === 'org2');
    expect(mappedItem?.label).toBe('Same Name Org');
  });

  it('should format radio button label as Parent Name when it has multiple units', () => {
    const mockOrgs = [
      {
        id: 'org3',
        name: 'Multiple Units Org',
        acronym: 'MUO',
        isActive: true,
        organisationUnits: [
          { id: 'u3', name: 'Unit 3', acronym: 'U3', isActive: true },
          { id: 'u4', name: 'Unit 4', acronym: 'U4', isActive: true }
        ]
      }
    ];

    (organisationsService.getOrganisationsList as jest.Mock).mockReturnValue(of(mockOrgs));

    component.ngOnInit();
    fixture.detectChanges();

    const mappedItem = component.organisationItems.find(i => i.value === 'org3');
    expect(mappedItem?.label).toBe('Multiple Units Org');
  });
});
