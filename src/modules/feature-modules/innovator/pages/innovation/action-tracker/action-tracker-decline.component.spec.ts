import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovationSectionEnum, INNOVATION_SECTION_ACTION_STATUS } from '@modules/stores/innovation';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationActionTrackerDeclineComponent } from './action-tracker-decline.component';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


describe('FeatureModules/Innovator/Innovation/InnovationActionTrackerEditComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovatorService: InnovatorService;

  let component: InnovationActionTrackerDeclineComponent;
  let fixture: ComponentFixture<InnovationActionTrackerDeclineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        InnovatorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    activatedRoute = TestBed.inject(ActivatedRoute);

    innovatorService = TestBed.inject(InnovatorService);

  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationActionTrackerDeclineComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should have initial information loaded', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', actionId: 'Action01' };

  //   const responseMock = {
  //     id: 'ID01',
  //     displayId: 'ID01_display',
  //     status: 'REQUESTED' as keyof typeof INNOVATION_SECTION_ACTION_STATUS,
  //     name: `Submit section name`,
  //     description: '',
  //     section: InnovationSectionEnum.COST_OF_INNOVATION,
  //     createdAt: '2021-04-16T09:23:49.396Z',
  //     createdBy: 'Accessor user'
  //   };
  //   innovatorService.getInnovationActionInfo = () => of(responseMock);

  //   const expected = responseMock.displayId;

  //   fixture = TestBed.createComponent(InnovationActionTrackerDeclineComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.actionDisplayId).toBe(expected);

  // });

  // it('should NOT have initial information loaded', () => {

  //   innovatorService.getInnovationActionInfo = () => throwError('error');

  //   fixture = TestBed.createComponent(InnovationActionTrackerDeclineComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();
  //   expect(component.actionDisplayId).toBe('');

  // });

  // it('should run onSubmit() with invalid form', () => {

  //   fixture = TestBed.createComponent(InnovationActionTrackerDeclineComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit();
  //   fixture.detectChanges();
  //   expect(component.form.valid).toEqual(true);

  // });

  // it('should run onSubmit and call api with success', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');

  //   const responseMock = { id: 'actionId' };
  //   innovatorService.declineAction = () => of(responseMock as any);

  //   fixture = TestBed.createComponent(InnovationActionTrackerDeclineComponent);
  //   component = fixture.componentInstance;

  //   component.form.get('comment')?.setValue('A required value');
  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/action-tracker/actionId'], { queryParams: { alert: 'actionDeclined', status: 'DECLINED' } });

  // });

  // it('should run onSubmit and call api with error', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   innovatorService.declineAction = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'An error occurred when declining an action',
  //     message: 'Please try again or contact us for further help',
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(InnovationActionTrackerDeclineComponent);
  //   component = fixture.componentInstance;
  //   component.form.get('comment')?.setValue('A required value');
  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(component.alert).toEqual(expected);

  // });

});
