import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dbpedia-entry',
  templateUrl: 'dbpedia-entry.html',
})
export class DbpediaEntryPage {
  private entry: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
      this.entry = navParams.get("entry");
  }

  close() {
      this.viewCtrl.dismiss();
  }

}
