import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoreComponent } from '@app/base';
import { ThemeModule } from '@modules/theme/theme.module';

@Component({
  selector: 'app-innovator-pages-innovation-registered',
  templateUrl: './innovation-registered.component.html',
  imports: [ThemeModule, RouterModule],
  standalone: true
})
export class InnovationRegisteredComponent extends CoreComponent implements OnInit {
  public innovationId: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
  }

  ngOnInit(): void {
    this.setPageTitle('You have registered your innovation');
    this.setPageStatus('READY');
  }

  navigateToInnovationRecord(): void {
    this.router.navigate(['../record/sections/INNOVATION_DESCRIPTION'], { relativeTo: this.activatedRoute });
  }
}
