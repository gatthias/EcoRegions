webpackJsonp([0],{

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExplorerPageModule", function() { return ExplorerPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__explorer__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tagged_html_module__ = __webpack_require__(474);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var ExplorerPageModule = /** @class */ (function () {
    function ExplorerPageModule() {
    }
    ExplorerPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__explorer__["a" /* ExplorerPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_3__tagged_html_module__["a" /* TaggedHtmlModule */],
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__explorer__["a" /* ExplorerPage */])
            ],
        })
    ], ExplorerPageModule);
    return ExplorerPageModule;
}());

//# sourceMappingURL=explorer.module.js.map

/***/ }),

/***/ 182:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 182;

/***/ }),

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/explorer/explorer.module": [
		126
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 223;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExplorerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the ExplorerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ExplorerPage = /** @class */ (function () {
    function ExplorerPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.zone = navParams.get("zone");
        this.subtab = 'wwf';
        this.fetchingEntities = false;
        this.entities = [];
        this.partialQueries = [];
        this.partialResults = [];
    }
    ExplorerPage.prototype.ionViewDidLoad = function () {
        this.queryDBpedia();
    };
    ExplorerPage.prototype.queryDBpedia = function () {
        var text = (this.zone.$data || {}).content || "";
        if (text.length == 0)
            return;
        var query = encodeURIComponent(text);
        var lim = 5000;
        while (query.length > 0) {
            if (query.length > lim) {
                var head = query.slice(0, lim);
                var tail = query.slice(lim);
                this.partialQueries.push(head);
                query = tail;
            }
            else {
                this.partialQueries.push(query);
                query = '';
            }
        }
        this.fetchingEntities = true;
        this.queryNextTextPart();
    };
    ExplorerPage.prototype.queryNextTextPart = function () {
        var _this = this;
        if (this.partialQueries.length <= this.partialResults.length) {
            return;
        }
        var q = this.partialQueries[this.partialResults.length];
        var url = "https://api.dbpedia-spotlight.org/en/annotate?text=" + q;
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        var myInit = {
            method: 'GET',
            headers: myHeaders,
            cache: 'default'
        };
        var myRequest = new Request(url, myInit);
        fetch(myRequest, myInit)
            .then(function (response) {
            return response.json();
        })
            .then(function (json) { return _this.onTextPartEntitiesReceived(json); });
    };
    ExplorerPage.prototype.onTextPartEntitiesReceived = function (res) {
        this.partialResults.push(res);
        if (this.partialQueries.length > this.partialResults.length) {
            this.queryNextTextPart();
        }
        else {
            this.finalizeTextEntities();
        }
    };
    ExplorerPage.prototype.finalizeTextEntities = function () {
        var finalResources = this.partialResults.reduce(function (prev, cur) { return prev.concat(cur.Resources); }, []);
        var dict = {};
        finalResources.map(function (d) {
            if (!dict[d["@URI"]]) {
                dict[d["@URI"]] = d;
                dict[d["@URI"]].symbols = [];
            }
            if (dict[d["@URI"]].symbols.indexOf(d["@surfaceForm"]) == -1) {
                dict[d["@URI"]].symbols.push(d["@surfaceForm"]);
            }
        });
        console.log(dict);
        this.entities = Object.keys(dict).map(function (k) { return dict[k]; });
        this.fetchingEntities = false;
        //this.destroyComponent();
        //this.createComponentFromRaw(this.html);
    };
    ExplorerPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-explorer',template:/*ion-inline-start:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\explorer\explorer.html"*/'﻿<!--\n  Generated template for the ExplorerPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>EcoRegion</ion-title>\n\n    <ion-buttons end>\n\n      <ion-spinner *ngIf="fetchingEntities" name="crescent"></ion-spinner>\n\n    </ion-buttons>\n  </ion-navbar>\n\n  \n  \n\n</ion-header>\n\n\n<ion-content >\n  <div ion-fixed class="sub-tabs">\n\n    <ion-segment [(ngModel)]="subtab" mode="md">\n\n      <ion-segment-button value="wwf">\n\n        WWF\n\n      </ion-segment-button>\n\n      <ion-segment-button value="entities">\n\n        Entities\n\n      </ion-segment-button>\n\n    </ion-segment>\n\n  </div>\n\n  <div [ngSwitch]="subtab">\n\n    <div *ngSwitchCase="\'wwf\'" padding>\n      <h3>{{zone?.name}}</h3>\n\n      <!--<div [innerHTML]="zone?.$data?.content">\n\n      </div>-->\n      <!--<tagged-keyword kw="Hello World"></tagged-keyword>-->\n      <tagged-html [html]="zone?.$data?.content" [entities]="entities"></tagged-html>\n\n    </div>\n\n\n\n    <ion-list *ngSwitchCase="\'entities\'">\n\n      <ion-item *ngFor="let entity of entities">\n        <ion-label>\n          {{ entity["@surfaceForm"] }}\n          <ion-note end right>\n\n            <a [href]="entity[\'@URI\']">View</a>\n\n          </ion-note>\n        </ion-label>\n      </ion-item>\n\n    </ion-list>\n\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\explorer\explorer.html"*/,
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */]) === "function" && _b || Object])
    ], ExplorerPage);
    return ExplorerPage;
    var _a, _b;
}());

