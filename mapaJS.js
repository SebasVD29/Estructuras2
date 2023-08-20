const coordsCostaRica = { lat: 10.0000000, lng: -84.0000000 };
const divMapa = document.getElementById('map');
const inputInicio = document.getElementById('inputInicio');
const inputFinal = document.getElementById('inputFinal');
const inputParada = document.getElementById('inputParada');
const inputsParada = document.getElementById('inputsParada');
// archivo1.js

let map;


let marker1, marker2,marker3,marker4;

let position1, position2,position3,position4; // Variables para almacenar las coordenadas de la posición inicial y final.
let usuario;
let ponderado, tiempo;


var viajes;
//inputInicio = document.getElementById('inputInicio');
//inputFinal = document.getElementById('inputFinal');
//var nodos, aristas;
// archivo2.js
let service;
let locations;
let positionInicio;

fetch("/datos-viajes")
  .then((response) => response.json())
  .then((data) => {
    viajes = data;
    console.log("Datos ", viajes);

    arbol();
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });
  function initMap() {
    map = new google.maps.Map(divMapa, {
      center: coordsCostaRica,
      zoom: 13,
     // center: { lat: parseFloat(lat), lng: parseFloat(lng) }
    });
  
  
    BusquedaDeLugar();
  }

  function BusquedaDeLugar() {
    console.log('Inicio',inputInicio.value  ,'Destino', inputFinal.value)
    const busquedaIncio = new google.maps.places.Autocomplete(inputInicio);
    const busquedaFinal = new google.maps.places.Autocomplete(inputFinal);
    const busquedaParada = new google.maps.places.Autocomplete(inputParada);
    const busquedaSParada = new google.maps.places.Autocomplete(inputsParada);
    console.log('Inicio',busquedaIncio  ,'Destino', busquedaFinal)
  
    busquedaIncio.addListener("place_changed", function () {
      const place1 = busquedaIncio.getPlace();
      if (!place1.geometry) {
        return; // Si no se seleccionó una ubicación válida, salir de la función
      }
      map.setCenter(place1.geometry.location);
      if (marker1) {
        marker1.setMap(null); // Remover el marcador anterior, si existe
      }
      marker1 = new google.maps.Marker({
        position: place1.geometry.location,
        map: map,
      });
      // Almacenar las coordenadas de la posición inicial.
      position1 = {
        lat: place1.geometry.location.lat(),
        lng: place1.geometry.location.lng(),
      };
      //calcularPonderado(); // Llamar a calcularPonderado después de seleccionar la ubicación inicial
    })
  
    busquedaFinal.addListener("place_changed", function () {
      const place2 = busquedaFinal.getPlace();
      if (!place2.geometry) {
        return; // Si no se seleccionó una ubicación válida, salir de la función
      }
      map.setCenter(place2.geometry.location);
      if (marker2) {
        marker2.setMap(null); // Remover el marcador anterior, si existe
      }
      marker2 = new google.maps.Marker({
        position: place2.geometry.location,
        map: map,
      });
      position2 = {
        lat: place2.geometry.location.lat(),
        lng: place2.geometry.location.lng(),
      };
      
      //calcularPonderado(); // Llamar a calcularPonderado después de seleccionar la ubicación final
    });
    //
    busquedaParada.addListener("place_changed", function () {
      const place3 = busquedaParada.getPlace();
      if (!place3.geometry) {
        return; // Si no se seleccionó una ubicación válida, salir de la función
      }
      map.setCenter(place3.geometry.location);
      if (marker3) {
        marker3.setMap(null); // Remover el marcador anterior, si existe
      }
      marker3 = new google.maps.Marker({
        position: place3.geometry.location,
        map: map,
      });
      // Almacenar las coordenadas de la posición inicial.
      position3 = {
        lat: place3.geometry.location.lat(),
        lng: place3.geometry.location.lng(),
      };
      //calcularPonderado(); // Llamar a calcularPonderado después de seleccionar la ubicación inicial
    })
  
    busquedaSParada.addListener("place_changed", function () {
      const place4 = busquedaSParada.getPlace();
      if (!place4.geometry) {
        return; // Si no se seleccionó una ubicación válida, salir de la función
      }
      map.setCenter(place4.geometry.location);
      if (marker4) {
        marker4.setMap(null); // Remover el marcador anterior, si existe
      }
      marker4 = new google.maps.Marker({
        position: place4.geometry.location,
        map: map,
      });
      position4 = {
        lat: place4.geometry.location.lat(),
        lng: place4.geometry.location.lng(),
      };
      
      //calcularPonderado(); // Llamar a calcularPonderado después de seleccionar la ubicación final
    });
  }
