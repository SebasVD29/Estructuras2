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
  calcularPonderado();
  calculateDistance();
  calculateTimeOfArrival();
  calculateWeightedCost();
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
      // Almacenar las coordenadas de la posición inicial.
      position1 = {
        lat: place1.geometry.location.lat(),
        lng: place1.geometry.location.lng(),
      };
  });

  busquedaFinal = new google.maps.places.Autocomplete(inputFinal);
  busquedaFinal.addListener("place_changed", function(){
    const place2 = busquedaFinal.getPlace();
    marker2 = new google.maps.Marker({
      position: place2.geometry.location,
      map: map,
    });
    position2 = {
      lat: place2.geometry.location.lat(),
      lng: place2.geometry.location.lng(),
    };
  });

}


// Funcion para calcular la distancia entre dos puntos utilizando la API de Google Maps
function calculateDistance(position1, position2) {
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(position1.lat, position1.lng),
    new google.maps.LatLng(position2.lat, position2.lng)
  );

  return distance;
}



// Funcion para obtener la ruta y el tiempo de llegada entre dos puntos utilizando la API de Direcciones de Google Maps
function calculateTimeOfArrival(position1, position2) {
  const directionsService = new google.maps.DirectionsService();

  const request = {
    origin: new google.maps.LatLng(position1.lat, position1.lng),
    destination: new google.maps.LatLng(position2.lat, position2.lng),
    travelMode: google.maps.TravelMode.DRIVING,
  };

  return new Promise((resolve, reject) => {
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        const durationInSeconds = result.routes[0].legs[0].duration.value;
        const durationInMinutes = Math.round(durationInSeconds / 60); // Convertir segundos a minutos
        resolve(durationInMinutes);
      } else {
        reject(new Error("Error al obtener la ruta."));
      }
    });
  });
}


// Funcion para calcular el costo ponderado entre distancia y tiempo
function calculateWeightedCost(distance, timeInMinutes) {
  const distanceWeight = 0.5;
  const timeWeight = 0.5;

  const distanceInKm = distance / 1000;
  const timeInMinutes = timeInMinutes / 60;

  const weightedCost = distanceInKm * distanceWeight + timeInMinutes * timeWeight;

  return weightedCost;
}

// Funcion para calcular y mostrar el costo ponderado en la página
function calcularPonderado() {
  const position1 = {
    lat: marker1.getPosition().lat(),
    lng: marker1.getPosition().lng(),
  };

  const position2 = {
    lat: marker2.getPosition().lat(),
    lng: marker2.getPosition().lng(),
  };

  const distance = calculateDistance(position1, position2);
  const timeInMinutes = calculateTimeOfArrival(position1, position2);

  Promise.all([distance, timeInMinutes])
    .then(([distance, timeInMinutes]) => {
      const weightedCost = calculateWeightedCost(distance, timeInMinutes);

      // Mostrar resultados en la pagina
      document.getElementById("distanceResult").textContent = distance.toFixed(2);
      document.getElementById("timeResult").textContent = timeInMinutes;
      document.getElementById("weightedCostResult").textContent = weightedCost.toFixed(2);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}





