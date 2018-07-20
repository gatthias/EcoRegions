/**	Bindings */
var data = {};


var $body = $("body");
var $navbar = $('#navbar');
var $btnBack = $navbar.find('.btn-back')[0];
var $map = $('#map');
var $detail = $('#detail');

function showDetails(){
	$body.removeClass('detail-off').addClass('detail-on');
}

function hideDetails(){
	$body.removeClass('detail-on').addClass('detail-off');
}

window.showDetails = showDetails;
window.hideDetails = hideDetails;

function updateDetailsView(eco_code){
	var html = "";
  if(data.regions && data.regions[eco_code])
  {
  	var region = data.regions[eco_code];
  	html += `
    	<h2>${region.name}</h2>
    	<div>
      	${region.content}
      </div>
    `;
  }
  
  $detail.html(html);
  
  var text = "";
  
  $detail.find('p').each((idx, el) => {
  	text += $(el).text() + "\n";
  });
  
  
  //text += $detail.find('p')[0] ? $($detail.find('p')[0]).text() : "";
  
  if(text.length == 0) return;
  
  var query = encodeURIComponent(text);
  
  if(query.length > 5000){
  	query = query.slice(0, 5000);
  }
 
  var url = `https://api.dbpedia-spotlight.org/en/annotate?text=${query}`;

  var myHeaders = new Headers();
	myHeaders.append("accept", "application/json");
  
  var myInit = { method: 'GET',
                 headers: myHeaders,
                 //mode: 'no-cors',
                 cache: 'default' };

  var myRequest = new Request(url, myInit);

  fetch(myRequest,myInit)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    console.log(json);
    
    
    html += `
    	<h2>Data</h2>
      <h3>Places</h3>
			<ul>
      	${
        	json.Resources
          	.filter(d => d["@types"].split(',').indexOf("DBpedia:Place") > -1)
            .map(d => `
            	<li>
            		<a href="${d["@URI"]}">${d["@surfaceForm"]}</a>
                </li>`
            )
            .join('')
        }
      </ul>

      <h3>Animals</h3>
      <ul>
      	${
        	json.Resources
          	.filter(d => d["@types"].split(',').indexOf("DBpedia:Animal") > -1)
            .map(d => `
            	<li>
            		<a href="${d["@URI"]}">${d["@surfaceForm"]}</a>
                </li>`
            )
            .join('')
        }
      </ul>
      
      <h3>Plants</h3>
      <ul>
      	${
        	json.Resources
          	.filter(d => d["@types"].split(',').indexOf("DBpedia:Plant") > -1)
            .map(d => `
            	<li>
            		<a href="${d["@URI"]}">${d["@surfaceForm"]}</a>
                </li>`
            )
            .join('')
        }
      </ul>
      
    `;
    
    $detail.html(html);
  });
}



/** Map */
var style = {"version":8,"name":"EcoZones","metadata":{"mapbox:origin":"basic-template-v1","mapbox:autocomposite":true,"mapbox:type":"template","mapbox:sdk-support":{"js":"0.45.0","android":"6.0.0","ios":"4.0.0"}},"center":[50.45673673905833,40.68645011618756],"zoom":3.2071464707588815,"bearing":0,"pitch":0,"sources":{"mapbox://mapbox.satellite":{"url":"mapbox://mapbox.satellite","type":"raster","tileSize":256},"composite":{"url":"mapbox://gatthias.6yy30oi9,gatthias.dea0zgkt","type":"vector"}},"sprite":"mapbox://sprites/gatthias/cjix2tz127yof2rno8whtftdb","glyphs":"mapbox://fonts/gatthias/{fontstack}/{range}.pbf","layers":[{"type":"raster","paint":{},"layout":{"visibility":"visible"},"id":"mapbox-satellite","source":"mapbox://mapbox.satellite"},{"minzoom":3,"layout":{"visibility":"visible"},"filter":["==","$type","Polygon"],"type":"fill","source":"composite","id":"ecoregions2017","paint":{"fill-opacity":0.69,"fill-color":["interpolate",["linear"],["get","ECO_SYM"],12,"hsl(151, 73%, 8%)",887,"hsl(88, 100%, 50%)"]},"source-layer":"teow-9cikvy"},{"minzoom":5,"layout":{"visibility":"visible","text-field":["to-string",["get","ECO_NAME"]],"text-size":12},"filter":["==","$type","Polygon"],"type":"symbol","source":"composite","id":"ecoregionsNames","paint":{"text-color":"hsl(0, 0%, 100%)","text-halo-width":1,"text-halo-blur":0},"source-layer":"Ecoregions2017"}],"created":"2018-06-27T12:09:01.361Z","id":"cjix2tz127yof2rno8whtftdb","modified":"2018-07-20T14:23:23.851Z","owner":"gatthias","visibility":"private","draft":false};
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
  var url = `https://www.worldwildlife.org/ecoregions/${eco_code}`;
  
	var html = `
  <h3>${description}</h3>
  
  <a href="#" onclick="showDetails()">Details</a>
  <a href="${url}" target="_blank">View</a>
  `;
    
  updateDetailsView(eco_code);
  
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(html)
    .addTo(map);
});




/** Data */
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDHHyyv-Gu2DdvcHEDo2E4yURXTU0-GdXg",
  authDomain: "ecoregions-d6961.firebaseapp.com",
  databaseURL: "https://ecoregions-d6961.firebaseio.com",
  projectId: "ecoregions-d6961",
  storageBucket: "ecoregions-d6961.appspot.com",
  messagingSenderId: "877054478831"
};
firebase.initializeApp(config);

var all = [];

firebase.database().ref('/').once('value').then(function(snapshot) {
	all = snapshot.val();
  if(all.init != true && all.map != null)
  {
  	// Init db
    var db = {
      init: true,
      biomes: [],
      regions: {}
    };

    all.map(d => {
      if(d.type == "biome")
      {
        db.biomes.push(d);
      }
      else if(d.type == "ecoregion")
      {
        db.regions[d.code] = d;
      }
    });

    console.log(db);
  
  	firebase.database().ref('/').set(db);
    all = db;
  }
  
  data = all;
  
});


