import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-innovator-data-sharing-info',
  templateUrl: './data-sharing-info.component.html',
  standalone: true,
  imports: [RouterModule]
})
export class InnovatorDataSharingInfoComponent extends CoreComponent {
  isSubmitted = input(false);
}
