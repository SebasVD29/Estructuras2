// Definición de las coordenadas de Costa Rica
const coordsCostaRica = { lat: 10.0000000, lng: -84.0000000 };
// Obtención de una referencia al elemento HTML con el ID 'map'
const divMapa = document.getElementById('map');
// Obtención de referencias a los elementos HTML con los IDs 'inputInicio', 'inputFinal', 'inputParada' y 'inputsParada'
const inputInicio = document.getElementById('inputInicio');
const inputFinal = document.getElementById('inputFinal');
const inputParada = document.getElementById('inputParada');
const inputsParada = document.getElementById('inputsParada');
// archivo1.js

// Declaración de una variable llamada 'map' sin asignarle valor inicial.
let map;

// Declaración de variables para almacenar marcadores en el mapa.
// Se utilizan para indicar ubicaciones específicas en el mapa.
let marker1, marker2,marker3,marker4;

// Declaración de variables para almacenar las coordenadas de diferentes posiciones.
//Estas variables pueden ser utilizadas para definir la ubicación de los marcadores 
let position1, position2,position3,position4; // Variables para almacenar las coordenadas de la posición inicial y final y paradas
// Declaración de la variable 'usuario'.
let usuario;
// Declaración de las variables 'ponderado' y 'tiempo'.
let ponderado, tiempo;

// Declaración de la variable 'viajes' sin inicializar.
var viajes;
//inputInicio = document.getElementById('inputInicio');
//inputFinal = document.getElementById('inputFinal');
//var nodos, aristas;
// archivo2.js

//declaración de 
let service;
//declaración de locaciones exactas especificadas en el mapa 
let locations;
//declaración de la posición de inicio 
let positionInicio;

