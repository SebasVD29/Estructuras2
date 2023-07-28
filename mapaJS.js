  var myLatLng = { lat: 9.935764, lng: -84.079338 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: myLatLng ,  mapTypeId: google.maps.MapTypeId.ROADMAP, // Utilizar la ubicación actual como el centro del mapa
  });