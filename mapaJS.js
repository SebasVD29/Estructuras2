<<<<<<< HEAD
  var myLatLng = { lat: 9.935764, lng: -84.079338 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: myLatLng ,  mapTypeId: google.maps.MapTypeId.ROADMAP, // Utilizar la ubicación actual como el centro del mapa
  });
=======
const coordsCostaRica = { lat: 10.0000000 , lng: -84.0000000 };
const divMapa = document.getElementById('map');
const inputInicio = document.getElementById('inputInicio');
const inputFinal = document.getElementById('inputFinal');
var map;
let marker1,marker2;
let busquedaIncio; 
let busquedaFinal; 



function initMap(){
  map =  new google.maps.Map(divMapa,{
    center: coordsCostaRica,
    zoom: 13,
  });
  
  BusquedaDeLugar();
}

function BusquedaDeLugar(){
  busquedaIncio = new google.maps.places.Autocomplete(inputInicio);

  busquedaIncio.addListener("place_changed", function(){
    const place1 = busquedaIncio.getPlace();
    //console.log(place);
    map.setCenter(place1.geometry.location);
    marker1 = new google.maps.Marker({
      position: place1.geometry.location,
      map: map,
    });
  });

  busquedaFinal = new google.maps.places.Autocomplete(inputFinal);
  busquedaFinal.addListener("place_changed", function(){
    const place2 = busquedaFinal.getPlace();
    marker2 = new google.maps.Marker({
      position: place2.geometry.location,
      map: map,
    });
    
  });

}





>>>>>>> 34a6e1918ad865f4a99ee0526e766ccdc0aa4900
