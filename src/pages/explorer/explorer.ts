import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

export interface DBpediaEntity {
    URI: string;
    types: string[];
    symbols: string[];
}

@IonicPage()
@Component({
  selector: 'page-explorer',
  templateUrl: 'explorer.html',
})
export class ExplorerPage {

  private zone: any;
  private subtab: string;

  private fetchingEntities: boolean;

  private entities: DBpediaEntity[];
  private partialQueries: string[];
  private partialResults: any[];

  private queriedDBpedia: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDB: AngularFireDatabase) {
      this.zone = navParams.get("zone");
      this.subtab = 'wwf';

      this.fetchingEntities = false;
      this.entities = [];
      this.partialQueries = [];
      this.partialResults = [];

      this.queriedDBpedia = false;
  }

  ionViewDidLoad() {
      // Check entities in cache
      this.afDB.list('regions-dbpedia/'+this.zone.code).valueChanges()/*.snapshotChanges().pipe(
          map((actions: any) =>
              actions.map(a => ({ key: a.key, ...a.payload.val() }))
          )
      )*/.subscribe((items: any[]) => {
          if (items.length == 0 && !this.queriedDBpedia)
          {
              this.queryDBpedia();
              this.queriedDBpedia = true;
              return;
          }

          this.entities = items;
        });

      
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

      var myInit: RequestInit = {
          method: 'GET',
          headers: myHeaders,
          cache: 'default'
      };

      var myRequest = new Request(url, myInit);

      fetch(myRequest, myInit)
          .then(response => response.json())
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

      var blacklist = [
          "http://dbpedia.org/resource/WYSIWYG",
          "http://dbpedia.org/resource/Ultralight_aviation",
          "http://dbpedia.org/resource/Uniform_Resource_Locator",
          "http://dbpedia.org/resource/Bad_Ems"
      ];

      finalResources.map(d => {
          if (blacklist.indexOf(d["@URI"]) > -1)
              return;

          if (!dict[d["@URI"]]) {
              dict[d["@URI"]] = d;
              dict[d["@URI"]].symbols = [];
          }

          if (dict[d["@URI"]].symbols.indexOf(d["@surfaceForm"]) == -1) {
              dict[d["@URI"]].symbols.push(d["@surfaceForm"]);
          }

      });

      this.entities = Object.keys(dict).map(k => {
          let e: DBpediaEntity = {
              URI: dict[k]["@URI"],
              types: dict[k]["@types"].split(','),
              symbols: dict[k]["symbols"]
          };

          return e;
      });

      // Save in FB-cache
      let cached = {};
      this.entities.map(e => cached[e.URI.replace("http://dbpedia.org/resource/", "").split('.').join('--')] = e);
      this.afDB.database.ref('regions-dbpedia/' + this.zone.code).set(cached);


      this.fetchingEntities = false;
  }

}
