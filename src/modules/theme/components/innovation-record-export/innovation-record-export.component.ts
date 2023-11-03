import { Component, Input, OnInit } from "@angular/core";
import { CoreComponent } from "@app/base";

@Component({
    selector: 'app-innovation-record-export',
    templateUrl: './innovation-record-export.component.html'
})
export class InnovationRecordExportComponent extends CoreComponent implements OnInit {

    @Input() innovationId: string = '';
    @Input() fileType: 'csv' | 'pdf' = 'pdf'; 
    @Input() button?: boolean = false;
    @Input() label?: string | undefined = undefined;

    // exportPayload: { fileType: string, data: AllSectionsOutboundPayloadType};

    exportDocumentUrl : string = '';

    constructor(
    ){
        super();
        
    }

    ngOnInit(): void {

        switch(this.fileType){
            case 'pdf':
                this.exportDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${this.innovationId}/pdf?role=${this.stores.authentication.getUserContextInfo()?.roleId}`;
                break;
            case 'csv':
                this.exportDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${this.innovationId}/csv?role=${this.stores.authentication.getUserContextInfo()?.roleId}`;
                break;
        }
        
    }

}