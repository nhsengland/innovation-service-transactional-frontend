import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';


@Component({
  selector: 'theme-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {

  @Input() label = '';
  @Input()
  // get type(): string { return this.cssClass; }
  set type(v: null | string) { // This accepts a specific type, or the CSS class.

    switch (v) {
      case 'INFORMATION':
        this.cssClass = 'nhsuk-tag--blue'; break;
      case 'SUCCESS':
        this.cssClass = 'nhsuk-tag--green'; break;
      case 'WARNING':
        this.cssClass = 'nhsuk-tag--yellow'; break;
      case 'ERROR':
        this.cssClass = 'nhsuk-tag--red'; break;
      case 'NEUTRAL':
        this.cssClass = 'nhsuk-tag--grey'; break;
      case 'STRONG_NEUTRAL':
        this.cssClass = 'nhsuk-tag--dark-grey'; break;
      case 'WHITE':
        this.cssClass = 'nhsuk-tag--white'; break;
      default:
        this.cssClass = v || ''; break; // Default is blue.
    }

    this.cdr.detectChanges();

  }

  cssClass = '';


  constructor(
    private cdr: ChangeDetectorRef
  ) { }

}
