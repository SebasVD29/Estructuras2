var viajes;
//inputInicio = document.getElementById('inputInicio');
//inputFinal = document.getElementById('inputFinal');
//var nodos, aristas;
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
  const nodes = viajes.map((node) => ({ 
    id: node.idViaje, 
    name: node.nodoViajeInicio }));
  const edges = viajes.map((edge) => ({
    from: edge.nodoViajeInicio,
    to: edge.nodoViajeDestino,
    weight: edge.ponderado,
  }));

  console.log("nodos", nodes);
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
// Funcion para calcular la distancia entre dos puntos utilizando la API de Google Maps
function calculateDistance(position1, position2) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(position1.lat, position1.lng),
    new google.maps.LatLng(position2.lat, position2.lng)
  );
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
    //wrapper.classList.add('active');

    const locations = [{inputInicio,inputFinal}];
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
      console.log("Distancias",distances[i]);
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
