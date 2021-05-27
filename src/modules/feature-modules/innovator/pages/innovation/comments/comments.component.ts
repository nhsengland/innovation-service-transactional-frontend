import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-innovator-pages-innovation-comments',
  templateUrl: './comments.component.html'
})
export class InnovationCommentsComponent extends CoreComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void { }

}
