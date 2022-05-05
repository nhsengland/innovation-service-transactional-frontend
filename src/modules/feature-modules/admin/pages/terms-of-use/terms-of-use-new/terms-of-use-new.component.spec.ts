import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AdminModule } from '@modules/feature-modules/admin/admin.module';
import { PageAdminTermsOfUseNewComponent } from './terms-of-use-new.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceUsersService } from '@modules/feature-modules/admin/services/service-users.service';
import { of, throwError } from 'rxjs';


describe('FeatureModules/Admin/Pages/ServiceUsers/PageAdminTermsOfUseNewComponent', () => {

  let component: PageAdminTermsOfUseNewComponent;
  let fixture: ComponentFixture<PageAdminTermsOfUseNewComponent>;
  let activatedRoute: ActivatedRoute;
  let userService: ServiceUsersService;
  let router: Router;
  let routerSpy: jasmine.Spy;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AdminModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');
    activatedRoute = TestBed.inject(ActivatedRoute);
    userService = TestBed.inject(ServiceUsersService);
  });


  it('should create the component', () => {
    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default information loaded', () => {

    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageStatus).toBe('READY');

  });

  it('should NOT have default information loaded when editing version', () => {
    activatedRoute.snapshot.data = { module: 'Edit' };

    userService.getTermsById = () => throwError('error');

    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const expected = {
      type: 'ERROR',
      title: 'Unable to perform the necessary action',
      message: 'Please try again or contact us for further help'
    };

    expect(component.alert).toEqual(expected);

  });

  it('should create a new version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'New' };
    userService.createVersion = () => of({
      id: 'term 01',
      name: 'term',
      touType: 'TEST',
      summary: 'TEST',
      releasedAt: '01-02-2022',
      createdAt: '12-01-2022'
    });
    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('term');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['admin/terms-conditions'], { queryParams: { alert: 'versionCreationSuccess' } });

  });

  it('should failed with default error while create a new version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'New' };
    userService.createVersion = () => throwError('error');
    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('term');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();
    const expected = {
      type: 'ERROR',
      title: 'Unable to perform the necessary action',
      message: 'Please try again or contact us for further help'
    };

    expect(component.alert).toEqual(expected);

  });
  it('should throw unique key error while create a new version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'New' };
    userService.createVersion = () => throwError({ code: 'UniqueKeyError' });
    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('term');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();
    const expected = {
      type: 'ERROR',
      title: 'A version of the terms of use with this name already exists, please re-name this new version',
    };

    expect(component.alert).toEqual(expected);

  });
  it('should edit existing version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'Edit' };
    userService.getTermsById = () => of({
      id: 'term 01',
      name: 'term',
      touType: 'TEST',
      summary: 'TEST',
      releasedAt: '01-02-2022',
      createdAt: '12-01-2022'
    });
    userService.updateTermsById = () => of({
      id: 'term 01',
      name: 'termEdited',
      touType: 'TEST',
      summary: 'TEST',
      releasedAt: '01-02-2022',
      createdAt: '12-01-2022'
    });
    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['admin/terms-conditions'], { queryParams: { alert: 'versionUpdatedSuccess' } });

  });
  it('should throw uniqueKey error while edit existing version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'Edit' };
    userService.getTermsById = () => of({
      id: 'term 01',
      name: 'term',
      touType: 'TEST',
      summary: 'TEST',
      releasedAt: '01-02-2022',
      createdAt: '12-01-2022'
    });
    userService.updateTermsById = () => throwError({ code: 'UniqueKeyError' });

    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('termEdited');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();
    const expected = {
      type: 'ERROR',
      title: 'A version of the terms of use with this name already exists, please re-name this new version',
    };

    expect(component.alert).toEqual(expected);
  });
  it('should throw default error while edit existing version', () => {
    activatedRoute.snapshot.params = { id: 'term 01' };
    activatedRoute.snapshot.data = { module: 'Edit' };
    userService.getTermsById = () => of({
      id: 'term 01',
      name: 'term',
      touType: 'TEST',
      summary: 'TEST',
      releasedAt: '01-02-2022',
      createdAt: '12-01-2022'
    });
    userService.updateTermsById = () => throwError('error');

    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    component.form.get('name')?.setValue('termEdited');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    fixture.detectChanges();
    component.onSubmit();
    const expected = {
      type: 'ERROR',
      title: 'Unable to perform the necessary action',
      message: 'Please try again or contact us for further help'
    };

    expect(component.alert).toEqual(expected);
  });



  it('should NOT submit when null module', () => {
    activatedRoute.snapshot.data = { module: null };

    fixture = TestBed.createComponent(PageAdminTermsOfUseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.form.get('name')?.setValue('term');
    component.form.get('touType')?.setValue('TEST');
    component.form.get('summary')?.setValue('TEST');
    component.form.get('notifyUser')?.setValue(0);
    const expected = {
      type: 'ERROR',
      title: 'Unable to perform the necessary action',
      message: 'Please try again or contact us for further help'
    };
    component.onSubmit();
    expect(component.alert).toEqual(expected);

  });


});
