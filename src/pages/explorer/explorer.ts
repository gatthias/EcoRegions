import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExplorerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-explorer',
  templateUrl: 'explorer.html',
})
export class ExplorerPage {

  private zone: any;
  private subtab: string;

  private fetchingEntities: boolean;

  private entities: any[];
  private partialQueries: string[];
  private partialResults: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.zone = navParams.get("zone");
      this.subtab = 'wwf';

      this.fetchingEntities = false;
      this.entities = [];
      this.partialQueries = [];
      this.partialResults = [];
  }

  ionViewDidLoad() {
      this.queryDBpedia();
  }


  queryDBpedia() {
      var text = (this.zone.$data || {}).content || "";

      if (text.length == 0) return;

      var query = encodeURIComponent(text);

      var lim = 5000;
      while (query.length > 0) {
          if (query.length > lim) {
              var head = query.slice(0, lim);
              var tail = query.slice(lim);
              this.partialQueries.push(head);
              query = tail;
          } else {
              this.partialQueries.push(query);
              query = '';
          }
      }

      this.fetchingEntities = true;
      this.queryNextTextPart();
  }

  queryNextTextPart() {
      if (this.partialQueries.length <= this.partialResults.length) {
          return;
      }

      var q = this.partialQueries[this.partialResults.length];

      var url = `https://api.dbpedia-spotlight.org/en/annotate?text=${q}`;

      var myHeaders = new Headers();
      myHeaders.append("accept", "application/json");

      var myInit = {
          method: 'GET',
          headers: myHeaders,
          cache: 'default'
      };

      var myRequest = new Request(url, myInit);

      fetch(myRequest, myInit)
          .then(response => {
              return response.json();
          })
          .then(json => this.onTextPartEntitiesReceived(json));
  }

  onTextPartEntitiesReceived(res) {
      this.partialResults.push(res);

      if (this.partialQueries.length > this.partialResults.length) {
          this.queryNextTextPart();
      }
      else {
          this.finalizeTextEntities();
      }

  }

  finalizeTextEntities() {
      var finalResources = this.partialResults.reduce((prev, cur) => prev.concat(cur.Resources), []);


      var dict = {};

      finalResources.map(d => {
          if (!dict[d["@URI"]]) {
              dict[d["@URI"]] = d;
              dict[d["@URI"]].symbols = [];
          }

          if (dict[d["@URI"]].symbols.indexOf(d["@surfaceForm"]) == -1) {
              dict[d["@URI"]].symbols.push(d["@surfaceForm"]);
          }

      });

      console.log(dict);

      this.entities = Object.keys(dict).map(k => dict[k]);

      this.fetchingEntities = false;

      //this.destroyComponent();
      //this.createComponentFromRaw(this.html);
  }

}
