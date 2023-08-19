const coordsCostaRica = { lat: 10.0000000, lng: -84.0000000 };
const divMapa = document.getElementById('map');
const inputInicio = document.getElementById('inputInicio');
const inputFinal = document.getElementById('inputFinal');
let map;
let marker1, marker2;
let position1, position2; // Variables para almacenar las coordenadas de la posición inicial y final.
let usuario;
let ponderado, tiempo;

function initMap() {
  map = new google.maps.Map(divMapa, {
    center: coordsCostaRica,
    zoom: 13,
  });

  BusquedaDeLugar();
}

function BusquedaDeLugar() {
  console.log('Inicio',inputInicio.value  ,'Destino', inputFinal.value)
  const busquedaIncio = new google.maps.places.Autocomplete(inputInicio);
  const busquedaFinal = new google.maps.places.Autocomplete(inputFinal);
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
    calcularPonderado(); // Llamar a calcularPonderado después de seleccionar la ubicación inicial
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
    calcularPonderado(); // Llamar a calcularPonderado después de seleccionar la ubicación final
  });
}

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
    //localStorage.removeItem('login_success')
    window.location.href = 'index.html'
})
