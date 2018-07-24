import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExplorerPage } from './explorer';

import { TaggedHtmlModule } from './tagged-html.module';

@NgModule({
  declarations: [
      ExplorerPage,
  ],
  imports: [
      TaggedHtmlModule,
      IonicPageModule.forChild(ExplorerPage)
  ],
})
export class ExplorerPageModule {}
