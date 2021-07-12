import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'theme-print-link',
  templateUrl: './print-link.component.html',
  styleUrls: ['./print-link.component.scss']

})
export class PrintLinkComponent implements OnInit {

  @Input() href = '';

  constructor() { }

  ngOnInit(): void { }

}
