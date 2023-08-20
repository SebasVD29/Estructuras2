let datosBD;
let positionInicio, positionDestino; // Variables para almacenar las coordenadas de la posición inicial y final.
let ponderadoEntreViajes, tiempoEntreViajes;
//var nodos, aristas;
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

function arbol() {
  const viajes = datosBD.map((viaje) => ({
    id: viaje.idViaje,
    from: viaje.nodoViajeInicio,
    to: viaje.nodoViajeDestino,
    weight: viaje.ponderado,
  }));

  const tree = primAlgorithm(viajes);
  //console.log("Nodes:", [...tree.viajes]);
  //console.log("Edges:", tree.viajes);
}

function primAlgorithm(viajes) {
  const nodes = new Set();
  
  viajes.forEach((edge) => {
    nodes.add(edge.from);
    nodes.add(edge.to);
  });
 // console.log("nodos", nodes, nodes.size);

  const startingNode = viajes[0].from;
  
  const tree = {
    nodes: new Set([startingNode]),
    viajes: [],
  };

  BusquedaDeLugar(viajes,nodes);

  while (tree.nodes.size < nodes.size) {
    let minEdge = null;
    let minWeight = Infinity;

    for (const edge of viajes) {
      if (
        (tree.nodes.has(edge.from) && !tree.nodes.has(edge.to)) ||
        (tree.nodes.has(edge.to) && !tree.nodes.has(edge.from))
      ) {
        if (edge.weight < minWeight) {
          minEdge = edge;
          minWeight = edge.weight;
        }
      }
    }

    if (minEdge) {
      tree.viajes.push(minEdge);
      tree.nodes.add(minEdge.from);
      tree.nodes.add(minEdge.to);
    }
  }

  return tree;
}

function BusquedaDeLugar(viajes, nodes) {
  let viajeDestino, viajeSiguienteInicio;
 // console.log("Size", nodes.size);


  for(let n = 0; n < nodes.size; n++) {
    if (viajes[n] == undefined){
      break;
    }
    //console.log( "Primero", viajes[n]);
    for (let m=0; m < nodes.size;m++) {

      if(viajes[n]===viajes[m]){
        //console.log('igualdad');
        m=n+1;       
      }
      
      if (viajes[m] == undefined){
        viajeSiguienteInicio = viajes[n].from
        break;
      }
      viajeDestino = viajes[n].to;
      viajeSiguienteInicio = viajes[m].from;
      //console.log("Siguiente", viajes[m]);
      console.log("Inicio", viajeDestino, "Destino", viajeSiguienteInicio);
      
      
    } 
   
  }

  //const busquedaIncio = new google.maps.places.Autocomplete(viaje);
  //const busquedaFinal = new google.maps.places.Autocomplete(siguiente);
  
}
/*

 

      console.log('m', m,"Siguiente", viajes[m]);
      

   
      

function BusquedaDeLugar() {
  //console.log('Inicio',inputInicio.value  ,'Destino', inputFinal.value)
  const busquedaIncio = new google.maps.places.Autocomplete(inputInicio);
  const busquedaFinal = new google.maps.places.Autocomplete(inputFinal);
  console.log('Inicio', busquedaIncio,'Destino', busquedaFinal)

  busquedaIncio.addListener("place_changed", function () {
    const place1 = busquedaIncio.getPlace();
    if (!place1.geometry) {
      return; // Si no se seleccionó una ubicación válida, salir de la función
    }
    
    positionInicio = {
      lat: place1.geometry.location.lat(),
      lng: place1.geometry.location.lng(),
    };
   // calcularPonderado(); // Llamar a calcularPonderado después de seleccionar la ubicación inicial
  })

  busquedaFinal.addListener("place_changed", function () {
    const place2 = busquedaFinal.getPlace();
    if (!place2.geometry) {
      return; // Si no se seleccionó una ubicación válida, salir de la función
    }
    positionDestino = {
      lat: place2.geometry.location.lat(),
      lng: place2.geometry.location.lng(),
    };
    //calcularPonderado(); // Llamar a calcularPonderado después de seleccionar la ubicación final
  });
}
/*
// Funcion para calcular la distancia entre dos puntos utilizando la API de Google Maps
function calculateDistance(position1, position2) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(position1.lat, position1.lng),
    new google.maps.LatLng(position2.lat, position2.lng)
  );
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
  const weightedCost = distanceInKm * distanceWeight + timeInMinutes * timeWeight;

  return weightedCost;
}

// Funcion para calcular y mostrar el costo ponderado en la página
function calcularPonderado() {
  if (marker1 && marker2) {
    const distance = calculateDistance(position1, position2);
    const timeInMinutesPromise = calculateTimeOfArrival(position1, position2);

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
}*/
