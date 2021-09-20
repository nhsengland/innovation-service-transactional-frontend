import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationsListComponent } from './innovations-list.component';


describe('FeatureModules/Innovator/Pages/Innovations/InnovationsListComponent', () => {

  let activatedRoute: ActivatedRoute;

  let component: InnovationsListComponent;
  let fixture: ComponentFixture<InnovationsListComponent>;

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

  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(InnovationsListComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should show "sectionUpdateSuccess" warning with innovation status = IN_PROGRESS', () => {

    activatedRoute.snapshot.queryParams = { alert: 'innovationCreationSuccess', name: 'Innovation name' };

    const expected = {
      type: 'SUCCESS',
      title: `You have successfully registered the innovation 'Innovation name'`
    };

    fixture = TestBed.createComponent(InnovationsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.alert).toEqual(expected);

  });

});
