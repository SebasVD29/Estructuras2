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
  });
  