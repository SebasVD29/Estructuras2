var usuario;
fetch('/datos')
.then((response) => response.json())
.then((data) => {
  // Manipula los datos recibidos y colócalos en el DOM del cliente
  
  usuario = data;
  console.log(usuario[0].rol);


})
.catch((error) => {
  console.error('Error al obtener los datos:', error);
});

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.wrapper');
  const loginLink = document.querySelector('.login-link');
  const registroLink = document.querySelector('.registro-link');
  const btnPopUp = document.querySelector('.btnLogin-popup');
  const iconClose = document.querySelector('.icon-close');

  registroLink.addEventListener('click', () => {
    wrapper.classList.add('active');
  });

  loginLink.addEventListener('click', () => {
    wrapper.classList.add('active');
  });

  btnPopUp.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
  });

  iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
  });

  
  function mostrarContenidoSegunRol() {
    //const usuario = obtenerUsuarioAutenticado();
    console.log(usuario);
  
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

  document.addEventListener('DOMContentLoaded', mostrarContenidoSegunRol());
});










