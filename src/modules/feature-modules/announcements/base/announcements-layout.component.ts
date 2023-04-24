import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';

import { ContextStore } from '@modules/stores';
import { ContextPageLayoutType } from '@modules/stores/context/context.types';


@Component({
  selector: 'app-announcements-layout',
  templateUrl: './announcements-layout.component.html',
})
export class AnnouncementsLayoutComponent extends CoreComponent implements OnInit {

  title: ContextPageLayoutType['title'] = { main: null };

  constructor(
    private contextStore: ContextStore,
    private cdr: ChangeDetectorRef
  ) { super(); }

  ngOnInit(): void {
    this.subscriptions.push(
      this.contextStore.pageLayout$().subscribe(item => {
        this.title = { ...item.title, width: item.title.width ?? 'full' };
        this.cdr.detectChanges();
      })
    );
  }

}
