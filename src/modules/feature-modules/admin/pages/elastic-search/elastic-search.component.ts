import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { ElasticSearchService } from '../../services/elastic-search.service';

@Component({
  selector: 'app-admin-pages-announcements-list',
  templateUrl: './elastic-search.component.html'
})
export class PageElasticSearchComponent extends CoreComponent {
  constructor(private esService: ElasticSearchService) {
    super();
    this.setPageTitle('Elastic Search');
    this.setPageStatus('READY');
  }

  searchReindex(): void {
    this.setPageStatus('LOADING');
    this.esService.reindex().subscribe(() => {
      this.setPageStatus('READY');
    });
  }
}
