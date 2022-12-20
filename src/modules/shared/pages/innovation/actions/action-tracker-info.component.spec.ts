import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { SharedModule } from '@modules/shared/shared.module';
import { PageInnovationActionTrackerInfoComponent } from './action-tracker-info.component';


describe('Shared/Pages/Innovation/PageInnovationActionTrackerInfoComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationsService: InnovationsService;

  let component: PageInnovationActionTrackerInfoComponent;
  let fixture: ComponentFixture<PageInnovationActionTrackerInfoComponent>;

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

    innovationsService = TestBed.inject(InnovationsService);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageInnovationActionTrackerInfoComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should show "actionCreationSuccess" warning', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };
  //   activatedRoute.snapshot.queryParams = { alert: 'actionCreationSuccess' };

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerInfoComponent);
  //   component = fixture.componentInstance;
  //   expect(component.alert.type).toEqual('SUCCESS');

  // });

  // it('should show "actionUpdateSuccess" warning', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };
  //   activatedRoute.snapshot.queryParams = { alert: 'actionUpdateSuccess', status: 'Completed' };

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerInfoComponent);
  //   component = fixture.componentInstance;
  //   expect(component.alert.type).toEqual('SUCCESS');

  // });


  // it('should have initial information loaded', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };

  //   const responseMock: GetInnovationActionInfoOutDTO = {
  //     id: 'ID01',
  //     displayId: '',
  //     status: InnovationActionStatusEnum.REQUESTED,
  //     name: 'Submit section 01',
  //     description: 'some description',
  //     section: InnovationSectionEnum.COST_OF_INNOVATION,
  //     createdAt: '2020-01-01T00:00:00.000Z',
  //     createdBy: 'Innovation user'
  //   };
  //   accessorService.getInnovationActionInfo = () => of(responseMock);
  //   const expected = responseMock;

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.action).toBe(expected);

  // });

  // it('should NOT have initial information loaded', () => {

  //   accessorService.getInnovationActionInfo = () => throwError('error');

  //   fixture = TestBed.createComponent(PageInnovationActionTrackerInfoComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.action).toBe(undefined);

  // });

});
