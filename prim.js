const coordsCostaRica = { lat: 10.0, lng: -84.0 };
const divMapa = document.getElementById("map");
let datosBD;
let map;
let service;
let positionInicio, positionSiguiente, distanciaInt, distanciaDouble; // Variables para almacenar las coordenadas de la posición inicial y final.
let minInicio  = Infinity;;
let minimoPeso = Infinity;
let bandera = true;

fetch("/datos-viajes")
  .then((response) => response.json())
  .then((data) => {
    datosBD = data;
    console.log("Datos ", datosBD);

    arbol();
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });

function initMap() {
  map = new google.maps.Map(divMapa, {
    center: coordsCostaRica,
    zoom: 13,
  });

  // arbol();
}

function arbol() {
  const viajes = datosBD.map((viaje) => ({
    id: viaje.idViaje,
    nodo: viaje.nodoViaje,
  }));
  entreViajes(viajes);
}

function entreViajes(viajes) {
  const nodes = new Set();

  viajes.forEach((edge) => {
    nodes.add(edge.nodo);
  });

  BusquedaDeLugar(viajes, nodes);
}

function iniciarViaje(viajeDestino, viajeSiguiente) {
  locations = [
    { lat: viajeDestino.lat, lng: viajeDestino.lng },
    { lat: viajeSiguiente.lat, lng: viajeSiguiente.lng },
  ];
  /* console.log(
    "Viaje",
    viajeDestino,
    "Viaje Siguiente",
    viajeSiguiente
  );*/
  locations.forEach((location) => {
    new google.maps.Marker({
      position: location,
      map: map,
    });
  });
  const distances = algoritmoPrim(locations);
  //console.log(distances);
  let previousVertex = 0;
  for (let i = 1; i < locations.length; i++) {
    if (distances[i] < minimoPeso) {
      //console.log("Distancias", distances[i]);
      bandera = true;
      const line = new google.maps.Polyline({
        path: [locations[previousVertex], locations[i]],
        strokeColor: "#0000FF",
        strokeOpacity: 2.0,
        strokeWeight: 3,
        map: map,
      });
      minimoPeso = distances[i];
      previousVertex = i;
    }
  }
  //console.log("bandera", bandera);
  bandera = false;
}

function BusquedaDeLugar(viajes, nodes) {
  let nodoViaje, nodoViajeSiguiente;
  let m = 0;
  

  for (let n = 0; n < nodes.size; n++) {
    nodoViaje = viajes[n].nodo;
    
    for (m; m < nodes.size; m++) {
      if (viajes[m] == undefined) {
        viajeSiguienteInicio = viajes[n].nodo;
        break;
      }
      if (viajes[n] === viajes[m]) {
        m = n + 1;
      }

      nodoViajeSiguiente = viajes[m].nodo;

      console.log(
        "Opciones de Viaje ",
        nodoViaje,

        "Viaje Siuientes",
        nodoViajeSiguiente
      );
      cualcularLatLng( nodoViaje, nodoViajeSiguiente);
      /*if (bandera) {
        break;
      }*/
    }
    m = n + 1;
  }
}

function cualcularLatLng(nodoViaje, nodoViajeSiguiente) {
  

  const request1 = {
    query: nodoViaje,
    fields: ["name", "geometry"],
  };
  const request2 = {
    query: nodoViajeSiguiente,
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);
  return service.findPlaceFromQuery(request1, (results1, status1) => {
    service.findPlaceFromQuery(request2, (results2, status2) => {
      if (
        status1 === google.maps.places.PlacesServiceStatus.OK &&
        results1 &&
        status2 === google.maps.places.PlacesServiceStatus.OK &&
        results2
      ) {
        for (let q = 0; q < results1.length; q++) {
          if (!results1[q].geometry || !results1[q].geometry.location) return;

          for (let i = 0; i < results2.length; i++) {
            if (!results2[i].geometry || !results2[i].geometry.location) return;

            positionInicio = {
              lat: results1[q].geometry.location.lat(),
              lng: results1[q].geometry.location.lng(),
            };

            positionSiguiente = {
              lat: results2[i].geometry.location.lat(),
              lng: results2[i].geometry.location.lng(),
            };
          }
        }
      }
      
      distanciaDouble = [calculateDistance(positionInicio, positionSiguiente)];
      distanciaInt = parseInt(distanciaDouble.toString(), 10);
      
      if (distanciaInt < minInicio) {
        console.log("Viaje", nodoViaje, "Viaje Siguiente", nodoViajeSiguiente);
        iniciarViaje(positionInicio, positionSiguiente);
        minInicio = distanciaInt;
      }
    });
  });
 // console.log("a", distanciaInt, "<", minInicio, distanciaInt < minInicio);
  
}

// Funcion para calcular la distancia entre dos puntos utilizando la API de Google Maps
function calculateDistance(position1, position2) {
  const inicioLatLng = new google.maps.LatLng(position1.lat, position1.lng);
  const destinoLatLng = new google.maps.LatLng(position2.lat, position2.lng);
  return google.maps.geometry.spherical.computeDistanceBetween(
    inicioLatLng,
    destinoLatLng
  );
}

// Funcion para obtener la ruta y el tiempo de llegada entre dos puntos utilizando la API de Direcciones de Google Maps
function calculateTimeOfArrival(positionInicio, positionSiguiente) {
  const directionsService = new google.maps.DirectionsService();

  const request = {
    origin: new google.maps.LatLng(positionInicio.lat, positionInicio.lng),
    destination: new google.maps.LatLng(
      positionSiguiente.lat,
      positionSiguiente.lng
    ),
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
  const weightedCost =
    distanceInKm * distanceWeight + timeInMinutes * timeWeight;

  return weightedCost;
}

function encontrarVerticeCercano(distancias, visitados) {
  let distanciaMinima = Number.MAX_VALUE;
  let verticeMasCercano = null;

  for (const vertice in distancias) {
    const noVisitado = !visitados[vertice];
    const distanciaActual = distancias[vertice];

    if (noVisitado && distanciaActual < distanciaMinima) {
      distanciaMinima = distanciaActual;
      verticeMasCercano = vertice;
    }
  }

  return verticeMasCercano;
}

function algoritmoPrim(locations) {
  const vertexCount = locations.length;
  const distances = {};
  const visited = {};

  locations.forEach((location, index) => {
    distances[index] = Number.MAX_VALUE;
    visited[index] = false;
  });

  distances[0] = 0;

  for (let i = 0; i < vertexCount - 1; i++) {
    const currentVertex = encontrarVerticeCercano(distances, visited);
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
