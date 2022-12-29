/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 29/12/2022
*/

//--------------------------------------------------------------------------------------------------
//Muestra ventana emergente de información.
function mostrarVentanaEmergente(mensaje, icono) {
    Swal.fire({
      icon: icono,
      text: mensaje,
      confirmButtonText: 'Aceptar',
    })
  }