//# sourceMappingURL=explorer.js.map

/***/ }),

/***/ 268:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__about_about__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__contact_contact__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(271);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TabsPage = /** @class */ (function () {
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_1__about_about__["a" /* AboutPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_2__contact_contact__["a" /* ContactPage */];
    }
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\tabs\tabs.html"*/'<ion-tabs>\n  <ion-tab [root]="tab1Root" tabTitle="Home" tabIcon="home"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="About" tabIcon="information-circle"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="Contact" tabIcon="contacts"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 269:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\about\about.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      About\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\about\about.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ContactPage = /** @class */ (function () {
    function ContactPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-contact',template:/*ion-inline-start:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\contact\contact.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Contact\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <ion-list-header>Follow us on Twitter</ion-list-header>\n    <ion-item>\n      <ion-icon name="ionic" item-start></ion-icon>\n      @ionicframework\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\contact\contact.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]])
    ], ContactPage);
    return ContactPage;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__explorer_explorer__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operators__ = __webpack_require__(30);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, afDB) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.selectedZone = null;
        this.showDetails = false;
        //this.regions = afDB.list('regions').valueChanges();
        afDB.list('regions').snapshotChanges().pipe(Object(__WEBPACK_IMPORTED_MODULE_4_rxjs_operators__["map"])(function (actions) {
            return actions.map(function (a) { return (__assign({ key: a.key }, a.payload.val())); });
        })).subscribe(function (items) {
            _this.regions = _this.regions || {};
            items.map(function (d) { return _this.regions[d.key] = d; });
            //this.regions = items;
        });
    }
    HomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
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
        map.on('click', 'ecoregions2017', function (e) {
            var description = e.features[0].properties.ECO_NAME;
            var eco_code = e.features[0].properties.eco_code.toLowerCase();
            var url = "https://www.worldwildlife.org/ecoregions/" + eco_code;
            var html = "\n          <h3>" + description + "</h3>\n  \n          <a href=\"#\" onclick=\"showDetails()\">Details</a>\n          <a href=\"" + url + "\" target=\"_blank\">View</a>\n          ";
            _this.selectedZone = {
                name: e.features[0].properties.ECO_NAME,
                code: e.features[0].properties.eco_code.toLowerCase()
            };
            _this.updateDetailsView(_this.selectedZone);
            _this.mapPopup = new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(html)
                .addTo(map);
        });
    };
    HomePage.prototype.closeSelection = function ($event) {
        $event && $event.srcEvent && $event.srcEvent.stopPropagation && $event.srcEvent.stopPropagation();
        $event && $event.srcEvent && $event.srcEvent.preventDefault && $event.srcEvent.preventDefault();
        this.selectedZone = null;
        if (this.mapPopup) {
            this.mapPopup.remove();
        }
        this.mapPopup = null;
    };
    HomePage.prototype.updateDetailsView = function (selectedZone) {
        if (this.regions && this.regions[selectedZone.code]) {
            var region = this.regions[selectedZone.code];
            selectedZone.$data = region;
        }
    };
    HomePage.prototype.toggleDetails = function () {
        this.showDetails = !this.showDetails;
    };
    HomePage.prototype.more = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__explorer_explorer__["a" /* ExplorerPage */], { zone: this.selectedZone });
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\home\home.html"*/'﻿<ion-header>\n  <ion-navbar>\n    <ion-buttons start>\n\n      <button ion-button clear color="dark" (tap)="toggleDetails()" *ngIf="showDetails">\n\n        Back\n\n      </button>\n    </ion-buttons>\n\n    <ion-title>Home</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button clear color="dark" (tap)="more()" *ngIf="showDetails">\n\n        More\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n</ion-header>\n\n<ion-content [class.detail-off]="!showDetails" [class.detail-on]="showDetails">\n  <ion-list ion-fixed class="selection-ribbon" *ngIf="selectedZone">\n    <ion-item-sliding>\n      <ion-item>\n        <div class="text">\n\n          {{ selectedZone.name }}\n\n        </div>\n\n        <button ion-button clear class="btn-details" (tap)="toggleDetails()">\n\n          <ion-icon name="eye"></ion-icon>\n\n        </button>\n\n        \n      </ion-item>\n      <ion-item-options side="right">\n\n        <button ion-button class="btn-close" (tap)="closeSelection($event)" color="dark">\n\n          <ion-icon name="close"></ion-icon>\n\n        </button>\n\n      </ion-item-options>\n    </ion-item-sliding>\n  </ion-list>\n  <div id="map"></div>\n  <div id="detail">\n    <h3>{{ selectedZone?.name }}</h3>\n    <div [innerHTML]="selectedZone?.$data?.content">\n\n    </div>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__["a" /* AngularFireDatabase */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(406);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 406:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export firebaseConfig */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(449);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_about_about__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__ = __webpack_require__(268);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_explorer_explorer_module__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_angularfire2__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angularfire2_database__ = __webpack_require__(272);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













