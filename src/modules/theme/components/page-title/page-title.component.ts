import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'theme-page-title',
  templateUrl: './page-title.component.html'
})
export class PageTitleComponent implements OnInit {

  @Input() title = '';
  @Input() titleHint = '';
  @Input() actions: { type: 'link' | 'button', label: string, url: string, fullReload?: boolean }[] = [];

  constructor() { }

  ngOnInit(): void { }

}
