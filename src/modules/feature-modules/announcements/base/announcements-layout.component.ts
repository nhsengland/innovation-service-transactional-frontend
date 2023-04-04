import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ContextStore } from '@modules/stores';
import { ContextPageLayoutType } from '@modules/stores/context/context.types';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-announcements-layout',
  templateUrl: './announcements-layout.component.html',
})
export class AnnouncementsLayoutComponent implements OnInit {

  private subscriptions = new Subscription();

  title: ContextPageLayoutType['title'] = { main: null };

  constructor(
    private contextStore: ContextStore,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.contextStore.pageLayout$().subscribe(item => {
        this.title = { ...item.title, width: item.title.width ?? 'full' };
        this.cdr.detectChanges();
      })
    );
  }

}
