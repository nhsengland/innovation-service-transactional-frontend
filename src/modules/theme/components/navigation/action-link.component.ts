import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'theme-action-link',
  templateUrl: './action-link.component.html'
})
export class ActionLinkComponent implements OnInit {

  @Input() href = '';
  @Input() text = '';

  constructor() { }

  ngOnInit(): void { }

}
