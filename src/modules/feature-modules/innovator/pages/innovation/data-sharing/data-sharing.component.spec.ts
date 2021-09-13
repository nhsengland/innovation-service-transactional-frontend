import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule, InnovationService } from '@modules/stores';
import { InnovatorModule } from '@modules/feature-modules/innovator/innovator.module';

import { InnovationDataSharingComponent } from './data-sharing.component';


describe('FeatureModules/Innovator/Innovation/DataSharingComponent', () => {

  let innovationService: InnovationService;

  let component: InnovationDataSharingComponent;
  let fixture: ComponentFixture<InnovationDataSharingComponent>;

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

    innovationService = TestBed.inject(InnovationService);

  });

  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationDataSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
