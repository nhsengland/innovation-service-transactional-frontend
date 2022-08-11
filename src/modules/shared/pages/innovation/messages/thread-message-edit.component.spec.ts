import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { InnovationStore, StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageInnovationThreadMessageEditComponent } from './thread-message-edit.component';


describe('Shared/Pages/Innovation/Messages/PageInnovationThreadMessageEditComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;

  let component: PageInnovationThreadMessageEditComponent;
  let fixture: ComponentFixture<PageInnovationThreadMessageEditComponent>;

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

    fixture = TestBed.createComponent(PageInnovationThreadMessageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  // it('should run onSubmit() with invalid form', () => {

  //   fixture = TestBed.createComponent(PageInnovationThreadMessageEditComponent);
  //   component = fixture.componentInstance;

  //   component.onSubmit();
  //   fixture.detectChanges();
  //   expect(component.form.valid).toEqual(false);

  // });

  // it('should run onSubmit when submodule reply and call api with success', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.snapshot.data = { subModule: 'reply', module: 'innovator' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });
  //   const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

  //   const responseMock = { id: 'commentId' };
  //   innovationStore.updateInnovationComment$ = () => of(responseMock as any);

  //   fixture = TestBed.createComponent(PageInnovationThreadMessageEditComponent);
  //   component = fixture.componentInstance;

  //   component.form.get('comment')?.setValue('A comment');
  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/comments'], { queryParams: { alert: 'commentEditSuccess' } });

  // });
  // it('should run onSubmit when submodule comment and call api with success', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.snapshot.data = { subModule: 'comment', module: 'innovator' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });
  //   const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

  //   const responseMock = { id: 'commentId' };
  //   innovationStore.updateInnovationComment$ = () => of(responseMock as any);

  //   fixture = TestBed.createComponent(PageInnovationThreadMessageEditComponent);
  //   component = fixture.componentInstance;

  //   component.form.get('comment')?.setValue('A comment');
  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/comments'], { queryParams: { alert: 'commentEditSuccess' } });

  // });

  // it('should run onSubmit and call api with error', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.snapshot.data = { subModule: 'comment', module: 'innovator' };
  //   innovationStore.updateInnovationComment$ = () => throwError('error');

  //   const expected = {
  //     type: 'ERROR',
  //     title: 'An error occurred when updating an action',
  //     message: 'Please try again or contact us for further help',
  //     setFocus: true
  //   };

  //   fixture = TestBed.createComponent(PageInnovationThreadMessageEditComponent);
  //   component = fixture.componentInstance;

  //   component.form.get('comment')?.setValue('A comment');
  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(component.alert).toEqual(expected);

  // });

  // it('should throw error on get comments', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });

  //   innovationStore.getInnovationComments$ = () => throwError('error');
  //   const expected = {
  //     type: 'ERROR',
  //     title: 'Unable to fetch comments information',
  //     message: 'Please try again or contact us for further help'
  //   };
  //   fixture = TestBed.createComponent(PageInnovationThreadMessageEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });
  // it('should get comment when submodule comment', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', commentId: 'Comment01', replyId: 'Reply01' };
  //   activatedRoute.snapshot.data = { subModule: 'comment', module: 'innovator' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });
  //   const responseMock01 = [
  //     {
  //       id: 'Comment01', message: 'Comment message', createdAt: '2020-01-01T00:00:00.000Z',
  //       user: { id: 'User01', type: 'INNOVATOR', name: 'Name of user', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } },
  //       replies: [
  //         {
  //           id: 'Reply01', message: 'Reply message', createdAt: '2020-01-01T00:00:00.000Z',
  //           user: { id: 'User02', type: 'INNOVATOR', name: 'User 02', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } }
  //         }
  //       ]
  //     }
  //   ];
  //   innovationStore.getInnovationComments$ = () => of(responseMock01 as any);

  //   fixture = TestBed.createComponent(PageInnovationThreadMessageEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.form.get('comment')?.value).toEqual('Comment message');

  // });
  // it('should get replies with submodule reply', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01', commentId: 'Comment01', replyId: 'Reply01' };
  //   activatedRoute.snapshot.data = { subModule: 'reply', module: 'innovator' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });
  //   const responseMock01 = [
  //     {
  //       id: 'Comment01', message: 'Comment message', createdAt: '2020-01-01T00:00:00.000Z',
  //       user: { id: 'User01', type: 'INNOVATOR', name: 'Name of user', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } },
  //       replies: [
  //         {
  //           id: 'Reply01', message: 'Reply message', createdAt: '2020-01-01T00:00:00.000Z',
  //           user: { id: 'User02', type: 'INNOVATOR', name: 'User 02', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } }
  //         }
  //       ]
  //     }
  //   ];
  //   innovationStore.getInnovationComments$ = () => of(responseMock01 as any);

  //   fixture = TestBed.createComponent(PageInnovationThreadMessageEditComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.form.get('comment')?.value).toEqual('Reply message');

  // });

});