function arbol() {
  /*const nodes = viajes.map((node) => ({ 
    id: node.idViaje, 
    name: node.nodoViajeInicio }));*/
  const edges = viajes.map((edge) => ({
    from: edge.nodoViajeInicio,
    to: edge.nodoViajeDestino,
    weight: edge.ponderado,
  }));
 
  //console.log("nodos", nodes);
  console.log("Aristas", edges);};

function obtenerLatLog(place) {

  if (!place.geometry || !place.geometry.location) return;



  positionInicio = {

    lat: place.geometry.location.lat(),

    lng: place.geometry.location.lng(),

  };

  console.log("posicion", positionInicio);

  return positionInicio;

}
function findClosestUnvisitedVertex(distances, visited) {
  let minDistance = Number.MAX_VALUE;
  let closestVertex = null;

  for (const vertex in distances) {
    if (!visited[vertex] && distances[vertex] < minDistance) {
      minDistance = distances[vertex];
      closestVertex = vertex;
    }
  }

  return closestVertex;
}

function primAlgorithm(locations) {
  const vertexCount = locations.length;
  const distances = {};
  const visited = {};

  locations.forEach((location, index) => {
    distances[index] = Number.MAX_VALUE;
    visited[index] = false;
  });

  distances[0] = 0;

  for (let i = 0; i < vertexCount - 1; i++) {
    const currentVertex = findClosestUnvisitedVertex(distances, visited);
    visited[currentVertex] = true;

    locations.forEach((location, index) => {
      if (!visited[index]) {
        const distance = calculateDistance(locations[currentVertex], location);
        if (distance < distances[index]) {
          distances[index] = distance;
        }
      }
    });
  }

  return distances;
}
function iniciarViaje() {
  const btnPopUp = document.querySelector('.btnViaje');
  //const wrapper = document.getElementById('wrapper'); // Agrega la referencia al elemento 'wrapper'
  //const coordsCostaRica = { lat: 9.7489, lng: -83.7534 }; // Coordenadas de Costa Rica o cualquier otro centro de referencia

  btnPopUp.addEventListener('click', () => {

    let viajeDestino, viajeSiguienteInicio;

    // console.log("Size", nodes.size);
    const nodes = new Set();

 

    viajes.forEach((edge) => {
  
      nodes.add(edge.from);
  
      nodes.add(edge.to);
  
    });

    for (let n = 0; n < nodes.size; n++) {

      if (viajes[n] == undefined) {

        break;

      }

      //console.log( "Primero", viajes[n]);

      for (let m = 0; m < nodes.size; m++) {

        if (viajes[n] === viajes[m]) {

          //console.log('igualdad');
          m = n + 1;

        }

        if (viajes[m] == undefined) {

          viajeSiguienteInicio = viajes[n].from

          break;

        }

        viajeDestino = viajes[n].to;

        viajeSiguienteInicio = viajes[m].from;

        console.log("Inicio 1 ", viajeDestino, "Destino", viajeSiguienteInicio);

        //console.log("Siguiente", viajes[m]);

        const request1 = {

          query: viajeDestino,

          fields: ["name", "geometry"],

        };

        const request2 = {

          query: viajeSiguienteInicio,

          fields: ["name", "geometry"],

        };


      
      /*

        service = new google.maps.places.PlacesService(map);



        service.findPlaceFromQuery(request1, (results, status) => {

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {

            for (let i = 0; i < results.length; i++) {

              locations = (obtenerLatLog(place));

            }





          }

        });

        service.findPlaceFromQuery(request2, (results, status) => {

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {

            for (let i = 0; i < results.length; i++) {

              locations = (obtenerLatLog(place));

            }





          }

        });

*/

      }}
      locations = [

        {lat: position1.lat, lng: position1.lng},
  
        {lat: position2.lat, lng: position2.lng},

        {lat: position3.lat, lng: position3.lng},
  
        {lat: position4.lat, lng: position4.lng}
  
     
  
        ];
       //locations = [{position1,position2}];

      //nodoViajeInicio = document.getElementById('inputInicio').value;
      //const nodoViajeDestino = document.getElementById('inputFinal').value];
      console.log("locations",locations);

      locations.forEach((location) => {
        new google.maps.Marker({
          position: location,
          map: map,
        });
      });

      // Calcular y mostrar la ruta más corta usando el algoritmo de Prim
      const distances = primAlgorithm(locations);

      let previousVertex = 0;
      let totalDistance = 0;

      for (let i = 1; i < locations.length; i++) {
        totalDistance += distances[i];
        console.log("Distancias", distances[i]);
        const line = new google.maps.Polyline({
          path: [locations[previousVertex], locations[i]],
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: map,
        });
        previousVertex = i;
      }
    });
  }


