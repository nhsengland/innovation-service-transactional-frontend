import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PageTitleComponent } from './page-title.component';
import { RouterModule } from '@angular/router';

describe('Theme/Components/PageTitle/PageTitleComponent', () => {
  let component: PageTitleComponent;
  let fixture: ComponentFixture<PageTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, HttpClientTestingModule],
      declarations: [PageTitleComponent]
    });
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(PageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
