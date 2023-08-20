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
  console.log("Aristas", edges);

  // Calcular el árbol de expansión mínima usando el algoritmo de Prim
  /*const selectedEdges = primAlgorithm(nodes, edges);

  console.log("arbol", selectedEdges);*/
};

/*
function primAlgorithm(nodes, edges) {
  const selectedNodes = new Set();
  const selectedEdges = [];

  selectedNodes.add(nodes[0]);

  while (selectedNodes.size < nodes.length) {
    let minEdge = null;

    for (const edge of edges) {
      if (
        (selectedNodes.has(edge.from) && !selectedNodes.has(edge.to)) ||
        (selectedNodes.has(edge.to) && !selectedNodes.has(edge.from))
      ) {
        if (!minEdge || edge.weight < minEdge.weight) {
          minEdge = edge;
        }
      }
    }

    selectedNodes.add(minEdge.to);
    selectedNodes.add(minEdge.from);
    selectedEdges.push(minEdge);
  }

  return selectedEdges;
}
*/

// Función para procesar las ubicaciones y obtener las coordenadas
/*async function processLocations(locations) {
  const locationsWithCoordinates = [];

  for (const location of locations) {
    const inicio = await geocodeAddress(location.inputInicio);
    const final = await geocodeAddress(location.inputFinal);
    
    locationsWithCoordinates.push({
      inputInicio: inicio,
      inputFinal: final
    });
  }

  return locationsWithCoordinates;
}

// Llamada a la función para obtener las coordenadas
processLocations(locations)
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
// Funcion para calcular la distancia entre dos puntos utilizando la API de Google Maps
function calculateDistance(position1, position2) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(position1.lat, position1.lng),
    new google.maps.LatLng(position2.lat, position2.lng)
  );
}
*/

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
  const coordsCostaRica = { lat: 9.7489, lng: -83.7534 }; // Coordenadas de Costa Rica o cualquier otro centro de referencia

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



      }}

      //const locations = [{obtenerLatLog(place)}];

      //nodoViajeInicio = document.getElementById('inputInicio').value;
      //const nodoViajeDestino = document.getElementById('inputFinal').value];

      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: coordsCostaRica,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });

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
