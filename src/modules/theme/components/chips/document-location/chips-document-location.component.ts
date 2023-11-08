import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ContextTypeType } from "@modules/shared/services/innovation-documents.service";

@Component({
    selector: 'theme-chips-document-location',
    templateUrl: './chips-document-location.component.html'
})
export class ChipsDocumentLocationComponent {

    @Input() responseLocations: ContextTypeType[] = [];
    @Output() locationChipsChange = new EventEmitter<ContextTypeType[]>();
    
    locations: { locationEnum: string, label: string }[] = [];

    selectedLocations: ContextTypeType[] = [];

    constructor(){
    }
    
    onClickChip(location: ContextTypeType) {

        if (!this.selectedLocations.includes(location)) {
            this.selectedLocations.push(location)
        } else {
            this.selectedLocations = this.selectedLocations.filter (item => location !== item)
        }
        this.locationChipsChange.emit(this.selectedLocations);

    }

    clearSelectedChips(){
        this.selectedLocations = [];
        this.locationChipsChange.emit(this.selectedLocations);
    }
}
