import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtGridComponent } from './ext-grid.component';

@NgModule({
  imports:         [CommonModule],
  declarations:    [
    ExtGridComponent
  ],
  exports:         [
    ExtGridComponent
  ]
})
export class ExtAngularGridModule { }

