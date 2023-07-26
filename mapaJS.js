  var myLatLng = { lat: 10.213697085664514, lng: -83.7890126854106 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: myLatLng ,  mapTypeId: google.maps.MapTypeId.ROADMAP, // Utilizar la ubicación actual como el centro del mapa
  });