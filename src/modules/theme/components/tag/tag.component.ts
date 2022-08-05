import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'theme-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent implements OnInit {

  @Input() type: null | string = null;
  @Input() label = '';

  cssClass = '';


  constructor(
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    switch (this.type) {
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
      case 'WHITE':
        this.cssClass = 'nhsuk-tag--white'; break;
      default:
        this.cssClass = ''; break; // Default is blue.
        break;
    }

    this.cdr.detectChanges();

  }

}
