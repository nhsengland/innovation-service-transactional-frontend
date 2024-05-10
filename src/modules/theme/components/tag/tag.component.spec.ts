import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ThemeModule } from '@modules/theme/theme.module';

import { TagComponent } from './tag.component';
import { RouterModule } from '@angular/router';

describe('Theme/Components/Tag/TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule, ThemeModule],
      declarations: []
    });

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });
});
