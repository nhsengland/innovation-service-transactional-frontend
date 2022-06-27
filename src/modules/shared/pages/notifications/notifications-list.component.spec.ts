import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormControl } from '@angular/forms';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { NotificationContextType } from '@modules/shared/services/notifications.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { PageNotificationsListComponent } from './notifications-list.component';


describe('Shared/Pages/Notifications/PageNotificationsListComponent', () => {

  let activatedRoute: ActivatedRoute;

  let organisationsService: OrganisationsService;


  let component: PageNotificationsListComponent;
  let fixture: ComponentFixture<PageNotificationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        SharedModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    // authenticationStore = TestBed.inject(AuthenticationStore);
    organisationsService = TestBed.inject(OrganisationsService);

    // authenticationStore.getUserInfo = () => USER_INFO_INNOVATOR;

    // activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', assessment: {} } };
    //     activatedRoute.snapshot.queryParams = { alert: 'actionCreationSuccess' };


  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageNotificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should run selectedFilters and return empty', () => {
    fixture = TestBed.createComponent(PageNotificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.selectedFilters).toEqual([]);
  });

  it('should run selectedFilters and return values', fakeAsync(() => {
    fixture = TestBed.createComponent(PageNotificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    (component.form.get('contextTypes') as FormArray).push(new FormControl(NotificationContextType.INNOVATION));
    tick(500); // Needed because of the debounce on the form.

    expect(component.selectedFilters).toEqual([{
      key: 'contextTypes',
      title: 'Types',
      showHideStatus: 'opened',
      selected: [{ label: 'shared.catalog.innovation.notification_context_types.INNOVATION.title', value: 'INNOVATION' }]
    }]);

  }));




});
