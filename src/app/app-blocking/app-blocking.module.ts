import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockPageComponent } from './blockpage/blockpage.component';
import { Quotes } from './services/quotes';

@NgModule({
  declarations: [
    BlockPageComponent,
  ],
  imports: [
    CommonModule
  ],
  providers: [Quotes]
})
export class AppBlockingModule { }
