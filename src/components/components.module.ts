import { NgModule } from '@angular/core';
import { DbpediaEntityViewerComponent } from './dbpedia-entity-viewer/dbpedia-entity-viewer';

import { IonicPageModule } from 'ionic-angular';

@NgModule({
	declarations: [DbpediaEntityViewerComponent],
    imports: [IonicPageModule.forChild(DbpediaEntityViewerComponent)],
	exports: [DbpediaEntityViewerComponent]
})
export class ComponentsModule {}
