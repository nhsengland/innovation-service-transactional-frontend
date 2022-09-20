import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { InnovationStore, StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageInnovationThreadNewComponent } from './thread-new.component';


describe('Shared/Pages/Innovation/Messages/PageInnovationThreadNewComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;

  let component: PageInnovationThreadNewComponent;
  let fixture: ComponentFixture<PageInnovationThreadNewComponent>;

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

    innovationStore = TestBed.inject(InnovationStore);

    activatedRoute.snapshot.data = { module: 'innovator' };

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(PageInnovationThreadNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  // it('should run onSubmit() with invalid form', () => {

  //   fixture = TestBed.createComponent(PageInnovationThreadNewComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit();
  //   fixture.detectChanges();
  //   expect(component.form.valid).toEqual(false);

  // });

  // it('should run onSubmit and call api with success', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');

  //   const responseMock = { id: 'commentId' };
  //   innovationStore.createInnovationComment$ = () => of(responseMock as any);

  //   fixture = TestBed.createComponent(PageInnovationThreadNewComponent);
  //   component = fixture.componentInstance;

  //   component.form.get('comment')?.setValue('A comment');
  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/comments'], { queryParams: { alert: 'commentCreationSuccess' } });

  // });

  // it('should run onSubmit and call api with error', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };

  //   innovationStore.createInnovationComment$ = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'An error occurred when creating an action',
  //     message: 'Please try again or contact us for further help',
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(PageInnovationThreadNewComponent);
  //   component = fixture.componentInstance;

  //   component.form.get('comment')?.setValue('A comment');
  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(component.alert).toEqual(expected);

  // });

});
