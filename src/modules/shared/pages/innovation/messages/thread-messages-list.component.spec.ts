import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, InnovationStore } from '@modules/stores';
import { SharedModule } from '@modules/shared/shared.module';

import { PageInnovationThreadMessagesListComponent } from './thread-messages-list.component';


describe('Shared/Pages/Innovation/Messages/PageInnovationThreadMessagesListComponent', () => {

  let activatedRoute: ActivatedRoute;

  let innovationStore: InnovationStore;

  let component: PageInnovationThreadMessagesListComponent;
  let fixture: ComponentFixture<PageInnovationThreadMessagesListComponent>;

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

    activatedRoute.snapshot.data = { innovationData: { id: 'Inno01', name: 'Innovation 01', assessment: {} } };

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(PageInnovationThreadMessagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });


  // it('should show "commentCreationSuccess" warning', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.snapshot.queryParams = { alert: 'commentCreationSuccess' };

  //   const expected = { type: 'SUCCESS', title: 'You have successfully created a comment', message: 'Everyone who is currently engaging with your innovation will be notified.' };

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });
  // it('should show "commentEditSuccess" warning', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.snapshot.queryParams = { alert: 'commentEditSuccess' };

  //   const expected = { type: 'SUCCESS', title: 'You have successfully updated a comment', message: 'Everyone who is currently engaging with your innovation will be notified.' };

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.alert).toEqual(expected);

  // });


  // it('should have innovation information loaded', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });

  //   const responseMock = [
  //     {
  //       id: 'Comment01', message: 'Comment message', createdAt: '2020-01-01T00:00:00.000Z',
  //       user: { id: 'User01', type: 'ACCESSOR', name: 'Name of user', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } },
  //       replies: [
  //         {
  //           id: 'Reply01', message: 'Reply message', createdAt: '2020-01-01T00:00:00.000Z',
  //           user: { id: 'User02', type: 'INNOVATOR', name: 'User 02', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } }
  //         }
  //       ]
  //     }
  //   ];
  //   innovationStore.getInnovationComments$ = () => of(responseMock as any);

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.commentsList.length).toBe(1);

  // });

  // it('should NOT have innovation information loaded', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });

  //   innovationStore.getInnovationComments$ = () => throwError('error');

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.commentsList.length).toBe(0);

  // });


  // it('should run getTeamTitle("")', () => {

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getTeamTitle('')).toBe(null);

  // });
  // it('should run getTeamTitle("ASSESSMENT")', () => {

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getTeamTitle('ASSESSMENT')).toBe('Initial needs assessment');

  // });

  // it('should run getTeamTitle("ACCESSOR")', () => {

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getTeamTitle('ACCESSOR')).toBe('Support assessment');

  // });

  // it('should run getTeamTitle("INNOVATOR")', () => {

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   expect(component.getTeamTitle('INNOVATOR')).toBe(null);

  // });


  // it('should try to reply with invalid form', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });

  //   const responseMock01 = [
  //     {
  //       id: 'Comment01', message: 'Comment message', createdAt: '2020-01-01T00:00:00.000Z',
  //       user: { id: 'User01', type: 'ACCESSOR', name: 'Name of user', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } },
  //       replies: [
  //         {
  //           id: 'Reply01', message: 'Reply message', createdAt: '2020-01-01T00:00:00.000Z',
  //           user: { id: 'User02', type: 'INNOVATOR', name: 'User 02', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } }
  //         }
  //       ]
  //     }
  //   ];
  //   innovationStore.getInnovationComments$ = () => of(responseMock01 as any);


  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.form.get('Comment01')?.setValue('');
  //   fixture.detectChanges();

  //   component.onReply('Comment01');
  //   expect(component.form.valid).toBe(false);


  // });

  // it('should reply to a comment with success', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });

  //   const responseMock01 = [
  //     {
  //       id: 'Comment01', message: 'Comment message', createdAt: '2020-01-01T00:00:00.000Z',
  //       user: { id: 'User01', type: 'ACCESSOR', name: 'Name of user', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } },
  //       replies: [
  //         {
  //           id: 'Reply01', message: 'Reply message', createdAt: '2020-01-01T00:00:00.000Z',
  //           user: { id: 'User02', type: 'INNOVATOR', name: 'User 02', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } }
  //         }
  //       ]
  //     }
  //   ];
  //   innovationStore.getInnovationComments$ = () => of(responseMock01 as any);

  //   const responseMock = true;
  //   innovationStore.createInnovationComment$ = () => of(responseMock as any);

  //   const expected = { type: 'SUCCESS', title: 'You have successfully replied to the comment', setFocus: true };

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.form.get('Comment01')?.setValue('A message');
  //   fixture.detectChanges();

  //   component.onReply('Comment01');
  //   expect(component.alert).toEqual(expected);


  // });

  // it('should NOT reply to a comment with API error', () => {

  //   activatedRoute.snapshot.params = { innovationId: 'Inno01' };
  //   activatedRoute.queryParams = of({ createdOrder: 'desc' });

  //   const responseMock01 = [
  //     {
  //       id: 'Comment01', message: 'Comment message', createdAt: '2020-01-01T00:00:00.000Z',
  //       user: { id: 'User01', type: 'ACCESSOR', name: 'Name of user', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } },
  //       replies: [
  //         {
  //           id: 'Reply01', message: 'Reply message', createdAt: '2020-01-01T00:00:00.000Z',
  //           user: { id: 'User02', type: 'INNOVATOR', name: 'User 02', organisationUnit: { id: 'OrgId01', name: 'Org. Unit' } }
  //         }
  //       ]
  //     }
  //   ];
  //   innovationStore.getInnovationComments$ = () => of(responseMock01 as any);

  //   innovationStore.createInnovationComment$ = () => throwError('error');

  //   const expected = { type: 'ERROR', title: 'An error occurred when creating an action', message: 'Please try again or contact us for further help', setFocus: true };

  //   fixture = TestBed.createComponent(PageInnovationMessagesListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.form.get('Comment01')?.setValue('A message');
  //   fixture.detectChanges();

  //   component.onReply('Comment01');
  //   expect(component.alert).toEqual(expected);

  // });

});
