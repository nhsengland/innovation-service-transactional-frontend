import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';

@Component({
  selector: 'app-assessment-pages-innovation-assessor',
  templateUrl: './change-assessor.component.html',
})
export class InnovationChangeAssessorComponent extends CoreComponent  implements OnInit {
  innovationId: string;
  assessmentId: string;

  form = new FormGroup({
    assessor: new FormControl<string>('', { validators: Validators.required, updateOn: 'change' }),
  }, { updateOn: 'blur' });
  
  needsAssessorList: { id: string, name: string }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService 
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
  }

  ngOnInit(): void {
    this.setPageTitle('Assign a new needs assessor to support this innovation');

    this.assessmentService.getAssessmentUsersList().subscribe((userList) => {
      const innovation = this.stores.context.getInnovation();
      this.needsAssessorList = userList.filter(i => i.id !== innovation.assignedTo?.id);

      this.setBackLink('Go Back', `/assessment/innovations/${this.innovationId}/overview`, `Innovation Overview page`);
      this.setPageStatus('READY');
    });
  }


  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      assessorId: this.form.get('assessor')?.value ?? ''
    }
    
    this.assessmentService.updateInnovationNeedsAssessmentAssessor(this.innovationId, this.assessmentId, body).subscribe(() => {
      this.setRedirectAlertSuccess('The assigned needs assessor has been successfully changed');
      this.redirectTo(`/assessment/innovations/${this.innovationId}/overview`);
    });
  }
}
