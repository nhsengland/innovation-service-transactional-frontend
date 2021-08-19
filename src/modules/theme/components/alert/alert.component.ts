import { Component, Input, OnChanges, PLATFORM_ID, Inject, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { RandomGeneratorHelper } from '@modules/core';


@Component({
  selector: 'theme-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnChanges {

  @Input() type: null | '' | 'ACTION' | 'INFORMATION' | 'SUCCESS' | 'WARNING' | 'ERROR' = null;
  @Input() title?: string;
  @Input() setFocus?: boolean;

  id: string;

  borderColorCSS = '';


  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef
  ) {

    this.id = RandomGeneratorHelper.generateRandom();

  }


  ngOnChanges(changes: SimpleChanges): void {

    if (!changes.type?.isFirstChange() && changes.type.currentValue !== changes.type.previousValue) {

      switch (this.type) {
        case 'ACTION': this.borderColorCSS = 'border-color-primary'; break;
        case 'INFORMATION': this.borderColorCSS = 'border-color-neutral'; break;
        case 'SUCCESS': this.borderColorCSS = 'border-color-success'; break;
        case 'WARNING': this.borderColorCSS = 'border-color-warning'; break;
        case 'ERROR': this.borderColorCSS = 'border-color-error'; break;
        case null:
        case '':
        default:
          this.borderColorCSS = '';
          break;
      }

      if (this.setFocus && isPlatformBrowser(this.platformId)) {
        setTimeout(() => { // Await for the html injection if needed.
          const h = document.getElementById(`summary-title-${this.id}`);
          if (h) {
            h.setAttribute('tabIndex', '-1');
            h.focus();
            h.addEventListener('blur', (e) => {
              e.preventDefault();
              h.removeAttribute('tabIndex');
            });
          }
        });
      }

    }

    this.cdr.detectChanges();

  }


}
