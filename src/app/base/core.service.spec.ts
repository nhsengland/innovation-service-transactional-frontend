import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Injector } from '@angular/core';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule } from '@modules/stores';

import { CoreService } from './core.service';

describe('App/Base/CoreService', () => {

  let service: CoreService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        CoreModule,
        StoresModule
      ],
      providers: [
        CoreService
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    service = TestBed.inject(CoreService);

  });


  it('should create Core servicet', () => {
    expect(service).toBeTruthy();
  });

});