var firebaseConfig = {
    apiKey: "AIzaSyDHHyyv-Gu2DdvcHEDo2E4yURXTU0-GdXg",
    authDomain: "ecoregions-d6961.firebaseapp.com",
    databaseURL: "https://ecoregions-d6961.firebaseio.com",
    projectId: "ecoregions-d6961",
    storageBucket: "ecoregions-d6961.appspot.com",
    messagingSenderId: "877054478831"
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/explorer/explorer.module#ExplorerPageModule', name: 'ExplorerPage', segment: 'explorer', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_11_angularfire2__["a" /* AngularFireModule */].initializeApp(firebaseConfig),
                __WEBPACK_IMPORTED_MODULE_12_angularfire2_database__["b" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_8__pages_explorer_explorer_module__["ExplorerPageModule"]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_12_angularfire2_database__["a" /* AngularFireDatabase */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 449:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__ = __webpack_require__(268);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__["a" /* TabsPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\Users\gatth\Documents\Programmation\Javascript\ecoregions\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 474:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TaggedHtmlModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tagged_html__ = __webpack_require__(475);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var TaggedHtmlModule = /** @class */ (function () {
    function TaggedHtmlModule() {
    }
    TaggedHtmlModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_1__tagged_html__["a" /* TaggedHtml */],
                __WEBPACK_IMPORTED_MODULE_1__tagged_html__["b" /* TaggedKeyword */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__tagged_html__["a" /* TaggedHtml */],
                __WEBPACK_IMPORTED_MODULE_1__tagged_html__["b" /* TaggedKeyword */]
            ],
            imports: [],
        })
    ], TaggedHtmlModule);
    return TaggedHtmlModule;
}());

