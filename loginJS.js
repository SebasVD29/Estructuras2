// Variable para almacenar los datos del usuario
var usuario;
// Realiza una solicitud de red para obtener datos
fetch('/datos')
.then((response) => response.json())// Convierte la respuesta en formato JSON
.then((data) => {
  // Manipula los datos recibidos y colócalos en el DOM del cliente
  
  usuario = data;// Almacena los datos obtenidos en la variable 'usuario'
  // Imprime el rol del usuario en la consola
  console.log(usuario[0].rol);


})
.catch((error) => {
  console.error('Error al obtener los datos:', error);
});

// Agrega un escuchador de evento para cuando el contenido del DOM se ha cargado

document.addEventListener('DOMContentLoaded', () => {
  // Selecciona elementos del DOM para interacción
  const wrapper = document.querySelector('.wrapper');
  const loginLink = document.querySelector('.login-link');
  const registroLink = document.querySelector('.registro-link');
  const btnPopUp = document.querySelector('.btnLogin-popup');
  const iconClose = document.querySelector('.icon-close');

   // Agrega un escuchador de evento para el enlace de registro
  registroLink.addEventListener('click', () => {
    wrapper.classList.add('active');
  });
   // Agrega un escuchador de evento para el enlace de inicio de sesión

  loginLink.addEventListener('click', () => {
    wrapper.classList.add('active');
  });

  btnPopUp.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
  });
   // Agrega un escuchador de evento para el ícono de cierre

  iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
  });

  // Función para mostrar contenido según el rol del usuario
  function mostrarContenidoSegunRol() {
    //const usuario = obtenerUsuarioAutenticado();
    console.log(usuario);
     // Verifica el rol del usuario y muestra contenido según su rol
  
    if (usuario[0].rol === 'admin') {
      // Mostrar el contenido para el rol de administrador
      console.log("Contenido del admin")
      
    } else if(usuario[0].rol === 'conductor') {
      // Mostrar el contenido para usuarios conductores
      console.log("Contenido del conductor")
      
    }else if(usuario[0].rol === 'pasajero'){
      // Mostrar el contenido para usuarios pasajeros
      console.log("Contenido del pasajero")
  
    }
  };
// Ejecuta la función mostrarContenidoSegunRol cuando el DOM se ha cargado
  document.addEventListener('DOMContentLoaded', mostrarContenidoSegunRol());
});










