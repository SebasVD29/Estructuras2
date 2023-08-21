const coordsCostaRica = { lat: 10.0, lng: -84.0 };
const divMapa = document.getElementById("map");
const inputInicio = document.getElementById("inputInicio");
const inputFinal = document.getElementById("inputFinal");
const inputParada = document.getElementById("inputParada");
const inputsParada = document.getElementById("inputsParada");
// archivo1.js

let map;

let marker1, marker2, marker3, marker4;

let position1, position2, position3, position4; // Variables para almacenar las coordenadas de la posición inicial y final.
let usuario;
let ponderado, tiempo;
let service;
let locations;
let positionInicio;

function initMap() {
  map = new google.maps.Map(divMapa, {
    center: coordsCostaRica,
    zoom: 13,
    // center: { lat: parseFloat(lat), lng: parseFloat(lng) }
  });

  BusquedaDeLugar();
}

function BusquedaDeLugar() {
  console.log("Inicio", inputInicio.value, "Destino", inputFinal.value);
  const busquedaIncio = new google.maps.places.Autocomplete(inputInicio);
  const busquedaFinal = new google.maps.places.Autocomplete(inputFinal);
  const busquedaParada = new google.maps.places.Autocomplete(inputParada);
  const busquedaSParada = new google.maps.places.Autocomplete(inputsParada);
  console.log("Inicio", busquedaIncio, "Destino", busquedaFinal);

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
  });

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
  
    position3 = {
      lat: place3.geometry.location.lat(),
      lng: place3.geometry.location.lng(),
    };
    
  });

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

  });
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
function iniciarViaje() {
  const btnPopUp = document.querySelector(".btnViaje");
  btnPopUp.addEventListener("click", () => {
    locations = [
      { lat: position1.lat, lng: position1.lng },

      { lat: position2.lat, lng: position2.lng },

      { lat: position3.lat, lng: position3.lng },

      { lat: position4.lat, lng: position4.lng },
    ];

    console.log("locations", locations);

    locations.forEach((location) => {
      new google.maps.Marker({
        position: location,
        map: map,
      });
    });

    //Ruta más corta------------------------
    const distances = algoritmoPrim(locations);

    let previousVertex = 0;
    let totalDistance = 0;

    for (let i = 1; i < locations.length; i++) {
      totalDistance += distances[i];
      console.log("Distancias", distances[i]);
      const line = new google.maps.Polyline({
        path: [locations[previousVertex], locations[i]],
        strokeColor: "#0000FF",
        strokeOpacity: 2.0,
        strokeWeight: 3,
        map: map,
      });
      previousVertex = i;
    }

    //Distancia total
    document.getElementById("distanceResult").textContent =
      totalDistance.toFixed(2);
  });
}

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

const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
  alert("Cerrar Sesión");
  window.location.href = "index.html";
});
