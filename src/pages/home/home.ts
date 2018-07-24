import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ExplorerPage } from '../explorer/explorer';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

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
      var style = { "version": 8, "name": "EcoZones", "metadata": { "mapbox:origin": "basic-template-v1", "mapbox:autocomposite": true, "mapbox:type": "template", "mapbox:sdk-support": { "js": "0.45.0", "android": "6.0.0", "ios": "4.0.0" } }, "center": [50.45673673905833, 40.68645011618756], "zoom": 3.2071464707588815, "bearing": 0, "pitch": 0, "sources": { "mapbox://mapbox.satellite": { "url": "mapbox://mapbox.satellite", "type": "raster", "tileSize": 256 }, "composite": { "url": "mapbox://gatthias.6yy30oi9,gatthias.dea0zgkt", "type": "vector" } }, "sprite": "mapbox://sprites/gatthias/cjix2tz127yof2rno8whtftdb", "glyphs": "mapbox://fonts/gatthias/{fontstack}/{range}.pbf", "layers": [{ "type": "raster", "paint": {}, "layout": { "visibility": "visible" }, "id": "mapbox-satellite", "source": "mapbox://mapbox.satellite" }, { "minzoom": 3, "layout": { "visibility": "visible" }, "filter": ["==", "$type", "Polygon"], "type": "fill", "source": "composite", "id": "ecoregions2017", "paint": { "fill-opacity": 0.69, "fill-color": ["interpolate", ["linear"], ["get", "ECO_SYM"], 12, "hsl(151, 73%, 8%)", 887, "hsl(88, 100%, 50%)"] }, "source-layer": "teow-9cikvy" }, { "minzoom": 5, "layout": { "visibility": "visible", "text-field": ["to-string", ["get", "ECO_NAME"]], "text-size": 12 }, "filter": ["==", "$type", "Polygon"], "type": "symbol", "source": "composite", "id": "ecoregionsNames", "paint": { "text-color": "hsl(0, 0%, 100%)", "text-halo-width": 1, "text-halo-blur": 0 }, "source-layer": "Ecoregions2017" }], "created": "2018-06-27T12:09:01.361Z", "id": "cjix2tz127yof2rno8whtftdb", "modified": "2018-07-20T14:23:23.851Z", "owner": "gatthias", "visibility": "private", "draft": false };

      mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F0dGhpYXMiLCJhIjoiY2pjcTRsN3V2MXN3cjMzcm9kNmFmNHZ0OSJ9.TFA4I0fJKmU9Gz_HmuR6iQ';

      var map = new mapboxgl.Map({
          container: 'map',
          style: style,
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
