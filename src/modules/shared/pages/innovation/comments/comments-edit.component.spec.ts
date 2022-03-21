import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { InnovationStore, StoresModule } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageInnovationCommentsEditComponent } from './comments-edit.component';


describe('Shared/Pages/Innovation/CommentsPageInnovationCommentsEditComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;

  let component: PageInnovationCommentsEditComponent;
  let fixture: ComponentFixture<PageInnovationCommentsEditComponent>;

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

    fixture = TestBed.createComponent(PageInnovationCommentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  it('should run onSubmit() with invalid form', () => {

    fixture = TestBed.createComponent(PageInnovationCommentsEditComponent);
    component = fixture.componentInstance;

    component.onSubmit();
    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);

  });

  it('should run onSubmit and call api with success', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    const responseMock = { id: 'commentId' };
    innovationStore.createInnovationComment$ = () => of(responseMock as any);

    fixture = TestBed.createComponent(PageInnovationCommentsEditComponent);
    component = fixture.componentInstance;

    component.form.get('comment')?.setValue('A comment');
    component.onSubmit();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(['/innovator/innovations/Inno01/comments'], { queryParams: { alert: 'commentEditSuccess' } });

  });

  it('should run onSubmit and call api with error', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };

    innovationStore.createInnovationComment$ = () => throwError('error');

    const expected = {
      type: 'ERROR',
      title: 'An error occurred when creating an action',
      message: 'Please try again or contact us for further help',
      setFocus: true
    };

    fixture = TestBed.createComponent(PageInnovationCommentsEditComponent);
    component = fixture.componentInstance;

    component.form.get('comment')?.setValue('A comment');
    component.onSubmit();
    fixture.detectChanges();

    expect(component.alert).toEqual(expected);

  });

  it('should throw error on getComment()', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01' };
    activatedRoute.queryParams = of({ createdOrder: 'desc' });

    innovationStore.getInnovationComments$ = () => throwError('error');
    const expected = {
      type: 'ERROR',
      title: 'Unable to fetch comments information',
      message: 'Please try again or contact us for further help'
    };
    fixture = TestBed.createComponent(PageInnovationCommentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });
  it('should run getComment() with submodule comment', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', commentId: 'comment01', replyId: 'reply01' };
    activatedRoute.snapshot.data = { submodule: 'comment', module: 'innovator' };
    activatedRoute.queryParams = of({ createdOrder: 'desc' });
    const responseMock01 = [
      {
        id: 'Comment01', message: 'Comment message', createdAt: '2020-01-01T00:00:00.000Z',
        user: { id: 'User01', type: 'ACCESSOR', name: 'Name of user', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } },
        replies: [
          {
            id: 'Reply01', message: 'Reply message', createdAt: '2020-01-01T00:00:00.000Z',
            user: { id: 'User02', type: 'INNOVATOR', name: 'User 02', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } }
          }
        ]
      }
    ];
    innovationStore.getInnovationComments$ = () => of(responseMock01 as any);
  
    fixture = TestBed.createComponent(PageInnovationCommentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isRunningOnBrowser()).toEqual(true);

  });
  it('should run getComment() with submodule reply', () => {

    activatedRoute.snapshot.params = { innovationId: 'Inno01', commentId: 'comment01', replyId: 'reply01' };
    activatedRoute.params = of({ innovationId: 'Inno01', commentId: 'comment01', replyId: 'reply01' })
    activatedRoute.snapshot.data = { submodule: 'reply', module: 'innovator' };
    activatedRoute.queryParams = of({ createdOrder: 'desc' });
    const responseMock01 = [
      {
        id: 'Comment01', message: 'Comment message', createdAt: '2020-01-01T00:00:00.000Z',
        user: { id: 'User01', type: 'ACCESSOR', name: 'Name of user', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } },
        replies: [
          {
            id: 'Reply01', message: 'Reply message', createdAt: '2020-01-01T00:00:00.000Z',
            user: { id: 'User02', type: 'INNOVATOR', name: 'User 02', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } }
          }
        ]
      }
    ];
    innovationStore.getInnovationComments$ = () => of(responseMock01 as any);
  
    fixture = TestBed.createComponent(PageInnovationCommentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.get('comment')?.value).toEqual('Comment message');

  });


});
