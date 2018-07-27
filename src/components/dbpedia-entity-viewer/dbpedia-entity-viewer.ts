import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DBpediaEntity } from '../../pages/explorer/explorer';

interface DBpediaEntry extends DBpediaEntity {
    "dbo:abstract"?: string;
    "dbo:thumbnail"?: string;
    "rdfs:label"?: string;
    "foaf:isPrimaryTopicOf"?: string[];
};

@Component({
  selector: 'dbpedia-entity-viewer',
  templateUrl: 'dbpedia-entity-viewer.html'
})
export class DbpediaEntityViewerComponent implements OnInit {
  @Input() entity: DBpediaEntity;

  private entry: DBpediaEntry;
  private fetching: boolean;
  constructor(private http: HttpClient) {
      this.entry = null;
      this.fetching = false;
  }

  ngOnInit() {
      if (!this.entity || !this.entity.URI || this.entity.URI.length == 0)
          return;

      this.fetching = true;
      this.getData()
          .subscribe(data => {
              this.fetching = false;
              this.entry = this.transformData(data);
          })
  }

  getData() {
      const dataUrl = this.entity.URI.replace('resource', 'data') + ".json";
      
      return this.http.get(dataUrl);
  }

  transformData(data: any): DBpediaEntry {

      let ent = data[this.entity.URI];

      if (!ent) return this.entity;

      const prefixes = {
          dbo: "http://dbpedia.org/ontology/",
          dbp: "http://dbpedia.org/property/",
          rdfs: "http://www.w3.org/2000/01/rdf-schema#",
          foaf: "http://xmlns.com/foaf/0.1/"
      }

      const abstract = ((ent[prefixes.dbo + "abstract"] || []).filter(d => d.lang == "en")[0] || {}).value;
      const thumbnail = ((ent[prefixes.dbo + "thumbnail"] || [])[0] || {}).value;
      const label = ((ent[prefixes.rdfs + "label"] || []).filter(d => d.lang == "en")[0] || {}).value;
      const links = ((ent[prefixes.foaf + "isPrimaryTopicOf"]) || []).map(d => d.value);

      return {
          "dbo:abstract": abstract,
          "dbo:thumbnail": thumbnail,
          "rdfs:label": label,
          "foaf:isPrimaryTopicOf": links,
          ...this.entity
      }
  }


  openLink(link: string) {

  }
}
