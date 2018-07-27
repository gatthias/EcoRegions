import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ExplorerPage } from '../explorer/explorer';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import * as MapStyle from '../../theme/mapstyle.json';

declare var mapboxgl;

interface Zone {
    code: string;
    name: string;
    $data?: any;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    private selectedZone: Zone;
    private showDetails: Boolean;
    private mapPopup: any;

    //private regions: Observable<any[]>;
    private regions: any;

    constructor(public navCtrl: NavController, afDB: AngularFireDatabase) {
      this.selectedZone = null;
      this.showDetails = false;

      //this.regions = afDB.list('regions').valueChanges();

      afDB.list('regions').snapshotChanges().pipe(
          map((actions: any) =>
              actions.map(a => ({ key: a.key, ...a.payload.val() }))
          )
      ).subscribe(items => {
          this.regions = this.regions || {};
          items.map(d => this.regions[d.key] = d);
          //this.regions = items;
      });
  }

  ionViewDidLoad() {
      /** Map */
      mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F0dGhpYXMiLCJhIjoiY2pjcTRsN3V2MXN3cjMzcm9kNmFmNHZ0OSJ9.TFA4I0fJKmU9Gz_HmuR6iQ';

      var map = new mapboxgl.Map({
          container: 'map',
          style: MapStyle, //styleUrl,//style,
          hash: true
      });

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.on('click', 'ecoregions2017', e => {
          var description = e.features[0].properties.ECO_NAME;
          var eco_code = e.features[0].properties.eco_code.toLowerCase();
          var url = `https://www.worldwildlife.org/ecoregions/${eco_code}`;

          var html = `
          <h3>${description}</h3>
  
          <a href="#" onclick="showDetails()">Details</a>
          <a href="${url}" target="_blank">View</a>
          `;

          this.selectedZone = {
              name: e.features[0].properties.ECO_NAME,
              code: e.features[0].properties.eco_code.toLowerCase()
          };

          this.updateDetailsView(this.selectedZone);

          this.mapPopup = new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(html)
              .addTo(map);
      });
  }

  closeSelection($event: any) {
      $event && $event.srcEvent && $event.srcEvent.stopPropagation && $event.srcEvent.stopPropagation();
      $event && $event.srcEvent && $event.srcEvent.preventDefault && $event.srcEvent.preventDefault();

      this.selectedZone = null;
      if (this.mapPopup)
      {
          this.mapPopup.remove();
      }
      this.mapPopup = null;
  }

  updateDetailsView(selectedZone: Zone) {
      if (this.regions && this.regions[selectedZone.code]) {
          var region = this.regions[selectedZone.code];

          selectedZone.$data = region;
      }
  }

  toggleDetails() {
      this.showDetails = !this.showDetails;
  }

  more() {
      this.navCtrl.push(ExplorerPage, { zone: this.selectedZone });
  }
}
