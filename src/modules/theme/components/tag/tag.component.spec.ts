import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ThemeModule } from '@modules/theme/theme.module';

import { TagComponent } from './tag.component';

describe('Theme/Components/Tag/TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ThemeModule],
      declarations: []
    });

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });
});
