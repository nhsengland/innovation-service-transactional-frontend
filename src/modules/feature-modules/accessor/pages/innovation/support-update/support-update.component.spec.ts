import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AppInjector, CoreModule } from '@modules/core';
import { StoresModule } from '@modules/stores';
import { AccessorModule } from '@modules/feature-modules/accessor/accessor.module';

import { InnovationSupportUpdateComponent } from './support-update.component';

import { AccessorService } from '@modules/feature-modules/accessor/services/accessor.service';


describe('FeatureModules/Accessor/Innovation/InnovationSupportUpdateComponent', () => {

  let accessorService: AccessorService;

  let component: InnovationSupportUpdateComponent;
  let fixture: ComponentFixture<InnovationSupportUpdateComponent>;

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

    fixture = TestBed.createComponent(InnovationSupportUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

  });

});
