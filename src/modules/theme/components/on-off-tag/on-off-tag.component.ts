import { Component, Input, OnInit } from '@angular/core';
import { NgxDropzoneImagePreviewComponent } from 'ngx-dropzone';

@Component({
  selector: 'theme-on-off-tag',
  templateUrl: './on-off-tag.component.html'
})
export class OnOffTagComponent implements OnInit {
  @Input({ required: true }) isOn!: boolean;

  status = { cssClass: '', label: '' };

  ngOnInit(): void {
    this.status = {
      cssClass: this.isOn ? 'nhsuk-tag--green' : 'nhsuk-tag--red',
      label: this.isOn ? 'On' : 'Off'
    };
  }
}
