import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'theme-back-link',
  templateUrl: './back-link.component.html'
})
export class BackLinkComponent implements OnInit {

  @Input() href = '';

  constructor() { }

  ngOnInit(): void { }

}
