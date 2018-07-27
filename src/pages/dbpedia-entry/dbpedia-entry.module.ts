import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DbpediaEntryPage } from './dbpedia-entry';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DbpediaEntryPage,
  ],
  imports: [
      IonicPageModule.forChild(DbpediaEntryPage),
      ComponentsModule
  ],
})
export class DbpediaEntryPageModule {}
