import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './not-found.component';

describe('FormEngineComponent tests Suite', () => {

  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        PageNotFoundComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;

  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
