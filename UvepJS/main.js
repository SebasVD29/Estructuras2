/*igual esto era con el mapbox 
mapboxgl.accessToken = 'pk.eyJ1Ijoic2ViYXN2ZDI5IiwiYSI6ImNsa2JxYzAwaDBpYnIzcm54eHc2aHFwbTUifQ.zYhLbAM2_s9a5qZQX4FTqQ';var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
  });*/
  
  var myLatLng = { lat: 10.213697085664514, lng: -83.7890126854106 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: myLatLng ,  mapTypeId: google.maps.MapTypeId.ROADMAP, // Utilizar la ubicación actual como el centro del mapa
  });