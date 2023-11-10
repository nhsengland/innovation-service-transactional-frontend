import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ContextTypeType } from "@modules/shared/services/innovation-documents.service";


export type chipFilterInputType = {id: string, value: string}[];

@Component({
    selector: 'theme-chips-filter-component',
    templateUrl: './chips-filter-component.html'
})
export class ChipsFilterComponent {

    @Input() chipsInput: chipFilterInputType = [];
    @Output() chipsChange = new EventEmitter<string[]>();

    selectedChips: string[] = [];

    constructor(){
    }
    
    onClickChip(chip: string) {

        if (!this.selectedChips.includes(chip)) {
            this.selectedChips.push(chip);
        } else {
            this.selectedChips = this.selectedChips.filter(item => chip !== item);
        }
        this.chipsChange.emit(this.selectedChips);

    }

    clearSelectedChips(){
        this.selectedChips = [];
        this.chipsChange.emit(this.selectedChips);
    }
}