// Realiza una solicitud de red a la ruta "/datos-viajes" usando el método Fetch.
// Luego convierte la respuesta en formato JSON.
fetch("/datos-viajes")
  .then((response) => response.json())
  .then((data) => {
    // Asigna los datos obtenidos a la variable 'viajes'.
    viajes = data;
    //muestra los datos desde la consola del html mapa
    console.log("Datos ", viajes);

    
    // Llama a la función 'arbol'.
    arbol();
  })
  .catch((error) => {
    // Captura y maneja errores en caso de que la solicitud falle.
    console.error("Error al obtener los datos:", error);
  });

  // Definición de la función 'initMap'.
  function initMap() {
     // Crea un nuevo mapa de Google Maps y lo asigna a la variable 'map'.
     // Establece el centro del mapa en las coordenadas de Costa Rica.
    map = new google.maps.Map(divMapa, {
      center: coordsCostaRica,
      // Establece el nivel de zoom inicial del mapa.
      zoom: 13,
      
    });
  
   // Llama a la función 'BusquedaDeLugar'
    BusquedaDeLugar();
  }


  // Definición de la función 'BusquedaDeLugar'.
  function BusquedaDeLugar() {
    // Imprime en la consola los valores de los campos de entrada 'inputInicio' y 'inputFinal'.
    console.log('Inicio',inputInicio.value  ,'Destino', inputFinal.value)
    // Creación de instancias de Autocomplete para los campos de entrada.
    const busquedaIncio = new google.maps.places.Autocomplete(inputInicio);
    const busquedaFinal = new google.maps.places.Autocomplete(inputFinal);
    const busquedaParada = new google.maps.places.Autocomplete(inputParada);
    const busquedaSParada = new google.maps.places.Autocomplete(inputsParada);
    // Imprime en la consola las instancias de Autocomplete creadas.
    console.log('Inicio',busquedaIncio  ,'Destino', busquedaFinal)
  
    // Evento 'place_changed' para el campo de entrada 'inputInicio'.
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

 // Definición de la función 'arbol'.
function arbol() {
  /*const nodes = viajes.map((node) => ({ 
    id: node.idViaje, 
    name: node.nodoViajeInicio }));*/
    // Creación de un arreglo de aristas (edges) a partir de los datos en 'viajes'.
  const edges = viajes.map((edge) => ({
    from: edge.nodoViajeInicio,
    to: edge.nodoViajeDestino,
    weight: edge.ponderado,
  }));
 
  //console.log("nodos", nodes);
  console.log("Aristas", edges);};

  // Definición de la función 'obtenerLatLog'.
function obtenerLatLog(place) {

   // Verifica si no hay información de geometría o ubicación en el lugar proporcionado.
  if (!place.geometry || !place.geometry.location) return;


 // Crea un objeto 'positionInicio' para almacenar las coordenadas obtenidas del lugar.
  positionInicio = {

    lat: place.geometry.location.lat(),

    lng: place.geometry.location.lng(),

  };

  // Imprime en la consola las coordenadas almacenadas en 'positionInicio'.
  console.log("posicion", positionInicio);

   // Retorna las coordenadas almacenadas en 'positionInicio'.
  return positionInicio;

}

// Definición de la función 'encontrarVerticeCercano'.
//distancias será un objeto que almacena las distancias entre vértices, 
//y visitados sea un objeto que indica si un vértice ha sido visitado o no
function encontrarVerticeCercano(distancias, visitados) {
   // Inicialización de variables para almacenar la distancia mínima y el vértice más cercano.
   //Esto se hace para que pueda compararse con las distancias reales y encontrar una distancia más pequeña.
  let distanciaMinima = Number.MAX_VALUE;
  //Esta variable se inicializa como valor nulopara almacenar el identificador del vértice más cercano encontrado durante la iteración
  let verticeMasCercano = null;

  // Iteración a través de los vértices en el objeto 'distancias'.
  //recorre cada vértice en el objeto distancias
  for (const vertice in distancias) {
     // Verifica si el vértice no ha sido visitado y obtiene la distancia actual.
    const noVisitado = !visitados[vertice];
    const distanciaActual = distancias[vertice];

  // Si el vértice no ha sido visitado y su distancia es menor que la distancia mínima actual.
    if (noVisitado && distanciaActual < distanciaMinima) {
       // Actualiza la distancia mínima y el vértice más cercano.
      distanciaMinima = distanciaActual;
      verticeMasCercano = vertice;
    }
  }
 // Retorna el vértice más cercano.
  return verticeMasCercano;
}

//


//--Función que realiza el algortimo de Prim

// Definición de la función 'algoritmoPrim'.
// toma un argumento locations, que es un arreglo de ubicaciones (vértices) en un grafo.
function algoritmoPrim(locations) {

   // Obtiene el número de vértices en el grafo a partir de la longitud de 'locations'.
  const vertexCount = locations.length;

  //Crea un objeto distances para almacenar las distancias más cortas desde el vértice de inicio a otros vértices.
  const distances = {};
  //Crea un objeto visited para rastrear si un vértice ha sido visitado o no.
  const visited = {};
   // Inicializa los objetos 'distances' y 'visited' para cada vértice.
  //El bucle forEach recorre cada ubicación en el arreglo locations e inicializa las propiedades correspondientes en 
  //los objetos distances y visited. Las distancias se establecen en un valor inicial grande (Number.MAX_VALUE) y 
  //los vértices se marcan como no visitados (false).

  locations.forEach((location, index) => {
    distances[index] = Number.MAX_VALUE;
    visited[index] = false;
  });

 // La distancia al primer vértice es 0 (el vértice de inicio).
  distances[0] = 0;

   // Bucle principal que recorre todos los vértices del grafo.
   // El bucle se ejecutará desde 0 hasta 'vertexCount - 1'.
   // Esto significa que el último valor de 'i' será 'vertexCount - 1'.
   //se realizarán una serie de iteraciones igual al número total de vértices en el grafo menos uno
   // 'vertexCount' es la cantidad total de vértices en el grafo.
   //se resta uno al número total de vértices, para evitar que el bucle intente acceder a un vértice que está fuera del rango válido
   // en la iteración final.
   // Después de cada iteración, el valor de 'i' aumentará en 1 y se verificará la condición del bucle.

   //inicializa una variable i con el valor 0. Esta variable actuará como un contador de iteraciones.
  for (let i = 0; i < vertexCount - 1; i++) {

      // Encuentra el vértice no visitado más cercano utilizando la función 'encontrarVerticeCercano'.
    const currentVertex = encontrarVerticeCercano(distances, visited);
     // Marca el vértice actual como visitado.
    visited[currentVertex] = true;
  // Para cada vértice no visitado, actualiza las distancias más cortas.
    locations.forEach((location, index) => {
      if (!visited[index]) {
        // Calcula la distancia entre el vértice actual y el vértice en el índice 'index'.
        const distance = calculateDistance(locations[currentVertex], location);
        // Si la distancia calculada es menor que la distancia almacenada en 'distances', se actualiza.
        if (distance < distances[index]) {
          distances[index] = distance;
        }
      }
    });
  }
 // Retorna el objeto 'distances' con las distancias más cortas a cada vértice.
  return distances;
}

//Se declara la función iniciar viaje 
function iniciarViaje() {

  // Selección del botón con la clase 'btnViaje'
  const btnPopUp = document.querySelector('.btnViaje');
  //const wrapper = document.getElementById('wrapper'); // Agrega la referencia al elemento 'wrapper'
  //const coordsCostaRica = { lat: 9.7489, lng: -83.7534 }; // Coordenadas de Costa Rica o cualquier otro centro de referencia

  // Agrega un evento click al botón
  btnPopUp.addEventListener('click', () => {

    // Variables para almacenar destinos y inicio de viajes
    let viajeDestino, viajeSiguienteInicio;

    // console.log("Size", nodes.size);
     // Crea un conjunto para almacenar los nodos únicos (vértices)
    const nodes = new Set();

 
// Agrega los nodos únicos al conjunto a partir de los datos del grafo (aristas)
    viajes.forEach((edge) => {
  
      nodes.add(edge.from);
  
      nodes.add(edge.to);
  
    });

     // Bucle principal que itera a través de los nodos únicos
    for (let n = 0; n < nodes.size; n++) {

      if (viajes[n] == undefined) {

        break;

      }

      //console.log( "Primero", viajes[n]);

       // Bucle anidado para comparar nodos y obtener información de ubicación

      for (let m = 0; m < nodes.size; m++) {

        if (viajes[n] === viajes[m]) {

          //console.log('igualdad');
          m = n + 1;

        }

        if (viajes[m] == undefined) {

          viajeSiguienteInicio = viajes[n].from

          break;

        }

         // Obtiene destinos y ubicaciones
        viajeDestino = viajes[n].to;

        viajeSiguienteInicio = viajes[m].from;

          // Crea solicitudes para obtener información de ubicación

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

// Define un conjunto de ubicaciones basadas en las posiciones almacenadas
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

       // Agrega marcadores en las ubicaciones definidas
      console.log("locations",locations);

    locations.forEach((location) => {
      new google.maps.Marker({
        position: location,
        map: map,
      });
    });

    //Ruta más corta------------------------
    const distances = algoritmoPrim(locations);

      // Inicializa variables para rastrear el vértice anterior y la distancia total
      let previousVertex = 0;
      let totalDistance = 0;

      // Bucle que recorre las ubicaciones para crear rutas y calcular la distancia total
      //Inicializa una variable i(ubicación) con el valor 1. La variable i se utiliza como contador para las iteraciones del bucle.
      //El bucle se ejecutará mientras el valor de i sea menor que la longitud (cantidad de elementos) del array locations.
      //luego el valor de i se incremente en 1 
      //se utiliza para recorrer el array locations a partir de la segunda ubicación (índice 1) hasta la última ubicación. 
      for (let i = 1; i < locations.length; i++) {
          // Agrega la distancia actual al total
        totalDistance += distances[i];
        // Imprime la distancia actual en la consola
        console.log("Distancias", distances[i]);
         // Crea una línea (ruta) entre la ubicación anterior y la ubicación actual
        const line = new google.maps.Polyline({
          path: [locations[previousVertex], locations[i]],
          strokeColor: '#0000FF',
          strokeOpacity: 2.0,
          strokeWeight: 3,
          map: map,
        });
          // Actualiza el vértice anterior para la siguiente iteración
        previousVertex = i;
      }

       //Distancia total
        // Actualiza el valor del elemento con ID 'distanceResult'
       document.getElementById('distanceResult').textContent = totalDistance.toFixed(2) ;

    
    });
  }

// Inicia la función 'iniciarViaje'
iniciarViaje();

//Funcion para calcular la distancia entre dos puntos utilizando la API de Google Maps
function calculateDistance(position1, position2, position3, position4) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(position1.lat, position1.lng),
    new google.maps.LatLng(position2.lat, position2.lng)
  );
}

// Funcion para obtener la ruta y el tiempo de llegada entre dos puntos utilizando la API de Direcciones de Google Maps
function calculateTimeOfArrival(position1, position2, position3, position4) {
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
  const weightedCost =
    distanceInKm * distanceWeight + timeInMinutes * timeWeight;

  return weightedCost;
}

// Funcion para calcular y mostrar el costo ponderado en la página
function calcularPonderado() {
  if (marker1 && marker2 && marker3 && marker4) {
    const distance = calculateDistance(
      position1,
      position2,
      position3,
      position4
    );
    const timeInMinutesPromise = calculateTimeOfArrival(
      position1,
      position2,
      position3,
      position4
    );

    timeInMinutesPromise
      .then((timeInMinutes) => {
        const weightedCost = calculateWeightedCost(distance, timeInMinutes);

        const distancia = distance.toFixed(2);
        ponderado = weightedCost.toFixed(2);
        tiempo = timeInMinutes;
        console.log(
          "Distancia",
          distancia,
          "Tiempo",
          tiempo,
          "Ponderado",
          ponderado
        );
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

document.addEventListener("DOMContentLoaded", () => {
  //const boton = document.getElementById('boton');

  document
    .getElementById("formPasajero")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const nodoViajeInicio = document.getElementById("inputInicio").value;
      const nodoViajeDestino = document.getElementById("inputFinal").value;
      const ponde = ponderado;
      const tiemp = tiempo;

      const data = {
        nodoViajeInicio: nodoViajeInicio,
        nodoViajeDestino: nodoViajeDestino,
        ponderado: ponde,
        tiempo: tiemp,
      };
      console.log("Datos del JS", data);

      try {
        fetch("/guardar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert("Datos guardados correctamente");
        } else {
          alert("Error al guardar los datos");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
});

//const logout = document.querySelector("#logout");

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

//--CERRAR SESIÓN------------------------

// Selecciona el elemento con el ID 'logout'

const logout = document.querySelector('#logout')
// Agrega un evento de clic al elemento 'logout'
logout.addEventListener('click', ()=>{
   // Muestra una alerta de "Cerrar Sesión"
    alert('Cerrar Sesión')
    // Redirige la ventana actual a 'index.html'
    window.location.href = 'index.html'
})
