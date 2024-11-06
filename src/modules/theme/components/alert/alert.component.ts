import {
  Component,
  Input,
  OnChanges,
  PLATFORM_ID,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';

import { RandomGeneratorHelper } from '@modules/core/helpers/random-generator.helper';
import { Router } from '@angular/router';

@Component({
  selector: 'theme-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent implements OnChanges {
  // TECHDEBT: Looks like a great candidate to use signal inputs.
  @Input() type: null | '' | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR' = null;
  @Input() title?: string = '';
  @Input() listStyleType?: 'bullet';
  @Input() itemsList?: {
    title: string;
    description?: string;
    fieldId?: string;
    callback?: string | ((...p: any) => void);
  }[] = [];
  @Input() setFocus?: boolean;
  @Input() width?: 'full' | '2.thirds' = 'full';

  id: string;

  borderColorCSS = '';
  widthCSS = '';
  fontItemColorCSS = '';
  listCSS = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private scroller: ViewportScroller
  ) {
    this.id = RandomGeneratorHelper.generateRandom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type && changes.type.currentValue !== changes.type.previousValue) {
      switch (this.type) {
        case 'ACTION':
          this.borderColorCSS = 'border-color-primary';
          break;
        case 'INFORMATION':
          this.borderColorCSS = 'border-color-neutral';
          break;
        case 'SUCCESS':
          this.borderColorCSS = 'border-color-success';
          this.fontItemColorCSS = 'font-color-text';
          break;
        case 'WARNING':
          this.borderColorCSS = 'border-color-warning';
          break;
        case 'ERROR':
          this.borderColorCSS = 'border-color-error';
          this.fontItemColorCSS = 'font-color-error ';
          break;
        case null:
        case '':
        default:
          this.borderColorCSS = '';
          this.fontItemColorCSS = '';
          break;
      }

      switch (this.width) {
        case 'full':
          this.widthCSS = 'nhsuk-grid-column-full';
          break;
        case '2.thirds':
          this.widthCSS = 'nhsuk-grid-column-two-thirds';
          break;
        default:
          this.widthCSS = 'nhsuk-grid-column-full';
          break;
      }

      if (this.type === 'ERROR') {
        this.listCSS = 'nhsuk-error-summary__list';
      }

      switch (this.listStyleType) {
        case 'bullet':
          this.listCSS = this.listCSS + ' nhsuk-list--bullet nhsuk-u-margin-left-3';
          break;
        default:
          break;
      }

      if (this.setFocus && isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          // Await for the html injection if needed.
          const h = document.getElementById(`summary-title-${this.id}`);
          if (h) {
            h.setAttribute('tabIndex', '-1');
            h.focus();
            h.addEventListener('blur', e => {
              e.preventDefault();
              h.removeAttribute('tabIndex');
            });
          }
        });
      }
    }

    this.cdr.detectChanges();
  }

  onItemClick(callback?: string | ((...p: any) => void)) {
    if (!callback) {
      return;
    }

    if (typeof callback === 'string') {
      this.router.navigateByUrl(callback);
    } else {
      callback.call(this);
    }
  }

  onScrollToAnchor(id: string): void {
    this.scroller.scrollToAnchor(id);
  }
}
