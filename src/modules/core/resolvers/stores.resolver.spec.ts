import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Injector } from '@angular/core';
import { of } from 'rxjs';

import { CoreModule, AppInjector } from '@modules/core';
import { StoresModule, EnvironmentStore } from '@modules/stores';

import { StoresResolver } from './stores.resolver';


describe('Core/Resolvers/StoresResolver tests Suite', () => {

  let environmentStore: EnvironmentStore;
  let resolver: StoresResolver;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule,
        StoresModule
      ]
    });

    AppInjector.setInjector(TestBed.inject(Injector));

    environmentStore = TestBed.inject(EnvironmentStore);
    resolver = TestBed.inject(StoresResolver);

  });


  it('should run resolve', () => {

    spyOn(environmentStore, 'initializeStore$').and.returnValue(of(false));

    let expected: boolean | null = null;

    resolver.resolve().subscribe(response => { expected = response; });

    expect(expected).toBe(false);

  });

});