iniciarViaje();






// Funcion para calcular la distancia entre dos puntos utilizando la API de Google Maps
function calculateDistance(position1, position2,position3,position4) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(position1.lat, position1.lng),
    new google.maps.LatLng(position2.lat, position2.lng),
    //new google.maps.LatLng(position3.lat, position3.lng),
    //new google.maps.LatLng(position4.lat, position4.lng)

  );
}

// Funcion para obtener la ruta y el tiempo de llegada entre dos puntos utilizando la API de Direcciones de Google Maps
function calculateTimeOfArrival(position1, position2,position3,position4) {
  const directionsService = new google.maps.DirectionsService();

  const request = {
    origin: new google.maps.LatLng(position1.lat, position1.lng),
    parada1: new google.maps.LatLng(position3.lat, position3.lng), 
    parada2: new google.maps.LatLng(position4.lat, position4.lng),
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
  const weightedCost = distanceInKm * distanceWeight + timeInMinutes * timeWeight;

  return weightedCost;
}

// Funcion para calcular y mostrar el costo ponderado en la página
function calcularPonderado() {
  if (marker1 && marker2 && marker3 && marker4) {
    const distance = calculateDistance(position1, position2,position3,position4);
    const timeInMinutesPromise = calculateTimeOfArrival(position1, position2,position3,position4);

    timeInMinutesPromise
      .then((timeInMinutes) => {
        const weightedCost = calculateWeightedCost(distance, timeInMinutes);

        const distancia = distance.toFixed(2);
        ponderado = weightedCost.toFixed(2);
        tiempo = timeInMinutes;
        console.log('Distancia', distancia, 'Tiempo', tiempo, 'Ponderado',ponderado);
        // Mostrar resultados en la página
        document.getElementById("distanceResult").textContent = distancia;
        document.getElementById("timeResult").textContent = tiempo;
        document.getElementById("weightedCostResult").textContent = ponderado;
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }
}

document.addEventListener('DOMContentLoaded',  () => {
  //const boton = document.getElementById('boton');

  document.getElementById('formPasajero').addEventListener('submit', function(event) {
    event.preventDefault();
    const nodoViajeInicio = document.getElementById('inputInicio').value;
    const nodoViajeDestino = document.getElementById('inputFinal').value;
    const ponde  = ponderado;
    const tiemp = tiempo;

    const data = {
      nodoViajeInicio: nodoViajeInicio,
      nodoViajeDestino: nodoViajeDestino,
      ponderado: ponde,
      tiempo:  tiemp,
    };
    console.log('Datos del JS', data);

    try {
      fetch('/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Datos guardados correctamente');
        //formulario.reset();
      } else {
        alert('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    
  });
});


/*

fetch('/guardar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('datos', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });



    try {
      const response = await fetch('/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Datos guardados correctamente');
        formulario.reset();
      } else {
        alert('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error:', error);
    }*/ 

//Cerrar Sesión
/*router.get('/logout', (req, res) => {
  req.logout();
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err)
      }
      console.log("Destroyed the user session on Auth0 endpoint");
      res.redirect('/');
    });
  }
});*/

const logout = document.querySelector('#logout')

logout.addEventListener('click', ()=>{
    alert('Cerrar Sesión')
    window.location.href = 'index.html'
})
