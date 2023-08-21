const coordsCostaRica = { lat: 10.0, lng: -84.0 };
const divMapa = document.getElementById("map");
let datosBD;
let map;
let service;
let entreViaje;
let positionInicio, positionDestino; // Variables para almacenar las coordenadas de la posición inicial y final.
let ponderadoEntreViajes, tiempoEntreViajes;
let tiempo, ponderado;

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
    from: viaje.nodoViajeInicio,
    to: viaje.nodoViajeDestino,
    weight: viaje.ponderado,
  }));
  entreViajes(viajes);
}

function entreViajes(viajes) {
  const nodes = new Set();

  viajes.forEach((edge) => {
    nodes.add(edge.from);
    nodes.add(edge.to);
  });

  BusquedaDeLugar(viajes, nodes);
}

function BusquedaDeLugar(viajes, nodes) {
  let viajeDestino, viajeSiguienteInicio;

  for (let n = 0; n < nodes.size; n++) {
    if (viajes[n] == undefined) {
      break;
    }

    for (let m = 0; m < nodes.size; m++) {
      if (viajes[n] === viajes[m]) {
        m = n + 1;
      }

      if (viajes[m] == undefined) {
        viajeSiguienteInicio = viajes[n].from;
        break;
      }
      viajeDestino = viajes[n].to;
      viajeSiguienteInicio = viajes[m].from;
      //console.log("Inicio ", viajeDestino, "Destino", viajeSiguienteInicio);
      cualcularLatLng(viajes, viajeDestino, viajeSiguienteInicio);
    }
  }
}

function cualcularLatLng(viajes, viajeDestino, viajeSiguienteInicio) {
  const request1 = {
    query: viajeDestino,
    fields: ["name", "geometry"],
  };
  const request2 = {
    query: viajeSiguienteInicio,
    fields: ["name", "geometry"],
  };

  //console.log("Inicio ", request1, "Destino", request2);
  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request1, (results1, status1) => {
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

            positionDestino = {
              lat: results2[i].geometry.location.lat(),
              lng: results2[i].geometry.location.lng(),
            };
            //console.log("Inicio ", viajeDestino, "Destino", viajeSiguienteInicio);
            calcularPonderado(viajes, viajeDestino, viajeSiguienteInicio);
          }
        }
      }
    });
  });
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
function calculateTimeOfArrival(positionInicio, positionDestino) {
  const directionsService = new google.maps.DirectionsService();

  const request = {
    origin: new google.maps.LatLng(positionInicio.lat, positionInicio.lng),
    destination: new google.maps.LatLng(
      positionDestino.lat,
      positionDestino.lng
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

// Funcion para calcular y mostrar el costo ponderado en la página
function calcularPonderado(viajes, viajeDestino, viajeSiguienteInicio) {
  const distance = calculateDistance(positionInicio, positionDestino);
  const timeInMinutesPromise = calculateTimeOfArrival(
    positionInicio,
    positionDestino
  );

  timeInMinutesPromise
    .then((timeInMinutes) => {
      const weightedCost = calculateWeightedCost(distance, timeInMinutes);

      const distancia = distance.toFixed(2);
      ponderado = weightedCost.toFixed(2);
      tiempo = timeInMinutes;
      entreViaje = [
        {
          destinoFinalViaje: viajeDestino,
          inicioSiguienteViaje: viajeSiguienteInicio,
          poderadoEntreViajes: ponderado,
        },
      ];

      const tree = AlgoritmoPrim(viajes, entreViaje);
      console.log("Nodes:", [...tree.entreViaje]);
      console.log("Edges:", tree.entreViaje);

      //console.log('Destino',viajeDestino ,'Siguiente',viajeSiguienteInicio )
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

function AlgoritmoPrim(viajes, entreViaje) {
  //console.log("Entre Viajes ", entreViaje);
  //console.log("Viajes", viajes);
  const nodes = new Set();
  let siguiente, inicio;

  viajes.forEach((edge) => {
    nodes.add(edge.from);
    nodes.add(edge.to);
  });

  const startingNode = viajes[0].from;

  const tree = {
    nodes: new Set([startingNode]),
    viajes: [],
  };
  for (let i = 0; i < nodes.size; i++) {
    inicio  = viajes[i].to;
    if (inicio == undefined) {
     break;
    }
    
    for (let n = 1; n < nodes.size; n++) {
      if (siguiente == undefined) {
        siguiente = viajes[i].to;
        //break;
      }
      siguiente = viajes[n].from;

      if (
        inicio === entreViaje[0].destinoFinalViaje &&
        siguiente === entreViaje[0].inicioSiguienteViaje
      ) {
        let minEdge = null;
        let minPondeEntreViajes = Infinity;
        let minWeight = Infinity;
        if (entreViaje[0].poderadoEntreViajes < minPondeEntreViajes) {
          if(viajes[i].weight < minWeight){
            minEdge = viajes[i];
            minWeight = viajes[i].weight;
            //console.log('a', minEdge);
          }

          minPondeEntreViajes = entreViaje[0].poderadoEntreViajes;
          if (minEdge) {
            tree.viajes.push(minEdge);
            tree.nodes.add(minEdge.from);
            tree.nodes.add(minEdge.to);
          }

        }
      }      
    }
    


  }
  return tree;
}


