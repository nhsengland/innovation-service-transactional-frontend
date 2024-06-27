import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { dummy_schema_V3_202405 } from '@modules/stores/innovation/innovation-record/202405/ir-v3-schema';
import {
  InnovationRecordQuestionStepType,
  InnovationRecordSchemaV3Type
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';

@Component({
  selector: 'app-admin-innovation-record-management-sections-details',
  templateUrl: './innovation-record-management-sections-details.html'
})
export class PageIRManagementSectionDetailsComponent extends CoreComponent implements OnInit {
  sectionId: string;
  irManagementSchema: InnovationRecordSchemaV3Type | null = dummy_schema_V3_202405;
  irSections = this.stores.schema.getIrSchemaSectionsListV3();
  sectionQuestions: InnovationRecordQuestionStepType[] | undefined;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
  }

  ngOnInit(): void {
    const schemaSection = dummy_schema_V3_202405.sections
      .flatMap(s => s.subSections)
      .find(ss => ss.id === this.sectionId);
    this.sectionQuestions = schemaSection?.steps.flatMap(s => s.questions);
    const sectionIdentification = this.stores.schema.getIrSchemaSectionIdentificationV3(this.sectionId);
    this.setPageTitle(`${sectionIdentification?.section.title}`, {
      hint: `${sectionIdentification?.group.number}. ${sectionIdentification?.group.title}`
    });

    this.setPageStatus('READY');
  }
}
