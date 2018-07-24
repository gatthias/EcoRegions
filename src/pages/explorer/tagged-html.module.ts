import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TaggedHtml, TaggedKeyword } from './tagged-html';

@NgModule({
    declarations: [
        TaggedHtml,
        TaggedKeyword
    ],
    exports: [
        TaggedHtml,
        TaggedKeyword
    ],
    imports: [
        //IonicPageModule.forChild(TaggedHtml)
    ],
})
export class TaggedHtmlModule { }