//# sourceMappingURL=tagged-html.module.js.map

/***/ }),

/***/ 475:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TaggedHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TaggedKeyword; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tagged_html_module__ = __webpack_require__(474);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TaggedHtml = /** @class */ (function () {
    function TaggedHtml(compiler, injector, moduleRef) {
        this.compiler = compiler;
        this.injector = injector;
        this.moduleRef = moduleRef;
        this.entities = [];
        //this.partialQueries = [];
        //this.partialResults = [];
    }
    //ngAfterViewInit() {
    //    if(this.html && this.html.length > 0)
    //        this.createComponentFromRaw(this.html);
    //}
    TaggedHtml.prototype.ngOnChanges = function (changes) {
        if (changes.entities || changes.html) {
            this.refreshComponent();
        }
    };
    TaggedHtml.prototype.refreshComponent = function () {
        this.destroyComponent();
        if (this.html && this.html.length > 0)
            this.createComponentFromRaw(this.html);
    };
    // Here we create the component.
    TaggedHtml.prototype.createComponentFromRaw = function (template) {
        // Let's say your template looks like `<h2><some-component [data]="data"></some-component>`
        // As you see, it has an (existing) angular component `some-component` and it injects it [data]
        var _this = this;
        var styles = [
            "tagged-keyword{ \n            background: #f2fff2;\n            padding: 3px 5px;\n            margin: 1px 0;\n            display: inline-block;\n            border-radius: 3px;\n            border: 1px solid green;\n            border-style: dashed;\n          }"
        ];
        // Transform html
        //this.entities
        //    .filter(d => d["@types"].split(',').indexOf("DBpedia:Place") > -1 || d["@types"].split(',').indexOf("DBpedia:Animal") > -1 || d["@types"].split(',').indexOf("DBpedia:Plant") > -1)
        //    .map(entity => {
        //    entity.symbols.map(symbol => {
        //        //template = template.split(symbol).join(`<tagged-keyword kw="${symbol}"></tagged-keyword>`);
        //        const re = new RegExp(symbol, 'gi');
        //        const match = template.match(re);
        //        // If there's no match, just return the original value.
        //        if (!match) {
        //            return;
        //        }
        //        template = template.replace(re, `<tagged-keyword kw="${symbol}"></tagged-keyword>`)
        //    })
        //})
        //this.entities
        //    .filter(d => d["@types"].split(',').indexOf("DBpedia:Place") > -1 || d["@types"].split(',').indexOf("DBpedia:Animal") > -1 || d["@types"].split(',').indexOf("DBpedia:Plant") > -1)
        //    .map(entity => {
        //        const symbol = entity["@surfaceForm"];
        //        const re = new RegExp(symbol, 'gi');
        //        const match = template.match(re);
        //        // If there's no match, just return the original value.
        //        if (!match) {
        //            return;
        //        }
        //        template = template.replace(re, `<tagged-keyword kw="${symbol}"></tagged-keyword>`)
        //    })
        var filteredEntities = [];
        if (this.entities.length > 0) {
            filteredEntities = this.entities.filter(function (d) { return d["@types"].split(',').indexOf("DBpedia:Place") > -1 || d["@types"].split(',').indexOf("DBpedia:Animal") > -1 || d["@types"].split(',').indexOf("DBpedia:Plant") > -1; });
            var multiquery = filteredEntities
                .reduce(function (prev, entity, i) { prev += i > 0 ? "|" + entity["@surfaceForm"] : entity["@surfaceForm"]; return prev; }, "");
            var dict = {};
            filteredEntities.map(function (d) { return dict[d["@surfaceForm"]] = d; });
            //const symbol = entity["@surfaceForm"];
            var re = new RegExp(multiquery, 'gi');
            var match = template.match(re);
            template = template.replace(re, function (co) { return "<tagged-keyword kw=\"" + co + "\" [entity]=\"entities['" + co + "']\"></tagged-keyword>"; });
        }
        var filteredEntitiesDict = {};
        filteredEntities.map(function (d) { return filteredEntitiesDict[d["@surfaceForm"]] = d; });
        // Now we create a new component. It has that template, and we can even give it data.
        var tmpCmp = Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({ template: template, styles: styles })(/** @class */ (function () {
            function class_1() {
                // the class is anonymous. But it's a quite regular angular class. You could add @Inputs,
                // @Outputs, inject stuff etc.
                this.entities = filteredEntitiesDict;
            }
            class_1.prototype.ngOnInit = function () { };
            return class_1;
        }()));
        // Now, also create a dynamic module.
        var tmpModule = Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            imports: [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(tmpCmp), __WEBPACK_IMPORTED_MODULE_2__tagged_html_module__["a" /* TaggedHtmlModule */]],
            entryComponents: [],
            declarations: [tmpCmp],
        })(/** @class */ (function () {
            function class_2() {
            }
            return class_2;
        }()));
        // Now compile this module and component, and inject it into that #vc in your current component template.
        this.compiler.compileModuleAndAllComponentsAsync(tmpModule)
            .then(function (factories) {
            var factoryIdx = factories.componentFactories.length - 1;
            var f = factories.componentFactories[factoryIdx];
            _this.cmpRef = f.create(_this.injector, [], null, _this.moduleRef);
            _this.cmpRef.instance.name = 'tagged-html-inst';
            _this.vc.insert(_this.cmpRef.hostView);
        });
    };
    // Cleanup properly. You can add more cleanup-related stuff here.
    TaggedHtml.prototype.ngOnDestroy = function () {
        this.destroyComponent();
    };
    TaggedHtml.prototype.destroyComponent = function () {
        this.vc.clear();
        if (this.cmpRef) {
            //var idx = this.vc.indexOf(this.cmpRef.hostView);
            //this.vc.remove(idx);
            //debugger;
            this.cmpRef.destroy();
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('vc', { read: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewContainerRef */] }),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewContainerRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["_10" /* ViewContainerRef */]) === "function" && _a || Object)
    ], TaggedHtml.prototype, "vc", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])(),
        __metadata("design:type", String)
    ], TaggedHtml.prototype, "html", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])(),
        __metadata("design:type", Array)
    ], TaggedHtml.prototype, "entities", void 0);
    TaggedHtml = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'tagged-html',
            template: "<div #vc></div>"
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* Compiler */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* Compiler */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injector */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injector */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModuleRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* NgModuleRef */]) === "function" && _d || Object])
    ], TaggedHtml);
    return TaggedHtml;
    var _a, _b, _c, _d;
}());

var TaggedKeyword = /** @class */ (function () {
    function TaggedKeyword(alertCtrl) {
        this.alertCtrl = alertCtrl;
    }
    TaggedKeyword.prototype.alert = function (msg) {
        console.log(this.entity);
        var alert = this.alertCtrl.create({
            title: this.kw,
            subTitle: this.entity["@URI"],
            buttons: ['OK']
        });
        alert.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])(),
        __metadata("design:type", String)
    ], TaggedKeyword.prototype, "kw", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])(),
        __metadata("design:type", Object)
    ], TaggedKeyword.prototype, "entity", void 0);
    TaggedKeyword = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'tagged-keyword',
            template: "<span class=\"keyword\" (click)=\"alert(kw)\">{{kw}}</span>"
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]) === "function" && _a || Object])
    ], TaggedKeyword);
    return TaggedKeyword;
    var _a;
}());

//# sourceMappingURL=tagged-html.js.map

/***/ })

},[283]);
//# sourceMappingURL=main.js.map