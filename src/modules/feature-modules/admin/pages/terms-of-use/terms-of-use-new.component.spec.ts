import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { StoresModule } from '@modules/stores';

import { PageTermsOfUseNewComponent } from './terms-of-use-new.component';

import { TermsOfUseTypeEnum } from '@app/base/enums';
import { AdminUsersService } from '@modules/feature-modules/admin/services/users.service';

describe('FeatureModules/Admin/Pages/TermsOfUse/PageTermsOfUseNewComponent', () => {
  let component: PageTermsOfUseNewComponent;
  let fixture: ComponentFixture<PageTermsOfUseNewComponent>;
  let activatedRoute: ActivatedRoute;
  let userService: AdminUsersService;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([]), CoreModule, StoresModule, AdminModule]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');
    activatedRoute = TestBed.inject(ActivatedRoute);
    userService = TestBed.inject(AdminUsersService);
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default information loaded', () => {
    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus()).toBe('READY');
  });

  it('should NOT have default information loaded when editing version', () => {
    activatedRoute.snapshot.data = { module: 'Edit' };

    userService.getTermsById = () => throwError('error');

    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.alert.type).toBe('ERROR');
  });

  it('should create a new version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'New' };
    userService.createVersion = () =>
      of({
        id: 'term 01',
        name: 'term',
        touType: 'TEST',
        summary: 'TEST',
        releasedAt: '01-02-2022',
        createdAt: '12-01-2022'
      });
    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('term');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['admin/terms-conditions'], {
      queryParams: { alert: 'versionCreationSuccess' }
    });
  });

  it('should failed with default error while create a new version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'New' };
    userService.createVersion = () => throwError('error');
    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('term');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();

    expect(component.alert.type).toBe('ERROR');
  });
  it('should throw unique key error while create a new version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'New' };
    userService.createVersion = () => throwError({ code: 'UniqueKeyError' });
    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('term');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();

    expect(component.alert.type).toBe('ERROR');
  });
  it('should edit existing version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'Edit' };
    userService.getTermsById = () =>
      of({
        id: 'term 01',
        name: 'term',
        touType: TermsOfUseTypeEnum.INNOVATOR,
        summary: 'TEST',
        releasedAt: '01-02-2022',
        createdAt: '12-01-2022'
      });
    userService.updateTermsById = () =>
      of({
        id: 'term 01',
        name: 'termEdited',
        touType: TermsOfUseTypeEnum.INNOVATOR,
        summary: 'TEST',
        releasedAt: '01-02-2022',
        createdAt: '12-01-2022'
      });
    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['admin/terms-conditions'], {
      queryParams: { alert: 'versionUpdatedSuccess' }
    });
  });
  it('should throw uniqueKey error while edit existing version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'Edit' };
    userService.getTermsById = () =>
      of({
        id: 'term 01',
        name: 'term',
        touType: TermsOfUseTypeEnum.INNOVATOR,
        summary: 'TEST',
        releasedAt: '01-02-2022',
        createdAt: '12-01-2022'
      });
    userService.updateTermsById = () => throwError({ code: 'UniqueKeyError' });

    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('termEdited');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();

    expect(component.alert.type).toBe('ERROR');
  });
  it('should throw default error while edit existing version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'Edit' };
    userService.getTermsById = () =>
      of({
        id: 'term 01',
        name: 'term',
        touType: TermsOfUseTypeEnum.INNOVATOR,
        summary: 'TEST',
        releasedAt: '01-02-2022',
        createdAt: '12-01-2022'
      });
    userService.updateTermsById = () => throwError('error');

    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('termEdited');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();

    expect(component.alert.type).toBe('ERROR');
  });

  it('should NOT submit when null module', () => {
    activatedRoute.snapshot.data = { module: null };

    fixture = TestBed.createComponent(PageTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.form.get('name')?.setValue('term');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);

    component.onSubmit();
    expect(component.alert.type).toBe('ERROR');
  });
});
