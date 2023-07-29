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





