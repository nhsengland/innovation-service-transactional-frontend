import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';
import { dummy_schema_V3_202405 } from '@modules/stores/innovation/innovation-record/202405/ir-v3-schema';
import {
  InnovationRecordSchemaV3Type,
  InnovationRecordSubSectionType
} from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';

@Component({
  selector: 'app-admin-innovation-record-management-sections-list',
  templateUrl: './innovation-record-management-sections-list.html'
})
export class PageIRManagementListComponent extends CoreComponent implements OnInit {
  schema: InnovationRecordSchemaV3Type | null;
  irSections = this.stores.schema.getIrSchemaSectionsListV3();

  constructor() {
    super();

    this.schema = this.stores.context.getIrSchema().schema;
  }

  ngOnInit(): void {
    this.setPageTitle('Manage innovation record');
    console.log(this.stores.schema.getIrSchemaSectionsListV3());
    this.setPageStatus('READY');
  }
}
