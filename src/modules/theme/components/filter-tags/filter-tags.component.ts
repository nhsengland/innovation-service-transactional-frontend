import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ContextTypeType } from "@modules/shared/services/innovation-documents.service";

@Component({
    selector: 'theme-filter-tags',
    templateUrl: './filter-tags.component.html'
})
export class FilterTagsComponent {

    @Input() responseLocations: ContextTypeType[] = [];
    @Output() locationTagsChange = new EventEmitter<ContextTypeType[]>();
    
    locations: { locationEnum: string, label: string }[] = [];

    selectedLocations: ContextTypeType[] = [];

    constructor(){
    }
    
    onClickTag(location: ContextTypeType) {

        console.log('location:')
        console.log(location)

        if (!this.selectedLocations.includes(location)) {
            this.selectedLocations.push(location)
        } else {
            this.selectedLocations = this.selectedLocations.filter (item => location !== item)
        }
        this.locationTagsChange.emit(this.selectedLocations);

    }

    clearSelectedTags(){
        this.selectedLocations = [];
        this.locationTagsChange.emit(this.selectedLocations);
    }
}
