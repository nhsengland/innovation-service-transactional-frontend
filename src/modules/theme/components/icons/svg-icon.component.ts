import { Component, Input, OnInit } from '@angular/core';

type SvgPaletteColorsType = 'green' | 'yellow' | 'red' | 'grey';
type SvgPaletteDataType = { [key in SvgPaletteColorsType]: { stroke: string; fill: string } };

@Component({
  selector: 'theme-svg-icon',
  templateUrl: './svg-icon.component.html'
})
export class SvgIconComponent implements OnInit {
  @Input() type:
    | ''
    | 'action'
    | 'success'
    | 'error'
    | 'edit'
    | 'chevron-left'
    | 'chevron-right'
    | 'arrow-left'
    | 'arrow-right'
    | 'plus' = '';
  @Input({ required: false }) customColor?: SvgPaletteColorsType;
  @Input() fill? = '';

  svgPaletteData: SvgPaletteDataType = {
    green: {
      stroke: '#00401E',
      fill: '#007F3B'
    },
    yellow: {
      stroke: '#4D4711',
      fill: '#FFEB3B'
    },
    red: {
      stroke: '#7C2855',
      fill: '#D5281B'
    },
    grey: {
      stroke: '#505A5F',
      fill: '#AEB7BD'
    }
  };

  svgColors: { stroke: string; fill: string } = { stroke: '', fill: '' };

  ngOnInit(): void {
    if (!this.customColor) {
      switch (this.type) {
        case 'success':
          this.svgColors = this.svgPaletteData.green;
          break;
        case 'error':
          this.svgColors = this.svgPaletteData.red;
          break;
        case 'edit':
          this.svgColors = this.svgPaletteData.yellow;
      }
    } else {
      this.svgColors = this.svgPaletteData[this.customColor];
    }
  }
}
