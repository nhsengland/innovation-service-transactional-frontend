import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HeaderBreadcrumbsBarComponent } from './breadcrumbs-bar.component';

describe('Theme/Components/Header/NavigationBarComponent', () => {
  let component: HeaderBreadcrumbsBarComponent;
  let fixture: ComponentFixture<HeaderBreadcrumbsBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [HeaderBreadcrumbsBarComponent]
    });
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(HeaderBreadcrumbsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
