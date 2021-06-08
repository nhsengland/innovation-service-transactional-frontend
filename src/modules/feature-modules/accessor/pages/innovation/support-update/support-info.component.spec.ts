import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSupportInfoComponent } from './support-info.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationSupportInfoComponent', () => {

  let accessorService: AccessorService;

  let component: InnovationSupportInfoComponent;
  let fixture: ComponentFixture<InnovationSupportInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CoreModule,
        StoresModule,
        AccessorModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    accessorService = TestBed.inject(AccessorService);

  });


  it('should create the component', () => {

    fixture = TestBed.createComponent(InnovationSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
